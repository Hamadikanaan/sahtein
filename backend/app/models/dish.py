# app/models/dish.py - Updated with all fields
from datetime import datetime
from app.database import db

class Dish(db.Model):
    __tablename__ = 'dishes'
    
    id = db.Column(db.Integer, primary_key=True)
    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurants.id'), nullable=False)
    name_ar = db.Column(db.String(100), nullable=False)
    name_en = db.Column(db.String(100), nullable=False)
    description_ar = db.Column(db.Text)
    description_en = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    ingredients_ar = db.Column(db.Text)
    ingredients_en = db.Column(db.Text)
    photo_url = db.Column(db.String(255))
    is_available = db.Column(db.Boolean, default=True)
    category = db.Column(db.String(50), default='أطباق رئيسية')  # مقبلات، أطباق رئيسية، حلويات، مشروبات
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    order_items = db.relationship('OrderItem', backref='dish', lazy=True)
    
    def to_dict(self, language='ar'):
        """Convert dish to dictionary"""
        name = self.name_ar if language == 'ar' else self.name_en
        description = self.description_ar if language == 'ar' else self.description_en
        ingredients = self.ingredients_ar if language == 'ar' else self.ingredients_en
        
        return {
            'id': self.id,
            'restaurant_id': self.restaurant_id,
            'name': name,
            'name_ar': self.name_ar,
            'name_en': self.name_en,
            'description': description,
            'description_ar': self.description_ar,
            'description_en': self.description_en,
            'price': self.price,
            'ingredients': ingredients,
            'ingredients_ar': self.ingredients_ar,
            'ingredients_en': self.ingredients_en,
            'photo_url': self.photo_url,
            'is_available': self.is_available,
            'category': self.category,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<Dish {self.name_ar}>'