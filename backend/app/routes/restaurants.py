from flask import Blueprint, request, jsonify
from app.models import Restaurant

restaurants_bp = Blueprint('restaurants', __name__)

@restaurants_bp.route('/', methods=['GET'])
def get_restaurants():
    """Get all restaurants"""
    try:
        language = request.args.get('lang', 'ar')
        restaurants = Restaurant.query.filter_by(is_active=True).all()
        
        return jsonify({
            'restaurants': [restaurant.to_dict(language) for restaurant in restaurants]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@restaurants_bp.route('/<int:restaurant_id>', methods=['GET'])
def get_restaurant(restaurant_id):
    """Get specific restaurant"""
    try:
        language = request.args.get('lang', 'ar')
        restaurant = Restaurant.query.get_or_404(restaurant_id)
        
        return jsonify({
            'restaurant': restaurant.to_dict(language)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500