// app/pages/restaurant/restaurant-dashboard/restaurant-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, Dish } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-restaurant-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard-container">
      <!-- Header -->
      <div class="dashboard-header">
        <div class="restaurant-info">
          <h1>🏪 لوحة تحكم المطعم</h1>
          <p>{{ restaurantName }}</p>
        </div>
        <div class="header-actions">
          <button (click)="showAddDish = !showAddDish" class="add-btn">
            {{ showAddDish ? 'إلغاء' : '+ إضافة طبق جديد' }}
          </button>
          <button (click)="logout()" class="logout-btn">تسجيل خروج</button>
        </div>
      </div>

      <!-- Statistics -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-number">{{ stats?.total_dishes || dishes.length }}</div>
          <div class="stat-label">إجمالي الأطباق</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ stats?.available_dishes || getActiveDishes() }}</div>
          <div class="stat-label">أطباق متاحة</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ orderStats?.today_orders || 0 }}</div>
          <div class="stat-label">طلبات اليوم</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ formatPrice(orderStats?.today_revenue || 0) }}</div>
          <div class="stat-label">إيرادات اليوم</div>
        </div>
      </div>

      <!-- Add Dish Form -->
      <div *ngIf="showAddDish" class="add-dish-form">
        <h3>إضافة طبق جديد</h3>
        <form (ngSubmit)="addDish()" #dishForm="ngForm">
          <div class="form-row">
            <div class="form-group">
              <label>اسم الطبق (عربي) *</label>
              <input 
                type="text" 
                [(ngModel)]="newDish.name_ar" 
                name="name_ar" 
                required 
                class="form-control"
                placeholder="كباب حلبي"
              >
            </div>
            <div class="form-group">
              <label>اسم الطبق (إنجليزي) *</label>
              <input 
                type="text" 
                [(ngModel)]="newDish.name_en" 
                name="name_en" 
                required 
                class="form-control"
                placeholder="Aleppo Kebab"
              >
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>وصف الطبق (عربي) *</label>
              <textarea 
                [(ngModel)]="newDish.description_ar" 
                name="description_ar" 
                required 
                class="form-control"
                rows="3"
                placeholder="كباب لحم الغنم المشوي مع الخضار الطازجة"
              ></textarea>
            </div>
            <div class="form-group">
              <label>وصف الطبق (إنجليزي)</label>
              <textarea 
                [(ngModel)]="newDish.description_en" 
                name="description_en" 
                class="form-control"
                rows="3"
                placeholder="Grilled lamb kebab with fresh vegetables"
              ></textarea>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>السعر (ليرة سورية) *</label>
              <input 
                type="number" 
                [(ngModel)]="newDish.price" 
                name="price" 
                required 
                min="0"
                class="form-control"
                placeholder="15000"
              >
            </div>
            <div class="form-group">
              <label>الفئة *</label>
              <select 
                [(ngModel)]="newDish.category" 
                name="category" 
                required 
                class="form-control"
              >
                <option value="مقبلات">مقبلات</option>
                <option value="أطباق رئيسية">أطباق رئيسية</option>
                <option value="مشاوي">مشاوي</option>
                <option value="حلويات">حلويات</option>
                <option value="مشروبات">مشروبات</option>
                <option value="سلطات">سلطات</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>المكونات (عربي)</label>
              <input 
                type="text" 
                [(ngModel)]="newDish.ingredients_ar" 
                name="ingredients_ar" 
                class="form-control"
                placeholder="لحم غنم، بصل، بقدونس، بهارات"
              >
            </div>
            <div class="form-group">
              <label>المكونات (إنجليزي)</label>
              <input 
                type="text" 
                [(ngModel)]="newDish.ingredients_en" 
                name="ingredients_en" 
                class="form-control"
                placeholder="Lamb meat, onions, parsley, spices"
              >
            </div>
          </div>

          <div class="form-group">
            <label>
              <input 
                type="checkbox" 
                [(ngModel)]="newDish.is_available" 
                name="is_available"
              >
              الطبق متاح للطلب
            </label>
          </div>

          <div class="form-actions">
            <button type="submit" [disabled]="!dishForm.valid || saving" class="save-btn">
              {{ saving ? 'جارٍ الحفظ...' : 'حفظ الطبق' }}
            </button>
            <button type="button" (click)="cancelAdd()" class="cancel-btn">
              إلغاء
            </button>
          </div>
        </form>
      </div>

      <!-- Dishes List -->
      <div class="dishes-section">
        <h3>قائمة الأطباق</h3>
        
        <div class="dishes-filters">
          <select [(ngModel)]="filterStatus" (change)="applyFilter()" class="filter-select">
            <option value="all">جميع الأطباق</option>
            <option value="available">المتاحة</option>
            <option value="unavailable">غير المتاحة</option>
          </select>
          <button (click)="loadDishes()" class="refresh-btn">🔄 تحديث</button>
        </div>

        <div *ngIf="loading" class="loading">
          <div class="spinner"></div>
          جارٍ تحميل الأطباق...
        </div>

        <div class="dishes-grid" *ngIf="!loading">
          <div *ngFor="let dish of filteredDishes" class="dish-card">
            <div class="dish-header">
              <h4>{{ dish.name_ar }}</h4>
              <div class="dish-status" [class.available]="dish.is_available" [class.unavailable]="!dish.is_available">
                {{ dish.is_available ? 'متاح' : 'غير متاح' }}
              </div>
            </div>
            
            <p class="dish-description">{{ dish.description_ar }}</p>
            <p class="dish-ingredients" *ngIf="dish.ingredients_ar">
              المكونات: {{ dish.ingredients_ar }}
            </p>
            <div class="dish-price">{{ formatPrice(dish.price) }}</div>
            <div class="dish-category">فئة: {{ dish.category }}</div>
            
            <div class="dish-actions">
              <button (click)="editDish(dish)" class="edit-btn">تعديل</button>
              <button (click)="toggleAvailability(dish)" class="toggle-btn" [disabled]="dish.updating">
                {{ dish.updating ? '...' : (dish.is_available ? 'إخفاء' : 'إظهار') }}
              </button>
              <button (click)="deleteDish(dish)" class="delete-btn" [disabled]="dish.deleting">
                {{ dish.deleting ? '...' : 'حذف' }}
              </button>
            </div>
          </div>
        </div>

        <div *ngIf="!loading && filteredDishes.length === 0 && dishes.length > 0" class="no-filtered-dishes">
          <div class="no-dishes-icon">🔍</div>
          <h3>لا توجد أطباق مطابقة للفلتر</h3>
          <button (click)="clearFilter()" class="clear-filter-btn">عرض جميع الأطباق</button>
        </div>

        <div *ngIf="!loading && dishes.length === 0" class="no-dishes">
          <div class="no-dishes-icon">🍽️</div>
          <h3>لا توجد أطباق</h3>
          <p>ابدأ بإضافة أطباق جديدة لمطعمك</p>
          <button (click)="showAddDish = true" class="add-first-dish-btn">إضافة أول طبق</button>
        </div>
      </div>
      
      <div *ngIf="error" class="error-message">
        {{ error }}
        <button (click)="retry()" class="retry-btn">إعادة المحاولة</button>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
      background: #f8f9fa;
      min-height: 100vh;
    }
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: white;
      padding: 2rem;
      border-radius: 15px;
      box-shadow: 0 5px 20px rgba(45, 138, 62, 0.1);
      margin-bottom: 2rem;
    }
    .restaurant-info h1 {
      color: #2d8a3e;
      margin-bottom: 0.5rem;
      font-size: 2rem;
    }
    .restaurant-info p {
      color: #666;
      font-size: 1.1rem;
    }
    .header-actions {
      display: flex;
      gap: 1rem;
    }
    .add-btn {
      background: #27ae60;
      color: white;
      border: none;
      padding: 0.8rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.3s ease;
    }
    .add-btn:hover {
      background: #219a52;
    }
    .logout-btn {
      background: #ff4757;
      color: white;
      border: none;
      padding: 0.8rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.3s ease;
    }
    .logout-btn:hover {
      background: #ff3742;
    }
    
    /* Statistics */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .stat-card {
      background: white;
      padding: 2rem;
      border-radius: 15px;
      text-align: center;
      box-shadow: 0 5px 20px rgba(45, 138, 62, 0.1);
      border-left: 4px solid #2d8a3e;
    }
    .stat-number {
      font-size: 2.5rem;
      font-weight: bold;
      color: #2d8a3e;
      margin-bottom: 0.5rem;
    }
    .stat-label {
      color: #666;
      font-size: 1rem;
    }
    
    /* Add Dish Form */
    .add-dish-form {
      background: white;
      padding: 2rem;
      border-radius: 15px;
      box-shadow: 0 5px 20px rgba(45, 138, 62, 0.1);
      margin-bottom: 2rem;
    }
    .add-dish-form h3 {
      color: #2d8a3e;
      margin-bottom: 1.5rem;
      text-align: center;
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .form-group {
      margin-bottom: 1.5rem;
      text-align: right;
    }
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: #555;
      font-weight: 500;
    }
    .form-control {
      width: 100%;
      padding: 1rem;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s ease;
      direction: ltr;
      text-align: left;
    }
    .form-control:focus {
      outline: none;
      border-color: #2d8a3e;
    }
    textarea.form-control {
      resize: vertical;
      min-height: 80px;
    }
    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-top: 1rem;
    }
    .save-btn {
      background: #27ae60;
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.3s ease;
    }
    .save-btn:hover:not(:disabled) {
      background: #219a52;
    }
    .save-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .cancel-btn {
      background: #6c757d;
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.3s ease;
    }
    .cancel-btn:hover {
      background: #5a6268;
    }
    
    /* Dishes Section */
    .dishes-section {
      background: white;
      padding: 2rem;
      border-radius: 15px;
      box-shadow: 0 5px 20px rgba(45, 138, 62, 0.1);
    }
    .dishes-section h3 {
      color: #2d8a3e;
      margin-bottom: 1.5rem;
      text-align: center;
    }
    .dishes-filters {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .filter-select {
      padding: 0.8rem;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 1rem;
      direction: rtl;
    }
    .refresh-btn {
      background: #17a2b8;
      color: white;
      border: none;
      padding: 0.8rem 1rem;
      border-radius: 8px;
      cursor: pointer;
    }
    .refresh-btn:hover {
      background: #138496;
    }
    
    /* Loading */
    .loading {
      text-align: center;
      padding: 3rem;
      color: #666;
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #2d8a3e;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .dishes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }
    .dish-card {
      border: 2px solid #e8f5e8;
      border-radius: 15px;
      padding: 1.5rem;
      transition: all 0.3s ease;
    }
    .dish-card:hover {
      border-color: #2d8a3e;
      box-shadow: 0 5px 15px rgba(45, 138, 62, 0.1);
    }
    .dish-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .dish-header h4 {
      color: #2d8a3e;
      margin: 0;
    }
    .dish-status {
      padding: 0.3rem 0.8rem;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 500;
    }
    .dish-status.available {
      background: #d4edda;
      color: #155724;
    }
    .dish-status.unavailable {
      background: #f8d7da;
      color: #721c24;
    }
    .dish-description {
      color: #666;
      margin-bottom: 0.8rem;
      line-height: 1.4;
    }
    .dish-ingredients {
      color: #888;
      font-size: 0.9rem;
      margin-bottom: 1rem;
      font-style: italic;
    }
    .dish-price {
      font-size: 1.2rem;
      font-weight: bold;
      color: #2d8a3e;
      margin-bottom: 0.5rem;
    }
    .dish-category {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 1rem;
      background: #f8f9fa;
      padding: 0.3rem 0.6rem;
      border-radius: 10px;
      display: inline-block;
    }
    .dish-actions {
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
    }
    .edit-btn, .toggle-btn, .delete-btn {
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 5px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.3s ease;
    }
    .edit-btn {
      background: #17a2b8;
      color: white;
    }
    .edit-btn:hover {
      background: #138496;
    }
    .toggle-btn {
      background: #ffc107;
      color: #212529;
    }
    .toggle-btn:hover:not(:disabled) {
      background: #e0a800;
    }
    .delete-btn {
      background: #dc3545;
      color: white;
    }
    .delete-btn:hover:not(:disabled) {
      background: #c82333;
    }
    .edit-btn:disabled, .toggle-btn:disabled, .delete-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    /* No Dishes */
    .no-dishes, .no-filtered-dishes {
      text-align: center;
      padding: 3rem;
    }
    .no-dishes-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      opacity: 0.6;
    }
    .no-dishes h3, .no-filtered-dishes h3 {
      color: #2d8a3e;
      margin-bottom: 1rem;
    }
    .no-dishes p {
      color: #666;
      margin-bottom: 2rem;
    }
    .add-first-dish-btn, .clear-filter-btn {
      background: #27ae60;
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.3s ease;
    }
    .add-first-dish-btn:hover, .clear-filter-btn:hover {
      background: #219a52;
    }
    
    /* Error */
    .error-message {
      text-align: center;
      padding: 2rem;
      background: #f8d7da;
      color: #721c24;
      border-radius: 10px;
      margin-top: 2rem;
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
      .dashboard-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
      .form-row {
        grid-template-columns: 1fr;
      }
      .dishes-grid {
        grid-template-columns: 1fr;
      }
      .dish-actions {
        flex-direction: column;
        gap: 0.5rem;
      }
      .dishes-filters {
        flex-direction: column;
        gap: 1rem;
      }
    }
  `]
})
export class RestaurantDashboardComponent implements OnInit {
  restaurantName = '';
  restaurantId = 0;
  showAddDish = false;
  filterStatus = 'all';
  loading = true;
  saving = false;
  error = '';
  
  dishes: any[] = [];
  filteredDishes: any[] = [];
  stats: any = null;
  orderStats: any = null;
  
  newDish = {
    name_ar: '',
    name_en: '',
    description_ar: '',
    description_en: '',
    price: 0,
    ingredients_ar: '',
    ingredients_en: '',
    category: 'أطباق رئيسية',
    is_available: true
  };

  constructor(
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadUserInfo();
    this.loadDishes();
    this.loadStats();
  }

  loadUserInfo() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && (currentUser as any).restaurant) {
      this.restaurantName = (currentUser as any).restaurant.name_ar;
      this.restaurantId = (currentUser as any).restaurant_id;
    }
  }

  loadDishes() {
    if (!this.restaurantId) return;
    
    this.loading = true;
    this.error = '';
    
    this.apiService.getRestaurantDishes(this.restaurantId, 'ar').subscribe({
      next: (response) => {
        console.log('Dishes Response:', response);
        this.dishes = response.dishes || [];
        this.applyFilter();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading dishes:', err);
        this.error = 'فشل في تحميل الأطباق';
        this.loading = false;
      }
    });
  }

  loadStats() {
    if (!this.restaurantId) return;
    
    // Load dish stats
    this.apiService.getRestaurantDishStats(this.restaurantId).subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (err) => {
        console.error('Error loading dish stats:', err);
      }
    });
    
    // Load order stats
    this.apiService.getRestaurantOrderStats(this.restaurantId).subscribe({
      next: (orderStats) => {
        this.orderStats = orderStats;
      },
      error: (err) => {
        console.error('Error loading order stats:', err);
      }
    });
  }

  applyFilter() {
    if (this.filterStatus === 'all') {
      this.filteredDishes = this.dishes;
    } else if (this.filterStatus === 'available') {
      this.filteredDishes = this.dishes.filter(dish => dish.is_available);
    } else {
      this.filteredDishes = this.dishes.filter(dish => !dish.is_available);
    }
  }

  clearFilter() {
    this.filterStatus = 'all';
    this.applyFilter();
  }

  addDish() {
    if (this.saving || !this.restaurantId) return;
    
    this.saving = true;
    
    const dishData = {
      ...this.newDish,
      restaurant_id: this.restaurantId
    };
    
    this.apiService.createDish(dishData).subscribe({
      next: (response) => {
        console.log('Dish created:', response);
        this.loadDishes(); // Reload dishes
        this.loadStats(); // Reload stats
        this.cancelAdd();
        this.showNotification('تم إضافة الطبق بنجاح!');
        this.saving = false;
      },
      error: (err) => {
        console.error('Error creating dish:', err);
        this.error = 'فشل في إضافة الطبق';
        this.saving = false;
      }
    });
  }

  cancelAdd() {
    this.showAddDish = false;
    this.newDish = {
      name_ar: '',
      name_en: '',
      description_ar: '',
      description_en: '',
      price: 0,
      ingredients_ar: '',
      ingredients_en: '',
      category: 'أطباق رئيسية',
      is_available: true
    };
  }

  editDish(dish: any) {
    // TODO: Implement edit modal/form
    alert(`تعديل الطبق: ${dish.name_ar}`);
  }

  toggleAvailability(dish: any) {
    dish.updating = true;
    
    this.apiService.toggleDishAvailability(dish.id).subscribe({
      next: (response) => {
        dish.is_available = response.dish.is_available;
        dish.updating = false;
        this.applyFilter();
        this.loadStats();
        this.showNotification(`تم ${dish.is_available ? 'إظهار' : 'إخفاء'} الطبق`);
      },
      error: (err) => {
        console.error('Error toggling dish:', err);
        dish.updating = false;
        this.showNotification('فشل في تحديث الطبق');
      }
    });
  }

  deleteDish(dish: any) {
    if (!confirm('هل أنت متأكد من حذف هذا الطبق؟')) return;
    
    dish.deleting = true;
    
    this.apiService.deleteDish(dish.id).subscribe({
      next: () => {
        this.loadDishes(); // Reload dishes
        this.loadStats(); // Reload stats
        this.showNotification('تم حذف الطبق بنجاح');
      },
      error: (err) => {
        console.error('Error deleting dish:', err);
        dish.deleting = false;
        this.showNotification('فشل في حذف الطبق');
      }
    });
  }

  getActiveDishes(): number {
    return this.dishes.filter(dish => dish.is_available).length;
  }

  formatPrice(price: number): string {
    return `${price.toLocaleString()} س.ل`;
  }

  showNotification(message: string) {
    // Simple notification
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
      direction: rtl;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  }

  retry() {
    this.loadDishes();
    this.loadStats();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}