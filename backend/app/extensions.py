from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate

# Initialize extensions
cors = CORS()
jwt = JWTManager()
migrate = Migrate()

def init_extensions(app):
    """Initialize Flask extensions"""
    
    # CORS configuration
    cors.init_app(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:4200", "http://127.0.0.1:4200"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # JWT configuration
    jwt.init_app(app)
    
    # Migrate configuration
    migrate.init_app(app)
    
    print("Extensions initialized successfully!")