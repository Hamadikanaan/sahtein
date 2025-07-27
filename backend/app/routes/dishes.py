# app/routes/dishes.py - Complete Dishes API
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.database import db
from app.models import Dish, Restaurant, Admin
from datetime import datetime

dishes_bp = Blueprint('dishes', __name__)

@dishes_bp.route('/', methods=['GET'])
def get_all_dishes():
    """Get all dishes (for admin purposes)"""
    try:
        lang = request.args.get('lang', 'ar')
        dishes = Dish.query.filter_by(is_available=True).all()
        
        return jsonify({
            'dishes': [dish.to_dict(lang) for dish in dishes]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@dishes_bp.route('/restaurant/<int:restaurant_id>', methods=['GET'])
def get_restaurant_dishes(restaurant_id):
    """Get dishes for a specific restaurant"""
    try:
        lang = request.args.get('lang', 'ar')
        
        # Check if restaurant exists
        restaurant = Restaurant.query.get(restaurant_id)
        if not restaurant:
            return jsonify({'error': 'Restaurant not found'}), 404
        
        # Get dishes for this restaurant
        dishes = Dish.query.filter_by(restaurant_id=restaurant_id).all()
        
        return jsonify({
            'dishes': [dish.to_dict(lang) for dish in dishes],
            'restaurant': restaurant.to_dict(lang)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@dishes_bp.route('/', methods=['POST'])
@jwt_required()
def create_dish():
    """Create new dish (for restaurant admins)"""
    try:
        claims = get_jwt()
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Only restaurant admins and super admins can create dishes
        if not claims.get('role') or claims.get('role') not in ['admin', 'restaurant_admin']:
            return jsonify({'error': 'Access denied'}), 403
        
        # Validate required fields
        required_fields = ['name_ar', 'name_en', 'description_ar', 'price', 'restaurant_id']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Check if restaurant exists
        restaurant = Restaurant.query.get(data['restaurant_id'])
        if not restaurant:
            return jsonify({'error': 'Restaurant not found'}), 404
        
        # If restaurant admin, check if they own this restaurant
        if claims.get('role') == 'restaurant_admin':
            if claims.get('restaurant_id') != data['restaurant_id']:
                return jsonify({'error': 'Access denied - not your restaurant'}), 403
        
        # Validate price
        try:
            price = float(data['price'])
            if price < 0:
                return jsonify({'error': 'Price must be positive'}), 400
        except (ValueError, TypeError):
            return jsonify({'error': 'Invalid price format'}), 400
        
        # Create dish
        dish = Dish(
            restaurant_id=data['restaurant_id'],
            name_ar=data['name_ar'],
            name_en=data['name_en'],
            description_ar=data.get('description_ar', ''),
            description_en=data.get('description_en', ''),
            price=price,
            ingredients_ar=data.get('ingredients_ar', ''),
            ingredients_en=data.get('ingredients_en', ''),
            photo_url=data.get('photo_url', ''),
            is_available=data.get('is_available', True),
            category=data.get('category', 'أطباق رئيسية')
        )
        
        db.session.add(dish)
        db.session.commit()
        
        return jsonify({
            'message': 'Dish created successfully',
            'dish': dish.to_dict('ar')
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@dishes_bp.route('/<int:dish_id>', methods=['GET'])
def get_dish(dish_id):
    """Get specific dish"""
    try:
        lang = request.args.get('lang', 'ar')
        
        dish = Dish.query.get(dish_id)
        if not dish:
            return jsonify({'error': 'Dish not found'}), 404
        
        return jsonify({'dish': dish.to_dict(lang)}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@dishes_bp.route('/<int:dish_id>', methods=['PUT'])
@jwt_required()
def update_dish(dish_id):
    """Update dish (for restaurant admins)"""
    try:
        claims = get_jwt()
        data = request.get_json()
        
        # Only restaurant admins and super admins can update dishes
        if not claims.get('role') or claims.get('role') not in ['admin', 'restaurant_admin']:
            return jsonify({'error': 'Access denied'}), 403
        
        dish = Dish.query.get(dish_id)
        if not dish:
            return jsonify({'error': 'Dish not found'}), 404
        
        # If restaurant admin, check if they own this restaurant
        if claims.get('role') == 'restaurant_admin':
            if claims.get('restaurant_id') != dish.restaurant_id:
                return jsonify({'error': 'Access denied - not your restaurant'}), 403
        
        # Update fields
        if 'name_ar' in data:
            dish.name_ar = data['name_ar']
        if 'name_en' in data:
            dish.name_en = data['name_en']
        if 'description_ar' in data:
            dish.description_ar = data['description_ar']
        if 'description_en' in data:
            dish.description_en = data['description_en']
        if 'price' in data:
            try:
                price = float(data['price'])
                if price < 0:
                    return jsonify({'error': 'Price must be positive'}), 400
                dish.price = price
            except (ValueError, TypeError):
                return jsonify({'error': 'Invalid price format'}), 400
        if 'ingredients_ar' in data:
            dish.ingredients_ar = data['ingredients_ar']
        if 'ingredients_en' in data:
            dish.ingredients_en = data['ingredients_en']
        if 'photo_url' in data:
            dish.photo_url = data['photo_url']
        if 'is_available' in data:
            dish.is_available = bool(data['is_available'])
        if 'category' in data:
            dish.category = data['category']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Dish updated successfully',
            'dish': dish.to_dict('ar')
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@dishes_bp.route('/<int:dish_id>', methods=['DELETE'])
@jwt_required()
def delete_dish(dish_id):
    """Delete dish (for restaurant admins)"""
    try:
        claims = get_jwt()
        
        # Only restaurant admins and super admins can delete dishes
        if not claims.get('role') or claims.get('role') not in ['admin', 'restaurant_admin']:
            return jsonify({'error': 'Access denied'}), 403
        
        dish = Dish.query.get(dish_id)
        if not dish:
            return jsonify({'error': 'Dish not found'}), 404
        
        # If restaurant admin, check if they own this restaurant
        if claims.get('role') == 'restaurant_admin':
            if claims.get('restaurant_id') != dish.restaurant_id:
                return jsonify({'error': 'Access denied - not your restaurant'}), 403
        
        # Check if dish is used in any orders
        from app.models import OrderItem
        if OrderItem.query.filter_by(dish_id=dish_id).first():
            # Instead of deleting, just mark as unavailable
            dish.is_available = False
            db.session.commit()
            return jsonify({
                'message': 'Dish marked as unavailable (used in orders)',
                'dish': dish.to_dict('ar')
            }), 200
        
        db.session.delete(dish)
        db.session.commit()
        
        return jsonify({'message': 'Dish deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@dishes_bp.route('/<int:dish_id>/toggle', methods=['POST'])
@jwt_required()
def toggle_dish_availability(dish_id):
    """Toggle dish availability (for restaurant admins)"""
    try:
        claims = get_jwt()
        
        # Only restaurant admins and super admins can toggle availability
        if not claims.get('role') or claims.get('role') not in ['admin', 'restaurant_admin']:
            return jsonify({'error': 'Access denied'}), 403
        
        dish = Dish.query.get(dish_id)
        if not dish:
            return jsonify({'error': 'Dish not found'}), 404
        
        # If restaurant admin, check if they own this restaurant
        if claims.get('role') == 'restaurant_admin':
            if claims.get('restaurant_id') != dish.restaurant_id:
                return jsonify({'error': 'Access denied - not your restaurant'}), 403
        
        # Toggle availability
        dish.is_available = not dish.is_available
        db.session.commit()
        
        status = 'available' if dish.is_available else 'unavailable'
        return jsonify({
            'message': f'Dish marked as {status}',
            'dish': dish.to_dict('ar')
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@dishes_bp.route('/restaurant/<int:restaurant_id>/stats', methods=['GET'])
@jwt_required()
def get_restaurant_dish_stats(restaurant_id):
    """Get dish statistics for a restaurant"""
    try:
        claims = get_jwt()
        
        # Only restaurant admins and super admins can view stats
        if not claims.get('role') or claims.get('role') not in ['admin', 'restaurant_admin']:
            return jsonify({'error': 'Access denied'}), 403
        
        # If restaurant admin, check if they own this restaurant
        if claims.get('role') == 'restaurant_admin':
            if claims.get('restaurant_id') != restaurant_id:
                return jsonify({'error': 'Access denied'}), 403
        
        total_dishes = Dish.query.filter_by(restaurant_id=restaurant_id).count()
        available_dishes = Dish.query.filter_by(restaurant_id=restaurant_id, is_available=True).count()
        unavailable_dishes = total_dishes - available_dishes
        
        # Get popular dishes (from order items)
        from app.models import OrderItem
        popular_dishes = db.session.query(
            Dish.id,
            Dish.name_ar,
            db.func.sum(OrderItem.quantity).label('total_ordered')
        ).join(OrderItem).filter(
            Dish.restaurant_id == restaurant_id
        ).group_by(Dish.id).order_by(
            db.func.sum(OrderItem.quantity).desc()
        ).limit(5).all()
        
        return jsonify({
            'total_dishes': total_dishes,
            'available_dishes': available_dishes,
            'unavailable_dishes': unavailable_dishes,
            'popular_dishes': [
                {
                    'id': dish.id,
                    'name': dish.name_ar,
                    'total_ordered': dish.total_ordered
                } for dish in popular_dishes
            ]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500