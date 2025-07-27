# app/routes/restaurant_admin.py - Restaurant Registration & Admin APIs - FIXED
from flask import Blueprint, request, jsonify
from app.database import db
from app.models.admin import Admin
from app.models.restaurant import Restaurant

restaurant_admin_bp = Blueprint('restaurant_admin', __name__)

@restaurant_admin_bp.route('/api/restaurant/register', methods=['POST', 'OPTIONS'])
def register_restaurant():
    """Register a new restaurant with admin account"""

    if request.method == 'OPTIONS':
        return '', 200

    try:
        data = request.get_json()

        # Validate required fields
        if not data or not data.get('admin') or not data.get('restaurant'):
            return jsonify({'error': 'Missing required data'}), 400

        admin_data = data['admin']
        restaurant_data = data['restaurant']
        owner_data = data.get('owner', {})

        # Check if username already exists
        existing_admin = Admin.query.filter_by(username=admin_data['username']).first()
        if existing_admin:
            return jsonify({'error': 'Username already exists'}), 409

        # Create restaurant first
        restaurant = Restaurant(
            name_ar=restaurant_data['name_ar'],
            name_en=restaurant_data['name_en'],
            description_ar=restaurant_data['description_ar'],
            description_en=restaurant_data['description_en'],
            category=restaurant_data['category'],
            address=restaurant_data['address'],
            phone=restaurant_data['phone'],
            open_times=restaurant_data['open_times'],
            is_active=False  # Will be activated when approved
        )
        db.session.add(restaurant)
        db.session.flush()  # Get restaurant ID

        # Create admin account
        admin = Admin(
            admin_data['username'],        # username
            admin_data['password'],        # password
            'restaurant_admin',            # role
            restaurant.id                  # restaurant_id
        )
        admin.status = 'pending'          # Set status after creation
        admin.is_active = False           # Will be activated when approved
        db.session.add(admin)
        db.session.flush()                # Get admin ID

        # Update restaurant with admin_id
        restaurant.admin_id = admin.id

        db.session.commit()

        return jsonify({
            'message': 'Restaurant registration submitted successfully',
            'admin_id': admin.id,
            'restaurant_id': restaurant.id,
            'status': 'pending',
            'username': admin.username,
            'login_email': admin.email  # NEU: Zeige die Login-E-Mail
        }), 201

    except Exception as e:
        db.session.rollback()
        print(f"Registration error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@restaurant_admin_bp.route('/api/admin/restaurant-applications', methods=['GET'])
def get_restaurant_applications():
    """Get all restaurant applications for admin review - FIXED: Zeigt E-Mail"""

    try:
        # Get all restaurant admins (applications)
        applications = Admin.query.filter_by(role='restaurant_admin').all()

        result = []
        for admin in applications:
            # NEU: E-Mail automatisch generieren falls nicht vorhanden
            if not hasattr(admin, 'email') or not admin.email:
                admin_email = f"{admin.username}@restaurant.com"
            else:
                admin_email = admin.email
            
            app_data = {
                'id': admin.id,
                'username': admin.username,
                'email': admin_email,  # NEU: E-Mail hinzufügen
                'status': admin.status,
                'created_at': admin.created_at.isoformat() if admin.created_at else None,
                'is_active': admin.is_active
            }

            # Get restaurant data
            if admin.restaurant_id:
                restaurant = Restaurant.query.get(admin.restaurant_id)
                if restaurant:
                    app_data['restaurant'] = {
                        'name_ar': restaurant.name_ar,
                        'name_en': restaurant.name_en,
                        'description_ar': restaurant.description_ar,
                        'description_en': restaurant.description_en,
                        'category': restaurant.category,
                        'city': 'دمشق',  # Default city
                        'address': restaurant.address,
                        'phone': restaurant.phone,
                        'open_times': restaurant.open_times
                    }
                else:
                    # Default restaurant data if not found
                    app_data['restaurant'] = {
                        'name_ar': 'مطعم غير محدد',
                        'name_en': 'Unknown Restaurant',
                        'description_ar': 'وصف غير متوفر',
                        'description_en': 'Description not available',
                        'category': 'غير محدد',
                        'city': 'غير محدد',
                        'address': 'عنوان غير محدد',
                        'phone': 'غير محدد',
                        'open_times': 'غير محدد'
                    }
            else:
                # Default restaurant data if no restaurant_id
                app_data['restaurant'] = {
                    'name_ar': 'مطعم غير محدد',
                    'name_en': 'Unknown Restaurant',
                    'description_ar': 'وصف غير متوفر',
                    'description_en': 'Description not available',
                    'category': 'غير محدد',
                    'city': 'غير محدد',
                    'address': 'عنوان غير محدد',
                    'phone': 'غير محدد',
                    'open_times': 'غير محدد'
                }

            # Owner data - NEU: Verwende die automatische E-Mail
            app_data['owner'] = {
                'name': 'صاحب المطعم',
                'email': admin_email,  # NEU: Verwende die korrekte E-Mail
                'phone': '+963 999 123 456'
            }

            result.append(app_data)

        return jsonify({
            'applications': result,
            'total': len(result)
        }), 200

    except Exception as e:
        print(f"Error loading applications: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@restaurant_admin_bp.route('/api/admin/restaurant-applications/<int:app_id>/approve', methods=['POST'])
def approve_restaurant_application(app_id):
    """Approve a restaurant application"""

    try:
        admin = Admin.query.get(app_id)
        if not admin:
            return jsonify({'error': 'Application not found'}), 404

        if admin.role != 'restaurant_admin':
            return jsonify({'error': 'Invalid application type'}), 400

        # Update admin status
        admin.status = 'approved'
        admin.is_active = True

        # Activate associated restaurant
        if admin.restaurant_id:
            restaurant = Restaurant.query.get(admin.restaurant_id)
            if restaurant:
                restaurant.is_active = True

        db.session.commit()

        # NEU: E-Mail für Response
        admin_email = admin.email if hasattr(admin, 'email') and admin.email else f"{admin.username}@restaurant.com"

        return jsonify({
            'message': 'Restaurant application approved successfully',
            'admin_id': admin.id,
            'status': admin.status,
            'username': admin.username,
            'login_email': admin_email  # NEU: Zeige Login-E-Mail
        }), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error approving application: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@restaurant_admin_bp.route('/api/admin/restaurant-applications/<int:app_id>/reject', methods=['POST'])
def reject_restaurant_application(app_id):
    """Reject a restaurant application"""

    try:
        admin = Admin.query.get(app_id)
        if not admin:
            return jsonify({'error': 'Application not found'}), 404

        if admin.role != 'restaurant_admin':
            return jsonify({'error': 'Invalid application type'}), 400

        # Get rejection reason from request
        data = request.get_json() or {}
        reason = data.get('reason', 'Application rejected by admin')

        # Update admin status
        admin.status = 'rejected'
        admin.is_active = False

        # Deactivate associated restaurant
        if admin.restaurant_id:
            restaurant = Restaurant.query.get(admin.restaurant_id)
            if restaurant:
                restaurant.is_active = False

        db.session.commit()

        return jsonify({
            'message': 'Restaurant application rejected',
            'admin_id': admin.id,
            'status': admin.status,
            'reason': reason,
            'username': admin.username
        }), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error rejecting application: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@restaurant_admin_bp.route('/api/admin/applications/stats', methods=['GET'])
def get_application_stats():
    """Get statistics for admin dashboard"""

    try:
        total = Admin.query.filter_by(role='restaurant_admin').count()
        pending = Admin.query.filter_by(role='restaurant_admin', status='pending').count()
        approved = Admin.query.filter_by(role='restaurant_admin', status='approved').count()
        rejected = Admin.query.filter_by(role='restaurant_admin', status='rejected').count()

        return jsonify({
            'total': total,
            'pending': pending,
            'approved': approved,
            'rejected': rejected
        }), 200

    except Exception as e:
        print(f"Error getting stats: {e}")
        return jsonify({'error': 'Internal server error'}), 500