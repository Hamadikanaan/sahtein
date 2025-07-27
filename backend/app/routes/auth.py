from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.database import db
from app.models import User, Admin
from werkzeug.security import check_password_hash

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """User registration"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'phone', 'address', 'password']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400
        
        # Create new user
        user = User(
            name=data['name'],
            email=data['email'],
            phone=data['phone'],
            address=data['address'],
            password=data['password']
        )
        
        db.session.add(user)
        db.session.commit()
        
        # Create access token
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'message': 'Registration successful',
            'access_token': access_token,
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Unified login for Users and Admins - ERWEITERT für E-Mail Support"""
    try:
        data = request.get_json()
        
        # Get login credentials
        email_or_username = data.get('email')
        password = data.get('password')
        
        if not email_or_username or not password:
            return jsonify({'error': 'Email/Username and password required'}), 400
        
        # 1. Zuerst prüfen: User mit normaler E-Mail
        user = User.query.filter_by(email=email_or_username).first()
        if user and user.check_password(password):
            if not user.is_active:
                return jsonify({'error': 'Account is disabled'}), 401
            
            access_token = create_access_token(identity=user.id)
            return jsonify({
                'message': 'Login successful',
                'access_token': access_token,
                'user': user.to_dict(),
                'user_type': 'customer'
            }), 200
        
        # 2. NEU: Admin mit automatisch generierter E-Mail (@restaurant.com)
        admin_by_email = Admin.query.filter_by(email=email_or_username).first()
        if admin_by_email and admin_by_email.check_password(password):
            return handle_admin_login(admin_by_email)
        
        # 3. Fallback: Admin mit Username (für Rückwärtskompatibilität)
        admin_by_username = Admin.query.filter_by(username=email_or_username).first()
        if admin_by_username and admin_by_username.check_password(password):
            return handle_admin_login(admin_by_username)
        
        # 4. Spezialfall: Wenn jemand nur den Restaurant-Namen eingibt
        # Automatisch .@restaurant.com anhängen
        if '@' not in email_or_username:
            potential_email = f"{email_or_username}@restaurant.com"
            admin_generated = Admin.query.filter_by(email=potential_email).first()
            if admin_generated and admin_generated.check_password(password):
                return handle_admin_login(admin_generated)
        
        return jsonify({'error': 'Invalid credentials'}), 401
        
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({'error': 'Server error during login'}), 500

def handle_admin_login(admin):
    """Helper function for admin login validation"""
    if not admin.is_active:
        return jsonify({'error': 'Admin account is disabled'}), 401
    
    if admin.status != 'approved':
        status_messages = {
            'pending': 'Ihr Antrag wird noch geprüft. Bitte warten Sie auf die Genehmigung.',
            'rejected': 'Ihr Antrag wurde abgelehnt. Kontaktieren Sie den Support.'
        }
        message = status_messages.get(admin.status, 'Account pending approval')
        return jsonify({'error': message}), 401
    
    # Update last login
    admin.update_last_login()
    
    # Create access token with admin role
    access_token = create_access_token(
        identity=admin.id,
        additional_claims={'role': admin.role, 'restaurant_id': admin.restaurant_id}
    )
    
    return jsonify({
        'message': 'Admin login successful',
        'access_token': access_token,
        'admin': admin.to_dict(),
        'user_type': 'admin',
        'login_email': admin.email  # NEU: Zeige die korrekte Login-E-Mail
    }), 200

@auth_bp.route('/admin/login', methods=['POST'])
def admin_login():
    """Admin login (kept for backward compatibility)"""
    try:
        data = request.get_json()
        
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'error': 'Username and password required'}), 400
        
        # Find admin by username or email
        admin = Admin.query.filter(
            (Admin.username == username) | (Admin.email == username)
        ).first()
        
        if not admin or not admin.check_password(password):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        return handle_admin_login(admin)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get current user profile"""
    try:
        user_id = get_jwt_identity()
        
        # First try to find as User
        user = User.query.get(user_id)
        if user:
            return jsonify({'user': user.to_dict()}), 200
        
        # If not found as user, try as Admin
        admin = Admin.query.get(user_id)
        if admin:
            return jsonify({'admin': admin.to_dict()}), 200
        
        return jsonify({'error': 'Profile not found'}), 404
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# NEU: Check Email Route für Registrierung
@auth_bp.route('/check-email', methods=['POST'])
def check_email():
    """Check if email/username is available"""
    try:
        data = request.get_json()
        email = data.get('email')
        
        if not email:
            return jsonify({'error': 'Email required'}), 400
        
        # Check if it's a customer email
        user_exists = User.query.filter_by(email=email).first() is not None
        
        # Check if it's an admin email
        admin_exists = Admin.query.filter_by(email=email).first() is not None
        
        # Check if it's an admin username
        username_exists = Admin.query.filter_by(username=email).first() is not None
        
        available = not (user_exists or admin_exists or username_exists)
        
        response = {
            'available': available,
            'is_user': user_exists,
            'is_admin': admin_exists or username_exists
        }
        
        # Wenn es ein Restaurant-Name ist, zeige die automatische E-Mail
        if not '@' in email:
            response['suggested_email'] = f"{email}@restaurant.com"
        
        return jsonify(response), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# NEU: Restaurant Registration Confirmation
@auth_bp.route('/restaurant/registration-info', methods=['POST'])
def restaurant_registration_info():
    """Get registration confirmation info for restaurant"""
    try:
        data = request.get_json()
        restaurant_name = data.get('restaurant_name')
        
        if not restaurant_name:
            return jsonify({'error': 'Restaurant name required'}), 400
        
        # Generate the login email that will be created
        login_email = f"{restaurant_name}@restaurant.com"
        
        return jsonify({
            'restaurant_name': restaurant_name,
            'login_email': login_email,
            'message': f'Nach der Genehmigung können Sie sich mit {login_email} anmelden',
            'status': 'Diese Informationen erhalten Sie nach der Registrierung'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500