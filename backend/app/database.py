from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

db = SQLAlchemy()
migrate = Migrate()

def init_db(app):
    """Initialize database with Flask app"""
    db.init_app(app)
    migrate.init_app(app, db)
    
    with app.app_context():
        # Import all models here to ensure they are registered
        from app.models import user, restaurant, dish, order, review, admin
        
        # Create all tables
        db.create_all()
        
        print("Database initialized successfully!")

def create_sample_data():
    """Create sample data for development"""
    from app.models.user import User
    from app.models.restaurant import Restaurant
    from app.models.admin import Admin
    from werkzeug.security import generate_password_hash
    
    # Create admin user
    if not Admin.query.filter_by(username='admin').first():
        admin = Admin(
            username='admin',
            password='admin123',
            role='admin'
        )
        db.session.add(admin)
    
    # Create sample restaurant admin
    if not Admin.query.filter_by(username='restaurant1').first():
        restaurant_admin = Admin(
            username='restaurant1',
            password='restaurant123',
            role='restaurant_admin'
        )
        db.session.add(restaurant_admin)
    
    # Create sample user
    if not User.query.filter_by(email='test@sahtein.com').first():
        user = User(
            name='أحمد محمد',
            email='test@sahtein.com',
            phone='+963911234567',
            address='دمشق، باب توما',
            password='password123'
        )
        db.session.add(user)
    
    # Create sample restaurant
    if not Restaurant.query.filter_by(name_ar='مطعم الشام').first():
        restaurant = Restaurant(
            name_ar='مطعم الشام الدمشقي',
            name_en='Damascus Al Sham Restaurant',
            description_ar='مطعم متخصص في المأكولات الشامية الأصيلة والكبة والمحاشي',
            description_en='Authentic Damascene cuisine restaurant specializing in traditional Syrian dishes',
            category='مشاوي',
            address='دمشق، شارع بغداد، باب شرقي',
            phone='+963112345678',
            open_times='9:00 AM - 11:00 PM',
            admin_id=2  # restaurant admin
        )
        db.session.add(restaurant)
    
    try:
        db.session.commit()
        print("Sample data created successfully!")
    except Exception as e:
        db.session.rollback()
        print(f"Error creating sample data: {e}")