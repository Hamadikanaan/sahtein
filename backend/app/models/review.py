from datetime import datetime
from app.database import db

class Review(db.Model):
    __tablename__ = 'reviews'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurants.id'), nullable=False)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=True)  # Optional reference to order
    rating = db.Column(db.Integer, nullable=False)  # 1-5 stars
    comment = db.Column(db.Text)
    is_approved = db.Column(db.Boolean, default=True)  # For moderation
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Constraints
    __table_args__ = (
        db.CheckConstraint('rating >= 1 AND rating <= 5'),
        db.UniqueConstraint('user_id', 'order_id', name='unique_user_order_review')
    )
    
    def to_dict(self):
        """Convert review to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'restaurant_id': self.restaurant_id,
            'order_id': self.order_id,
            'rating': self.rating,
            'comment': self.comment,
            'is_approved': self.is_approved,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'user_name': self.user.name,
            'restaurant_name': self.restaurant.name_ar
        }
    
    @staticmethod
    def get_restaurant_reviews(restaurant_id, approved_only=True):
        """Get all reviews for a restaurant"""
        query = Review.query.filter_by(restaurant_id=restaurant_id)
        if approved_only:
            query = query.filter_by(is_approved=True)
        return query.order_by(Review.created_at.desc()).all()
    
    @staticmethod
    def get_average_rating(restaurant_id):
        """Calculate average rating for a restaurant"""
        reviews = Review.query.filter_by(
            restaurant_id=restaurant_id, 
            is_approved=True
        ).all()
        
        if not reviews:
            return 0.0
        
        total = sum([review.rating for review in reviews])
        return round(total / len(reviews), 1)
    
    def __repr__(self):
        return f'<Review {self.rating}★ by {self.user.name}>'