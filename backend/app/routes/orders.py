# app/routes/orders.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.database import db
from app.models import Order, OrderItem, Dish, User, Restaurant
from datetime import datetime

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/user', methods=['GET'])
@jwt_required()
def get_user_orders():
    """Get orders for current user"""
    try:
        user_id = get_jwt_identity()
        
        # Check if user exists
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get user orders
        orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()
        
        return jsonify({
            'orders': [order.to_dict('ar') for order in orders]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@orders_bp.route('/', methods=['POST'])
@jwt_required()
def create_order():
    """Create new order"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['restaurant_id', 'delivery_address', 'phone', 'items']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Check if user exists
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Check if restaurant exists and is active
        restaurant = Restaurant.query.get(data['restaurant_id'])
        if not restaurant or not restaurant.is_active:
            return jsonify({'error': 'Restaurant not available'}), 400
        
        # Validate items
        if not isinstance(data['items'], list) or len(data['items']) == 0:
            return jsonify({'error': 'Order must contain at least one item'}), 400
        
        # Create order
        order = Order(
            user_id=user_id,
            restaurant_id=data['restaurant_id'],
            delivery_address=data['delivery_address'],
            phone=data['phone'],
            notes=data.get('notes', ''),
            payment_method=data.get('payment_method', 'cash'),
            total_price=0  # Will be calculated
        )
        
        db.session.add(order)
        db.session.flush()  # Get order ID
        
        total_price = 0
        
        # Add order items
        for item_data in data['items']:
            if not item_data.get('dish_id') or not item_data.get('quantity'):
                return jsonify({'error': 'Each item must have dish_id and quantity'}), 400
            
            # Check if dish exists and is available
            dish = Dish.query.get(item_data['dish_id'])
            if not dish:
                return jsonify({'error': f'Dish {item_data["dish_id"]} not found'}), 400
            
            if not dish.is_available:
                return jsonify({'error': f'Dish "{dish.name_ar}" is not available'}), 400
            
            if dish.restaurant_id != data['restaurant_id']:
                return jsonify({'error': f'Dish "{dish.name_ar}" does not belong to this restaurant'}), 400
            
            quantity = int(item_data['quantity'])
            if quantity <= 0:
                return jsonify({'error': 'Quantity must be greater than 0'}), 400
            
            # Create order item
            order_item = OrderItem(
                order_id=order.id,
                dish_id=dish.id,
                quantity=quantity,
                price=dish.price  # Store current price
            )
            
            db.session.add(order_item)
            total_price += dish.price * quantity
        
        # Update order total
        order.total_price = total_price
        
        db.session.commit()
        
        return jsonify({
            'message': 'Order created successfully',
            'order': order.to_dict('ar')
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@orders_bp.route('/<int:order_id>', methods=['GET'])
@jwt_required()
def get_order(order_id):
    """Get specific order"""
    try:
        user_id = get_jwt_identity()
        claims = get_jwt()
        
        order = Order.query.get(order_id)
        if not order:
            return jsonify({'error': 'Order not found'}), 404
        
        # Check if user owns this order or is admin/restaurant admin
        if order.user_id != user_id and not claims.get('role'):
            return jsonify({'error': 'Access denied'}), 403
        
        # If restaurant admin, check if order belongs to their restaurant
        if claims.get('role') == 'restaurant_admin':
            if order.restaurant_id != claims.get('restaurant_id'):
                return jsonify({'error': 'Access denied'}), 403
        
        return jsonify({'order': order.to_dict('ar')}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@orders_bp.route('/<int:order_id>/status', methods=['PUT'])
@jwt_required()
def update_order_status(order_id):
    """Update order status (for restaurant admins)"""
    try:
        claims = get_jwt()
        
        # Only restaurant admins and super admins can update status
        if not claims.get('role') or claims.get('role') not in ['admin', 'restaurant_admin']:
            return jsonify({'error': 'Access denied'}), 403
        
        data = request.get_json()
        new_status = data.get('status')
        
        if not new_status:
            return jsonify({'error': 'Status is required'}), 400
        
        valid_statuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled']
        if new_status not in valid_statuses:
            return jsonify({'error': 'Invalid status'}), 400
        
        order = Order.query.get(order_id)
        if not order:
            return jsonify({'error': 'Order not found'}), 404
        
        # If restaurant admin, check if order belongs to their restaurant
        if claims.get('role') == 'restaurant_admin':
            if order.restaurant_id != claims.get('restaurant_id'):
                return jsonify({'error': 'Access denied'}), 403
        
        order.update_status(new_status)
        
        return jsonify({
            'message': 'Order status updated successfully',
            'order': order.to_dict('ar')
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@orders_bp.route('/restaurant/<int:restaurant_id>', methods=['GET'])
@jwt_required()
def get_restaurant_orders(restaurant_id):
    """Get orders for a specific restaurant (for restaurant admins)"""
    try:
        claims = get_jwt()
        
        # Only restaurant admins and super admins can view restaurant orders
        if not claims.get('role') or claims.get('role') not in ['admin', 'restaurant_admin']:
            return jsonify({'error': 'Access denied'}), 403
        
        # If restaurant admin, check if they own this restaurant
        if claims.get('role') == 'restaurant_admin':
            if claims.get('restaurant_id') != restaurant_id:
                return jsonify({'error': 'Access denied'}), 403
        
        # Get status filter
        status = request.args.get('status')
        
        # Build query
        query = Order.query.filter_by(restaurant_id=restaurant_id)
        
        if status:
            query = query.filter_by(status=status)
        
        orders = query.order_by(Order.created_at.desc()).all()
        
        return jsonify({
            'orders': [order.to_dict('ar') for order in orders]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@orders_bp.route('/stats/user', methods=['GET'])
@jwt_required()
def get_user_order_stats():
    """Get order statistics for current user"""
    try:
        user_id = get_jwt_identity()
        
        total_orders = Order.query.filter_by(user_id=user_id).count()
        delivered_orders = Order.query.filter_by(user_id=user_id, status='delivered').count()
        pending_orders = Order.query.filter_by(user_id=user_id, status='pending').count()
        
        # Calculate total spent
        orders = Order.query.filter_by(user_id=user_id, status='delivered').all()
        total_spent = sum([order.total_price for order in orders])
        
        return jsonify({
            'total_orders': total_orders,
            'delivered_orders': delivered_orders,
            'pending_orders': pending_orders,
            'total_spent': total_spent
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@orders_bp.route('/stats/restaurant/<int:restaurant_id>', methods=['GET'])
@jwt_required()
def get_restaurant_order_stats(restaurant_id):
    """Get order statistics for a restaurant"""
    try:
        claims = get_jwt()
        
        # Only restaurant admins and super admins can view restaurant stats
        if not claims.get('role') or claims.get('role') not in ['admin', 'restaurant_admin']:
            return jsonify({'error': 'Access denied'}), 403
        
        # If restaurant admin, check if they own this restaurant
        if claims.get('role') == 'restaurant_admin':
            if claims.get('restaurant_id') != restaurant_id:
                return jsonify({'error': 'Access denied'}), 403
        
        total_orders = Order.query.filter_by(restaurant_id=restaurant_id).count()
        delivered_orders = Order.query.filter_by(restaurant_id=restaurant_id, status='delivered').count()
        pending_orders = Order.query.filter_by(restaurant_id=restaurant_id, status='pending').count()
        
        # Calculate total revenue
        orders = Order.query.filter_by(restaurant_id=restaurant_id, status='delivered').all()
        total_revenue = sum([order.total_price for order in orders])
        
        # Today's orders and revenue
        today = datetime.utcnow().date()
        today_orders = Order.query.filter_by(restaurant_id=restaurant_id).filter(
            db.func.date(Order.created_at) == today
        ).count()
        
        today_revenue = sum([
            order.total_price for order in Order.query.filter_by(
                restaurant_id=restaurant_id, status='delivered'
            ).filter(db.func.date(Order.created_at) == today).all()
        ])
        
        return jsonify({
            'total_orders': total_orders,
            'delivered_orders': delivered_orders,
            'pending_orders': pending_orders,
            'total_revenue': total_revenue,
            'today_orders': today_orders,
            'today_revenue': today_revenue
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500