// app/pages/user/menu-management/menu-management.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-menu-management',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="menu-container">
      <!-- Header -->
      <div class="menu-header">
        <button class="back-btn" (click)="goBack()">← العودة لإدارة المطعم</button>
        <div class="header-info">
          <h1>📋 إدارة قائمة الطعام</h1>
          <p>{{ restaurant?.name_ar || 'مطعمي' }}</p>
        </div>
        <button class="add-dish-btn" (click)="addNewDish()">
          + إضافة طبق جديد
        </button>
      </div>

      <!-- Menu Stats -->
      <div class="menu-stats">
        <div class="stat-item">
          <div class="stat-number">{{ getTotalDishes() }}</div>
          <div class="stat-label">إجمالي الأطباق</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ getActiveDishes() }}</div>
          <div class="stat-label">أطباق متاحة</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ getCategoriesCount() }}</div>
          <div class="stat-label">الفئات</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ formatPrice(getAveragePrice()) }}</div>
          <div class="stat-label">متوسط السعر</div>
        </div>
      </div>

      <!-- Category Tabs -->
      <div class="category-tabs">
        <button 
          *ngFor="let category of categories" 
          [class.active]="selectedCategory === category.key"
          (click)="selectCategory(category.key)"
          class="category-tab"
        >
          <span class="category-icon">{{ category.icon }}</span>
          <span class="category-name">{{ category.name }}</span>
          <span class="category-count">({{ getDishesInCategory(category.key).length }})</span>
        </button>
      </div>

      <!-- Dishes Grid -->
      <div class="dishes-section">
        <div class="section-header">
          <h3>{{ getCurrentCategoryName() }}</h3>
          <div class="section-actions">
            <select [(ngModel)]="sortBy" (change)="sortDishes()" class="sort-select">
              <option value="name">ترتيب حسب الاسم</option>
              <option value="price_asc">السعر (من الأقل للأعلى)</option>
              <option value="price_desc">السعر (من الأعلى للأقل)</option>
              <option value="created">الأحدث أولاً</option>
              <option value="availability">المتاح أولاً</option>
            </select>
            <button class="add-category-dish-btn" (click)="addDishToCategory()">
              + إضافة لهذه الفئة
            </button>
          </div>
        </div>

        <div *ngIf="loading" class="loading">
          <div class="spinner"></div>
          جارٍ تحميل الأطباق...
        </div>

        <div class="dishes-grid" *ngIf="!loading">
          <div 
            *ngFor="let dish of getFilteredDishes()" 
            class="dish-card"
            [class.unavailable]="!dish.is_available"
          >
            <div class="dish-image">
              <!-- Show real image if available -->
              <img 
                *ngIf="dish.photo_url && dish.photo_url.length > 50" 
                [src]="dish.photo_url" 
                [alt]="dish.name_ar"
                class="dish-photo"
              >
              <!-- Show emoji placeholder if no image -->
              <div *ngIf="!dish.photo_url || dish.photo_url.length <= 50" class="image-placeholder">
                <span class="dish-emoji">{{ getDishEmoji(dish.category) }}</span>
              </div>
              ...
            
              <div class="dish-actions">
                <button class="action-btn edit" (click)="editDish(dish)">✏️</button>
                <button 
                  class="action-btn toggle" 
                  (click)="toggleDishAvailability(dish)"
                  [title]="dish.is_available ? 'إخفاء الطبق' : 'إظهار الطبق'"
                >
                  {{ dish.is_available ? '👁️' : '👁️‍🗨️' }}
                </button>
                <button class="action-btn delete" (click)="deleteDish(dish)">🗑️</button>
              </div>
            </div>
            
            <div class="dish-content">
              <div class="dish-header">
                <h4>{{ dish.name_ar }}</h4>
                <div class="dish-status" [class.available]="dish.is_available">
                  {{ dish.is_available ? 'متاح' : 'غير متاح' }}
                </div>
              </div>
              
              <p class="dish-description">{{ dish.description_ar }}</p>
              
              <div class="dish-details">
                <div class="dish-price">{{ formatPrice(dish.price) }}</div>
                <div class="dish-category">{{ dish.category }}</div>
              </div>
              
              <div class="dish-ingredients" *ngIf="dish.ingredients_ar">
                <strong>المكونات:</strong> {{ dish.ingredients_ar }}
              </div>
              
              <div class="dish-meta">
                <span class="creation-date">أُضيف: {{ formatDate(dish.created_at) }}</span>
                <span class="last-update" *ngIf="dish.updated_at">
                  آخر تحديث: {{ formatDate(dish.updated_at) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading && getFilteredDishes().length === 0" class="empty-state">
          <div class="empty-icon">{{ getCurrentCategoryIcon() }}</div>
          <h3>لا توجد أطباق في فئة {{ getCurrentCategoryName() }}</h3>
          <p>ابدأ بإضافة أطباق جديدة لهذه الفئة</p>
          <button class="add-first-dish-btn" (click)="addDishToCategory()">
            إضافة أول طبق
          </button>
        </div>
      </div>

      <!-- Bulk Actions -->
      <div class="bulk-actions" *ngIf="selectedDishes.length > 0">
        <div class="bulk-info">
          تم تحديد {{ selectedDishes.length }} طبق
        </div>
        <div class="bulk-buttons">
          <button class="bulk-btn enable" (click)="bulkEnable()">تفعيل الكل</button>
          <button class="bulk-btn disable" (click)="bulkDisable()">إلغاء تفعيل الكل</button>
          <button class="bulk-btn delete" (click)="bulkDelete()">حذف المحدد</button>
          <button class="bulk-btn clear" (click)="clearSelection()">إلغاء التحديد</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .menu-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
      background: #f8f9fa;
      min-height: 100vh;
    }

    /* Header */
    .menu-header {
      background: white;
      padding: 2rem;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(45, 138, 62, 0.1);
      margin-bottom: 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
    }

    .back-btn {
      background: #6c757d;
      color: white;
      border: none;
      padding: 0.8rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.3s ease;
    }

    .back-btn:hover {
      background: #5a6268;
    }

    .header-info h1 {
      color: #2d8a3e;
      margin-bottom: 0.5rem;
      font-size: 2rem;
    }

    .header-info p {
      color: #666;
      font-size: 1.1rem;
    }

    .add-dish-btn {
      background: linear-gradient(135deg, #2d8a3e, #4caf50);
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 10px;
      cursor: pointer;
      font-weight: 500;
      transition: transform 0.3s ease;
      white-space: nowrap;
    }

    .add-dish-btn:hover {
      transform: translateY(-2px);
    }

    /* Menu Stats */
    .menu-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-item {
      background: white;
      padding: 1.5rem;
      border-radius: 15px;
      text-align: center;
      box-shadow: 0 5px 20px rgba(45, 138, 62, 0.1);
      border-left: 4px solid #2d8a3e;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: bold;
      color: #2d8a3e;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      color: #666;
      font-size: 0.9rem;
    }

    /* Category Tabs */
    .category-tabs {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      overflow-x: auto;
      padding: 0.5rem;
    }

    .category-tab {
      background: white;
      border: 2px solid #e8f5e8;
      padding: 1rem 1.5rem;
      border-radius: 15px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.8rem;
      white-space: nowrap;
      min-width: fit-content;
    }

    .category-tab:hover {
      border-color: #2d8a3e;
      transform: translateY(-2px);
    }

    .category-tab.active {
      background: linear-gradient(135deg, #2d8a3e, #4caf50);
      color: white;
      border-color: #2d8a3e;
    }

    .category-icon {
      font-size: 1.5rem;
    }

    .category-name {
      font-weight: 500;
    }

    .category-count {
      background: rgba(255, 255, 255, 0.2);
      padding: 0.2rem 0.6rem;
      border-radius: 10px;
      font-size: 0.8rem;
    }

    .category-tab:not(.active) .category-count {
      background: #e8f5e8;
      color: #2d8a3e;
    }

    /* Dishes Section */
    .dishes-section {
      background: white;
      padding: 2rem;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(45, 138, 62, 0.1);
      margin-bottom: 2rem;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .section-header h3 {
      color: #2d8a3e;
      font-size: 1.5rem;
      margin: 0;
    }

    .section-actions {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .sort-select {
      padding: 0.8rem;
      border: 2px solid #e8f5e8;
      border-radius: 8px;
      background: white;
      direction: rtl;
    }

    .add-category-dish-btn {
      background: #17a2b8;
      color: white;
      border: none;
      padding: 0.8rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.3s ease;
    }

    .add-category-dish-btn:hover {
      background: #138496;
    }

    /* Dishes Grid */
    .dishes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 2rem;
    }

    .dish-card {
      border: 2px solid #e8f5e8;
      border-radius: 20px;
      overflow: hidden;
      transition: all 0.3s ease;
      background: white;
    }

    .dish-card:hover {
      border-color: #2d8a3e;
      transform: translateY(-3px);
      box-shadow: 0 10px 25px rgba(45, 138, 62, 0.15);
    }

    .dish-card.unavailable {
      opacity: 0.7;
      border-color: #dc3545;
    }

    .dish-image {
      height: 160px;
      background: linear-gradient(135deg, #2d8a3e, #4caf50);
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .image-placeholder {
      text-align: center;
    }

    .dish-emoji {
      font-size: 4rem;
    }

    .dish-actions {
      position: absolute;
      top: 1rem;
      right: 1rem;
      display: flex;
      gap: 0.5rem;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .dish-card:hover .dish-actions {
      opacity: 1;
    }

    .action-btn {
      width: 35px;
      height: 35px;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    .action-btn.edit {
      background: #17a2b8;
    }

    .action-btn.toggle {
      background: #ffc107;
    }

    .action-btn.delete {
      background: #dc3545;
    }

    .action-btn:hover {
      transform: scale(1.1);
    }

    .dish-content {
      padding: 1.5rem;
    }

    .dish-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 1rem;
    }

    .dish-header h4 {
      color: #2d8a3e;
      margin: 0;
      font-size: 1.2rem;
    }

    .dish-status {
      padding: 0.3rem 0.8rem;
      border-radius: 15px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .dish-status.available {
      background: #d4edda;
      color: #155724;
    }

    .dish-status:not(.available) {
      background: #f8d7da;
      color: #721c24;
    }

    .dish-description {
      color: #666;
      line-height: 1.4;
      margin-bottom: 1rem;
      font-size: 0.9rem;
    }

    .dish-details {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .dish-price {
      font-size: 1.3rem;
      font-weight: bold;
      color: #2d8a3e;
    }

    .dish-category {
      background: #e8f5e8;
      color: #2d8a3e;
      padding: 0.3rem 0.8rem;
      border-radius: 15px;
      font-size: 0.8rem;
    }

    .dish-ingredients {
      background: #f8f9fa;
      padding: 0.8rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      font-size: 0.9rem;
      border-left: 3px solid #2d8a3e;
    }

    .dish-ingredients strong {
      color: #2d8a3e;
    }

    .dish-meta {
      display: flex;
      justify-content: space-between;
      font-size: 0.8rem;
      color: #888;
      border-top: 1px solid #eee;
      padding-top: 0.8rem;
    }

    /* Loading */
    .loading {
      text-align: center;
      padding: 4rem;
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

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
    }

    .empty-icon {
      font-size: 5rem;
      margin-bottom: 1.5rem;
      opacity: 0.6;
    }

    .empty-state h3 {
      color: #2d8a3e;
      margin-bottom: 1rem;
    }

    .empty-state p {
      color: #666;
      margin-bottom: 2rem;
    }

    .add-first-dish-btn {
      background: linear-gradient(135deg, #2d8a3e, #4caf50);
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 10px;
      cursor: pointer;
      font-weight: 500;
      transition: transform 0.3s ease;
    }

    .add-first-dish-btn:hover {
      transform: translateY(-2px);
    }


    .dish-image {
      height: 160px;
      background: linear-gradient(135deg, #2d8a3e, #4caf50);
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .dish-photo {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 0;
    }

    .image-placeholder {
      text-align: center;
    }

    /* Bulk Actions */
    .bulk-actions {
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      background: white;
      padding: 1rem 2rem;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      display: flex;
      align-items: center;
      gap: 2rem;
      z-index: 1000;
    }

    .bulk-info {
      color: #2d8a3e;
      font-weight: 500;
    }

    .bulk-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .bulk-btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.3s ease;
    }

    .bulk-btn.enable {
      background: #28a745;
      color: white;
    }

    .bulk-btn.disable {
      background: #ffc107;
      color: #212529;
    }

    .bulk-btn.delete {
      background: #dc3545;
      color: white;
    }

    .bulk-btn.clear {
      background: #6c757d;
      color: white;
    }

    .bulk-btn:hover {
      transform: translateY(-1px);
    }

    /* Responsive */
    @media (max-width: 768px) {
      .menu-container {
        padding: 1rem;
      }

      .menu-header {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
      }

      .section-header {
        flex-direction: column;
        gap: 1rem;
      }

      .section-actions {
        flex-direction: column;
        width: 100%;
      }

      .dishes-grid {
        grid-template-columns: 1fr;
      }

      .category-tabs {
        justify-content: center;
      }

      .bulk-actions {
        flex-direction: column;
        gap: 1rem;
        left: 1rem;
        right: 1rem;
        transform: none;
      }

      .bulk-buttons {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class MenuManagementComponent implements OnInit {
  restaurant: any = null;
  dishes: any[] = [];
  filteredDishes: any[] = [];
  selectedCategory = 'all';
  sortBy = 'name';
  loading = true;
  selectedDishes: any[] = [];

  categories = [
    { key: 'all', name: 'جميع الأطباق', icon: '🍽️' },
    { key: 'مقبلات', name: 'مقبلات', icon: '🥗' },
    { key: 'أطباق رئيسية', name: 'أطباق رئيسية', icon: '🍖' },
    { key: 'مشروبات', name: 'مشروبات', icon: '🥤' },
    { key: 'حلويات', name: 'حلويات', icon: '🍰' }
  ];

  constructor(
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadMenuData();
  }


  loadMenuData() {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    // Get restaurant ID from JWT token
    const token = this.authService.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('JWT payload:', payload);
        
        if (payload.restaurant_id) {
          this.restaurant = { 
            id: payload.restaurant_id, 
            name_ar: 'مطعمي' 
          };
          console.log('Restaurant loaded:', this.restaurant);
          this.loadDishes(); // ✅ Jetzt Gerichte laden
          return;
        }
      } catch (e) {
        console.error('Error parsing JWT:', e);
      }
    }
    
    this.loading = false;
  }

  loadDishes() {
    if (!this.restaurant) return;

    this.apiService.getRestaurantDishes(this.restaurant.id, 'ar').subscribe({
      next: (response) => {
        this.dishes = response.dishes || [];
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading dishes:', err);
        this.loading = false;
      }
    });
  }

  selectCategory(categoryKey: string) {
    this.selectedCategory = categoryKey;
    this.applyFilters();
  }

  applyFilters() {
    let filtered = this.dishes;

    // Filter by category
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(dish => dish.category === this.selectedCategory);
    }

    this.filteredDishes = filtered;
    this.sortDishes();
  }

  sortDishes() {
    switch (this.sortBy) {
      case 'name':
        this.filteredDishes.sort((a, b) => a.name_ar.localeCompare(b.name_ar));
        break;
      case 'price_asc':
        this.filteredDishes.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        this.filteredDishes.sort((a, b) => b.price - a.price);
        break;
      case 'created':
        this.filteredDishes.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'availability':
        this.filteredDishes.sort((a, b) => Number(b.is_available) - Number(a.is_available));
        break;
    }
  }

  getDishesInCategory(categoryKey: string): any[] {
    if (categoryKey === 'all') return this.dishes;
    return this.dishes.filter(dish => dish.category === categoryKey);
  }

  getFilteredDishes(): any[] {
    return this.filteredDishes;
  }

  getCurrentCategoryName(): string {
    const category = this.categories.find(cat => cat.key === this.selectedCategory);
    return category ? category.name : 'جميع الأطباق';
  }

  getCurrentCategoryIcon(): string {
    const category = this.categories.find(cat => cat.key === this.selectedCategory);
    return category ? category.icon : '🍽️';
  }

  getDishEmoji(category: string): string {
    const categoryEmojis: { [key: string]: string } = {
      'مقبلات': '🥗',
      'أطباق رئيسية': '🍖',
      'مشروبات': '🥤',
      'حلويات': '🍰'
    };
    return categoryEmojis[category] || '🍽️';
  }

  getTotalDishes(): number {
    return this.dishes.length;
  }

  getActiveDishes(): number {
    return this.dishes.filter(dish => dish.is_available).length;
  }

  getCategoriesCount(): number {
    const uniqueCategories = new Set(this.dishes.map(dish => dish.category));
    return uniqueCategories.size;
  }

  getAveragePrice(): number {
    if (this.dishes.length === 0) return 0;
    const total = this.dishes.reduce((sum, dish) => sum + dish.price, 0);
    return Math.round(total / this.dishes.length);
  }

  goBack() {
    this.router.navigate(['/user/restaurant-management']);
  }

  addNewDish() {
    this.router.navigate(['/user/add-dish']);
  }

  addDishToCategory() {
    const category = this.selectedCategory === 'all' ? 'أطباق رئيسية' : this.selectedCategory;
    this.router.navigate(['/user/add-dish'], { 
      queryParams: { category: category } 
    });
  }

  editDish(dish: any) {
    this.router.navigate(['/user/edit-dish', dish.id]);
  }

  toggleDishAvailability(dish: any) {
    dish.updating = true;
    
    this.apiService.toggleDishAvailability(dish.id).subscribe({
      next: (response) => {
        dish.is_available = response.dish.is_available;
        dish.updating = false;
        this.showNotification(`تم ${dish.is_available ? 'تفعيل' : 'إلغاء تفعيل'} الطبق`);
      },
      error: (err) => {
        console.error('Error toggling dish:', err);
        dish.updating = false;
        this.showNotification('فشل في تحديث الطبق');
      }
    });
  }

  deleteDish(dish: any) {
    if (!confirm(`هل أنت متأكد من حذف طبق "${dish.name_ar}"؟`)) return;
    
    dish.deleting = true;
    
    this.apiService.deleteDish(dish.id).subscribe({
      next: () => {
        this.loadDishes();
        this.showNotification('تم حذف الطبق بنجاح');
      },
      error: (err) => {
        console.error('Error deleting dish:', err);
        dish.deleting = false;
        this.showNotification('فشل في حذف الطبق');
      }
    });
  }

  bulkEnable() {
    // TODO: Implement bulk enable
    this.showNotification('تم تفعيل الأطباق المحددة');
    this.clearSelection();
  }

  bulkDisable() {
    // TODO: Implement bulk disable
    this.showNotification('تم إلغاء تفعيل الأطباق المحددة');
    this.clearSelection();
  }

  bulkDelete() {
    if (!confirm(`هل أنت متأكد من حذف ${this.selectedDishes.length} طبق؟`)) return;
    // TODO: Implement bulk delete
    this.showNotification('تم حذف الأطباق المحددة');
    this.clearSelection();
  }

  clearSelection() {
    this.selectedDishes = [];
  }

  formatPrice(price: number): string {
    return `${price.toLocaleString()} س.ل`;
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA');
  }

  showNotification(message: string) {
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
}