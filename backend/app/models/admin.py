# app/models/admin.py - ERWEITERT mit automatischer E-Mail
from datetime import datetime
from app.database import db
from werkzeug.security import generate_password_hash, check_password_hash

class Admin(db.Model):
    __tablename__ = 'admins'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)  # NEU: E-Mail Feld
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'admin' or 'restaurant_admin'
    is_active = db.Column(db.Boolean, default=True)
    status = db.Column(db.String(20), default='pending')  # pending/approved/rejected
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    
    # For restaurant admins
    restaurant_id = db.Column(db.Integer, nullable=True)
    
    def __init__(self, username, password, role='restaurant_admin', restaurant_id=None, status='pending'):
        self.username = username
        # NEU: Automatische E-Mail Generierung
        if role == 'restaurant_admin':
            self.email = f"{username}@restaurant.com"
        else:
            self.email = f"{username}@admin.com"
            
        self.password_hash = generate_password_hash(password)
        self.role = role
        self.restaurant_id = restaurant_id
        self.status = status
    
    def check_password(self, password):
        """Check if provided password matches hash"""
        return check_password_hash(self.password_hash, password)
    
    def update_last_login(self):
        """Update last login timestamp"""
        self.last_login = datetime.utcnow()
        db.session.commit()
    
    def is_super_admin(self):
        """Check if user is super admin"""
        return self.role == 'admin'
    
    def is_restaurant_admin(self):
        """Check if user is restaurant admin"""
        return self.role == 'restaurant_admin'
    
    def can_manage_restaurant(self, restaurant_id):
        """Check if admin can manage specific restaurant"""
        if self.is_super_admin():
            return True
        return self.restaurant_id == restaurant_id
    
    def approve(self):
        """Approve the admin application"""
        self.status = 'approved'
        self.is_active = True
        if self.restaurant_id:
            from app.models.restaurant import Restaurant
            restaurant = Restaurant.query.get(self.restaurant_id)
            if restaurant:
                restaurant.is_active = True
        db.session.commit()
    
    def reject(self, reason=None):
        """Reject the admin application"""
        self.status = 'rejected'
        self.is_active = False
        if self.restaurant_id:
            from app.models.restaurant import Restaurant
            restaurant = Restaurant.query.get(self.restaurant_id)
            if restaurant:
                restaurant.is_active = False
        db.session.commit()
    
    def to_dict(self):
        """Convert admin to dictionary"""
        result = {
            'id': self.id,
            'username': self.username,
            'email': self.email,  # NEU: E-Mail zurückgeben
            'role': self.role,
            'is_active': self.is_active,
            'status': self.status,
            'restaurant_id': self.restaurant_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None
        }
        
        if self.restaurant_id:
            from app.models.restaurant import Restaurant
            restaurant = Restaurant.query.get(self.restaurant_id)
            if restaurant:
                result['restaurant'] = restaurant.to_dict()
        
        return result
    
    def __repr__(self):
        return f'<Admin {self.username} ({self.email}) - {self.status}>'