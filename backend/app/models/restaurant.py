from datetime import datetime
from app.database import db

class Restaurant(db.Model):
    __tablename__ = 'restaurants'
    
    id = db.Column(db.Integer, primary_key=True)
    name_ar = db.Column(db.String(100), nullable=False)
    name_en = db.Column(db.String(100), nullable=False)
    description_ar = db.Column(db.Text)
    description_en = db.Column(db.Text)
    category = db.Column(db.String(50), nullable=False)  # مشاوي، بيتزا، مأكولات بحرية، نباتي
    address = db.Column(db.Text, nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    open_times = db.Column(db.String(100), nullable=False)  # "9:00 AM - 11:00 PM"
    photo_url = db.Column(db.String(255))
    rating = db.Column(db.Float, default=0.0)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Foreign key to admin
    admin_id = db.Column(db.Integer, db.ForeignKey('admins.id'), nullable=True)
    
    # Relationships
    dishes = db.relationship('Dish', backref='restaurant', lazy=True, cascade='all, delete-orphan')
    orders = db.relationship('Order', backref='restaurant', lazy=True)
    reviews = db.relationship('Review', backref='restaurant', lazy=True)
    
    def get_average_rating(self):
        """Calculate average rating from reviews"""
        if self.reviews:
            total = sum([review.rating for review in self.reviews])
            return round(total / len(self.reviews), 1)
        return 0.0
    
    def update_rating(self):
        """Update restaurant rating based on reviews"""
        self.rating = self.get_average_rating()
        db.session.commit()
    
    def to_dict(self, language='ar'):
        """Convert restaurant to dictionary"""
        name = self.name_ar if language == 'ar' else self.name_en
        description = self.description_ar if language == 'ar' else self.description_en
        
        return {
            'id': self.id,
            'name': name,
            'description': description,
            'category': self.category,
            'address': self.address,
            'phone': self.phone,
            'open_times': self.open_times,
            'photo_url': self.photo_url,
            'rating': self.rating,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'dishes_count': len(self.dishes),
            'reviews_count': len(self.reviews)
        }
    
    def __repr__(self):
        return f'<Restaurant {self.name_ar}>'