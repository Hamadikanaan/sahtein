from flask import Blueprint

def register_routes(app):
    """Register all route blueprints"""
    
    # Import blueprints
    from .auth import auth_bp
    from .restaurants import restaurants_bp
    from .orders import orders_bp
    from .reviews import reviews_bp
    from .users import users_bp
    from .restaurant_admin import restaurant_admin_bp  # HIER hinzufügen
    from .dishes import dishes_bp        # ✅ NEU
    from .favorites import favorites_bp  # ✅ NEU
    
    # Register blueprints with API prefix
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(restaurants_bp, url_prefix='/api/restaurants')
    app.register_blueprint(orders_bp, url_prefix='/api/orders')
    app.register_blueprint(reviews_bp, url_prefix='/api/reviews')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(restaurant_admin_bp)  # HIER registrieren (ohne Prefix, da URLs schon /api/ haben)
    app.register_blueprint(dishes_bp, url_prefix='/api/dishes')        # ✅ NEU
    app.register_blueprint(favorites_bp, url_prefix='/api/favorites')  # ✅ NEU

    
    print("All routes registered successfully!")