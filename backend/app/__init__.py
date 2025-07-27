import os
from flask import Flask
from app.config import config
from app.database import db, init_db, create_sample_data
from app.extensions import init_extensions

def create_app(config_name=None):
    """Application factory pattern"""
    
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'development')
    
    app = Flask(__name__)
    app.url_map.strict_slashes = False
    
    # Load configuration
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    init_extensions(app)
    
    # Initialize database
    init_db(app)
    
    # Register blueprints
    from app.routes import register_routes
    register_routes(app)
    
    # Create sample data in development
    if config_name == 'development':
        with app.app_context():
            create_sample_data()
    
    @app.route('/')
    def index():
        return {
            'message': 'Sahtein API is running!',
            'version': '1.0.0',
            'endpoints': [
                '/api/auth/register',
                '/api/auth/login',
                '/api/restaurants',
                '/api/orders',
                '/api/reviews'
            ]
        }
    
    @app.route('/health')
    def health_check():
        return {'status': 'healthy'}
    
    return app


