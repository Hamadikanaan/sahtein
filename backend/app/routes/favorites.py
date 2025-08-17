# app/routes/favorites.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.database import db
from app.models.user import User
from app.models.restaurant import Restaurant

favorites_bp = Blueprint('favorites', __name__)

# Simple Favorites Model
class Favorite(db.Model):
    __tablename__ = 'favorites'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurants.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    
    __table_args__ = (db.UniqueConstraint('user_id', 'restaurant_id', name='unique_user_restaurant'),)

@favorites_bp.route('/', methods=['GET'])
@jwt_required()
def get_user_favorites():
    try:
        current_user_id = get_jwt_identity()
        db.create_all()
        
        favorites = db.session.query(Favorite, Restaurant).join(
            Restaurant, Favorite.restaurant_id == Restaurant.id
        ).filter(
            Favorite.user_id == current_user_id,
            Restaurant.is_active == True
        ).all()
        
        result = []
        for favorite, restaurant in favorites:
            result.append({
                'id': favorite.id,
                'user_id': favorite.user_id,
                'restaurant_id': favorite.restaurant_id,
                'created_at': favorite.created_at.isoformat(),
                'restaurant': restaurant.to_dict('ar')
            })
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify([]), 200

@favorites_bp.route('/', methods=['POST'])
@jwt_required()
def add_to_favorites():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        restaurant_id = data.get('restaurant_id')
        
        if not restaurant_id:
            return jsonify({'error': 'restaurant_id is required'}), 400
        
        restaurant = Restaurant.query.get(restaurant_id)
        if not restaurant:
            return jsonify({'error': 'Restaurant not found'}), 404
        
        db.create_all()
        
        existing = Favorite.query.filter_by(
            user_id=current_user_id, 
            restaurant_id=restaurant_id
        ).first()
        
        if existing:
            return jsonify({'message': 'Already in favorites'}), 200
        
        favorite = Favorite(
            user_id=current_user_id,
            restaurant_id=restaurant_id
        )
        
        db.session.add(favorite)
        db.session.commit()
        
        return jsonify({'message': 'Added to favorites'}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@favorites_bp.route('/<int:restaurant_id>', methods=['DELETE'])
@jwt_required()
def remove_from_favorites(restaurant_id):
    try:
        current_user_id = get_jwt_identity()
        
        favorite = Favorite.query.filter_by(
            user_id=current_user_id,
            restaurant_id=restaurant_id
        ).first()
        
        if not favorite:
            return jsonify({'error': 'Not in favorites'}), 404
        
        db.session.delete(favorite)
        db.session.commit()
        
        return jsonify({'message': 'Removed from favorites'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500