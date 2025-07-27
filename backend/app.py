from app import create_app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)


# In app.py hinzufügen:
from app.routes.dishes import dishes_bp
app.register_blueprint(dishes_bp, url_prefix='/api/dishes')