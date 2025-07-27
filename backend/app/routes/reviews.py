from flask import Blueprint
from app.models import Review

reviews_bp = Blueprint('reviews', __name__)

@reviews_bp.route('/', methods=['GET'])
def get_reviews():
    """Get reviews"""
    return {'message': 'Reviews endpoint'}

@reviews_bp.route('/', methods=['POST'])
def create_review():
    """Create new review"""
    return {'message': 'Create review endpoint'}