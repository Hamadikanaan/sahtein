// app/pages/restaurant-detail/restaurant-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService, Restaurant, Dish } from '../../services/api.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-restaurant-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="restaurant-detail" *ngIf="restaurant && !loading">
      <div class="restaurant-header">
        <div class="restaurant-banner">
          <div class="banner-image">🍽️</div>
          <div class="restaurant-info">
            <h1>{{ restaurant.name_ar }}</h1>
            <p class="category">{{ restaurant.category }}</p>
            <p class="address">📍 {{ restaurant.address }}</p>
            <div class="rating">
              <span class="stars">⭐⭐⭐⭐⭐</span>
              <span>{{ restaurant.rating || 4.5 }}</span>
            </div>
            <p class="hours">🕒 {{ restaurant.open_times }}</p>
          </div>
        </div>
      </div>

      <div class="menu-section">
        <h2>قائمة الطعام</h2>
        
        <!-- Category Filter -->
        <div class="category-filter" *ngIf="categories.length > 0">
          <button 
            *ngFor="let category of categories" 
            (click)="filterByCategory(category)"
            [class.active]="selectedCategory === category"
            class="category-btn"
          >
            {{ category }}
          </button>
        </div>
        
        <div class="dishes-grid" *ngIf="filteredDishes.length > 0">
          <div *ngFor="let dish of filteredDishes" class="dish-card">
            <div class="dish-image">🍽️</div>
            <div class="dish-info">
              <h3>{{ dish.name_ar }}</h3>
              <p class="dish-description">{{ dish.description }}</p>
              <p class="dish-ingredients" *ngIf="dish.ingredients">
                <strong>المكونات:</strong> {{ dish.ingredients }}
              </p>
              <div class="dish-footer">
                <span class="price">{{ formatPrice(dish.price) }}</span>
                <button 
                  (click)="addToCart(dish)" 
                  class="add-btn"
                  [disabled]="!dish.is_available"
                >
                  {{ dish.is_available ? 'إضافة للسلة' : 'غير متوفر' }}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div *ngIf="!loading && dishes.length === 0" class="no-dishes">
          <div class="no-dishes-icon">🍽️</div>
          <h3>لا توجد أطباق متاحة</h3>
          <p>هذا المطعم لم يضف أطباق بعد</p>
        </div>
        
        <div *ngIf="!loading && dishes.length > 0 && filteredDishes.length === 0" class="no-filtered-dishes">
          <div class="no-dishes-icon">🔍</div>
          <h3>لا توجد أطباق في هذه الفئة</h3>
          <button (click)="clearCategoryFilter()" class="clear-filter-btn">عرض جميع الأطباق</button>
        </div>
      </div>
    </div>

    <div *ngIf="loading" class="loading">
      <div class="spinner"></div>
      جارٍ تحميل تفاصيل المطعم...
    </div>
    
    <div *ngIf="error" class="error-message">
      <p>{{ error }}</p>
      <button (click)="retry()" class="retry-btn">إعادة المحاولة</button>
    </div>
  `,
  styles: [`
    .restaurant-detail {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    .restaurant-banner {
      background: white;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      margin-bottom: 3rem;
    }
    .banner-image {
      height: 300px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 6rem;
    }
    .restaurant-info {
      padding: 2rem;
    }
    .restaurant-info h1 {
      color: #333;
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
    .category {
      color: #667eea;
      font-size: 1.2rem;
      font-weight: 500;
      margin-bottom: 0.5rem;
    }
    .address {
      color: #666;
      margin-bottom: 1rem;
    }
    .rating {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    .stars {
      color: #ffa502;
    }
    .hours {
      color: #666;
    }
    .menu-section h2 {
      text-align: center;
      color: #333;
      margin-bottom: 2rem;
      font-size: 2rem;
    }
    
    /* Category Filter */
    .category-filter {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }
    .category-btn {
      padding: 0.5rem 1rem;
      border: 2px solid #e1e5e9;
      background: white;
      color: #666;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.9rem;
    }
    .category-btn:hover {
      border-color: #667eea;
      color: #667eea;
    }
    .category-btn.active {
      background: #667eea;
      color: white;
      border-color: #667eea;
    }
    
    .dishes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }
    .dish-card {
      background: white;
      border-radius: 15px;
      overflow: hidden;
      box-shadow: 0 8px 25px rgba(0,0,0,0.1);
      transition: transform 0.3s ease;
      border: 1px solid #e8f4fd;
    }
    .dish-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 35px rgba(0,0,0,0.15);
    }
    .dish-image {
      height: 150px;
      background: linear-gradient(45deg, #667eea, #764ba2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
    }
    .dish-info {
      padding: 1.5rem;
    }
    .dish-info h3 {
      color: #333;
      margin-bottom: 0.5rem;
      font-size: 1.2rem;
    }
    .dish-description {
      color: #666;
      margin-bottom: 0.8rem;
      font-size: 0.9rem;
      line-height: 1.4;
    }
    .dish-ingredients {
      color: #888;
      font-size: 0.8rem;
      margin-bottom: 1rem;
      padding: 0.5rem;
      background: #f8f9fa;
      border-radius: 5px;
      border-left: 3px solid #667eea;
    }
    .dish-ingredients strong {
      color: #555;
    }
    .dish-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .price {
      font-size: 1.2rem;
      font-weight: bold;
      color: #ff4757;
    }
    .add-btn {
      background: #667eea;
      color: white;
      border: none;
      padding: 0.7rem 1.2rem;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.3s ease;
      font-weight: 500;
    }
    .add-btn:hover:not(:disabled) {
      background: #5a67d8;
      transform: translateY(-1px);
    }
    .add-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
      transform: none;
    }
    
    /* Loading */
    .loading {
      text-align: center;
      padding: 4rem;
      color: #666;
      font-size: 1.2rem;
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    /* No Dishes */
    .no-dishes,
    .no-filtered-dishes {
      text-align: center;
      padding: 4rem 2rem;
    }
    .no-dishes-icon {
      font-size: 5rem;
      margin-bottom: 1rem;
      opacity: 0.6;
    }
    .no-dishes h3,
    .no-filtered-dishes h3 {
      color: #333;
      margin-bottom: 1rem;
    }
    .no-dishes p {
      color: #666;
    }
    .clear-filter-btn {
      background: #667eea;
      color: white;
      border: none;
      padding: 0.8rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      margin-top: 1rem;
    }
    .clear-filter-btn:hover {
      background: #5a67d8;
    }
    
    /* Error */
    .error-message {
      text-align: center;
      padding: 3rem;
      background: #f8d7da;
      color: #721c24;
      border-radius: 10px;
      margin: 2rem;
    }
    .retry-btn {
      margin-top: 1rem;
      padding: 0.5rem 1rem;
      background: #dc3545;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    
    @media (max-width: 768px) {
      .restaurant-detail {
        padding: 1rem;
      }
      .restaurant-info {
        padding: 1.5rem;
      }
      .dishes-grid {
        grid-template-columns: 1fr;
      }
      .category-filter {
        gap: 0.5rem;
      }
      .category-btn {
        padding: 0.4rem 0.8rem;
        font-size: 0.8rem;
      }
    }
  `]
})
export class RestaurantDetailComponent implements OnInit {
  restaurant: Restaurant | null = null;
  dishes: Dish[] = [];
  filteredDishes: Dish[] = [];
  categories: string[] = [];
  selectedCategory = 'الكل';
  loading = true;
  error = '';
  restaurantId = 0;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.restaurantId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadRestaurantAndDishes();
  }

  loadRestaurantAndDishes() {
    this.loading = true;
    this.error = '';
    
    // Load restaurant details
    this.apiService.getRestaurant(this.restaurantId, 'ar').subscribe({
      next: (restaurant) => {
        this.restaurant = restaurant;
        this.loadDishes();
      },
      error: (err) => {
        console.error('Error loading restaurant:', err);
        this.error = 'فشل في تحميل بيانات المطعم';
        this.loading = false;
      }
    });
  }

  loadDishes() {
    this.apiService.getRestaurantDishes(this.restaurantId, 'ar').subscribe({
      next: (response) => {
        console.log('Dishes Response:', response);
        this.dishes = response.dishes || [];
        this.extractCategories();
        this.applyFilter();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading dishes:', err);
        this.error = 'فشل في تحميل قائمة الطعام';
        this.loading = false;
      }
    });
  }

  extractCategories() {
    const uniqueCategories = [...new Set(this.dishes.map(dish => dish.category || 'أطباق رئيسية'))];
    this.categories = ['الكل', ...uniqueCategories.filter(cat => cat)];
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;
    this.applyFilter();
  }

  applyFilter() {
    if (this.selectedCategory === 'الكل') {
      this.filteredDishes = this.dishes.filter(dish => dish.is_available);
    } else {
      this.filteredDishes = this.dishes.filter(dish => 
        (dish.category || 'أطباق رئيسية') === this.selectedCategory && dish.is_available
      );
    }
  }

  clearCategoryFilter() {
    this.selectedCategory = 'الكل';
    this.applyFilter();
  }

  addToCart(dish: Dish) {
    if (!dish.is_available) return;
    
    this.cartService.addToCart(dish);
    
    // Show success message
    this.showNotification(`تم إضافة "${dish.name_ar}" للسلة!`);
  }

  formatPrice(price: number): string {
    return `${price.toLocaleString()} س.ل`;
  }

  showNotification(message: string) {
    // Simple notification - you can replace with a proper toast service
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #28a745;
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
      font-weight: 500;
      direction: rtl;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  }

  retry() {
    this.loadRestaurantAndDishes();
  }
}