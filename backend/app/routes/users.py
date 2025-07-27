from flask import Blueprint
from app.models import User

users_bp = Blueprint('users', __name__)

@users_bp.route('/profile', methods=['GET'])
def get_profile():
    """Get user profile"""
    return {'message': 'User profile endpoint'}

@users_bp.route('/orders', methods=['GET'])
def get_user_orders():
    """Get user orders"""
    return {'message': 'User orders endpoint'}