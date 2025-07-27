# app/models/order.py
from datetime import datetime
from app.database import db

class Order(db.Model):
    __tablename__ = 'orders'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurants.id'), nullable=False)
    status = db.Column(db.String(50), default='pending')  # pending, confirmed, preparing, ready, delivered, cancelled
    total_price = db.Column(db.Float, nullable=False)
    delivery_address = db.Column(db.Text, nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    notes = db.Column(db.Text)
    payment_method = db.Column(db.String(20), default='cash')  # Only cash for now
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    order_items = db.relationship('OrderItem', backref='order', lazy=True, cascade='all, delete-orphan')
    
    def update_status(self, new_status):
        """Update order status"""
        self.status = new_status
        self.updated_at = datetime.utcnow()
        db.session.commit()
    
    def calculate_total(self):
        """Calculate total price from order items"""
        total = sum([item.price * item.quantity for item in self.order_items])
        self.total_price = total
        return total
    
    def to_dict(self, language='ar'):
        """Convert order to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'restaurant_id': self.restaurant_id,
            'status': self.status,
            'total_price': self.total_price,
            'delivery_address': self.delivery_address,
            'phone': self.phone,
            'notes': self.notes,
            'payment_method': self.payment_method,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'items': [item.to_dict(language) for item in self.order_items],
            'restaurant_name': self.restaurant.name_ar if language == 'ar' else self.restaurant.name_en,
            'user_name': self.user.name
        }
    
    def __repr__(self):
        return f'<Order {self.id} - {self.status}>'


class OrderItem(db.Model):
    __tablename__ = 'order_items'
    
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    dish_id = db.Column(db.Integer, db.ForeignKey('dishes.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    price = db.Column(db.Float, nullable=False)  # Price at time of order
    
    def to_dict(self, language='ar'):
        """Convert order item to dictionary"""
        return {
            'id': self.id,
            'dish_id': self.dish_id,
            'quantity': self.quantity,
            'price': self.price,
            'subtotal': self.price * self.quantity,
            'dish_name': self.dish.name_ar if language == 'ar' else self.dish.name_en
        }
    
    def __repr__(self):
        return f'<OrderItem {self.dish.name_ar} x{self.quantity}>'