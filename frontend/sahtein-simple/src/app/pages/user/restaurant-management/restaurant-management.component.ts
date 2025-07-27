// app/pages/user/restaurant-management/restaurant-management.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-restaurant-management',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="management-container">
      <!-- Header -->
      <div class="management-header">
        <div class="header-content">
          <button class="back-btn" (click)="goBack()">← العودة للملف الشخصي</button>
          <div class="header-info">
            <h1>🏪 إدارة المطعم</h1>
            <p>{{ restaurant?.name_ar || 'مطعمي' }}</p>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="stats-grid">
        <div class="stat-card dishes">
          <div class="stat-icon">🍽️</div>
          <div class="stat-content">
            <div class="stat-number">{{ stats?.total_dishes || 0 }}</div>
            <div class="stat-label">إجمالي الأطباق</div>
          </div>
        </div>
        <div class="stat-card orders">
          <div class="stat-icon">📦</div>
          <div class="stat-content">
            <div class="stat-number">{{ stats?.today_orders || 0 }}</div>
            <div class="stat-label">طلبات اليوم</div>
          </div>
        </div>
        <div class="stat-card revenue">
          <div class="stat-icon">💰</div>
          <div class="stat-content">
            <div class="stat-number">{{ formatPrice(stats?.today_revenue || 0) }}</div>
            <div class="stat-label">إيرادات اليوم</div>
          </div>
        </div>
        <div class="stat-card rating">
          <div class="stat-icon">⭐</div>
          <div class="stat-content">
            <div class="stat-number">{{ restaurant?.rating || 'جديد' }}</div>
            <div class="stat-label">التقييم</div>
          </div>
        </div>
      </div>

      <!-- Main Actions -->
      <div class="actions-grid">
        <!-- Menu Management -->
        <div class="action-card primary">
          <div class="card-icon">📋</div>
          <div class="card-content">
            <h3>إدارة القائمة</h3>
            <p>إضافة وتعديل وحذف الأطباق، تنظيم القائمة حسب الفئات</p>
            <div class="card-stats">
              <span>{{ stats?.active_dishes || 0 }} طبق نشط</span>
              <span>{{ categories.length || 4 }} فئة</span>
            </div>
          </div>
          <button class="card-button" (click)="manageMenu()">
            إدارة القائمة
          </button>
        </div>

        <!-- Orders Management -->
        <div class="action-card">
          <div class="card-icon">🛍️</div>
          <div class="card-content">
            <h3>إدارة الطلبات</h3>
            <p>متابعة الطلبات الجديدة، تحديث حالة الطلبات</p>
            <div class="card-stats">
              <span>{{ stats?.pending_orders || 0 }} طلب جديد</span>
              <span>{{ stats?.preparing_orders || 0 }} قيد التحضير</span>
            </div>
          </div>
          <button class="card-button" (click)="manageOrders()">
            إدارة الطلبات
          </button>
        </div>

        <!-- Restaurant Info -->
        <div class="action-card">
          <div class="card-icon">ℹ️</div>
          <div class="card-content">
            <h3>معلومات المطعم</h3>
            <p>تحديث بيانات المطعم، أوقات العمل، العنوان</p>
            <div class="card-stats">
              <span>{{ restaurant?.category }}</span>
              <span>{{ restaurant?.is_active ? 'نشط' : 'متوقف' }}</span>
            </div>
          </div>
          <button class="card-button" (click)="editRestaurant()">
            تعديل المعلومات
          </button>
        </div>

        <!-- Analytics -->
        <div class="action-card">
          <div class="card-icon">📊</div>
          <div class="card-content">
            <h3>التقارير والإحصائيات</h3>
            <p>مراجعة الأداء، تحليل المبيعات، تقييمات العملاء</p>
            <div class="card-stats">
              <span>{{ stats?.total_reviews || 0 }} تقييم</span>
              <span>{{ stats?.monthly_revenue || 0 }} س.ل شهرياً</span>
            </div>
          </div>
          <button class="card-button" (click)="viewAnalytics()">
            عرض التقارير
          </button>
        </div>

        <!-- Financial Management -->
        <div class="action-card">
          <div class="card-icon">💳</div>
          <div class="card-content">
            <h3>الإدارة المالية</h3>
            <p>متابعة الإيرادات، المصروفات، التقارير المالية</p>
            <div class="card-stats">
              <span>{{ formatPrice(stats?.weekly_revenue || 0) }} أسبوعياً</span>
              <span>{{ stats?.payment_methods || 2 }} طريقة دفع</span>
            </div>
          </div>
          <button class="card-button" (click)="manageFinance()">
            الإدارة المالية
          </button>
        </div>

        <!-- Settings -->
        <div class="action-card">
          <div class="card-icon">⚙️</div>
          <div class="card-content">
            <h3>إعدادات المطعم</h3>
            <p>إعدادات التوصيل، الإشعارات، طرق الدفع</p>
            <div class="card-stats">
              <span>{{ restaurant?.delivery_time || 30 }} دقيقة توصيل</span>
              <span>{{ restaurant?.min_order || 0 }} س.ل حد أدنى</span>
            </div>
          </div>
          <button class="card-button" (click)="restaurantSettings()">
            الإعدادات
          </button>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="activity-section">
        <h3>النشاط الأخير</h3>
        <div class="activity-list" *ngIf="recentActivity.length > 0">
          <div *ngFor="let activity of recentActivity" class="activity-item">
            <div class="activity-icon" [ngClass]="'activity-' + activity.type">
              {{ getActivityIcon(activity.type) }}
            </div>
            <div class="activity-content">
              <p class="activity-text">{{ activity.description }}</p>
              <span class="activity-time">{{ formatTime(activity.created_at) }}</span>
            </div>
          </div>
        </div>
        <div *ngIf="recentActivity.length === 0" class="no-activity">
          <div class="no-activity-icon">📝</div>
          <p>لا يوجد نشاط حديث</p>
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
        جارٍ تحميل بيانات المطعم...
      </div>
    </div>
  `,
  styles: [`
    .management-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
      background: #f8f9fa;
      min-height: 100vh;
    }

    /* Header */
    .management-header {
      background: white;
      padding: 2rem;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(45, 138, 62, 0.1);
      margin-bottom: 2rem;
    }

    .header-content {
      display: flex;
      align-items: center;
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
      text-decoration: none;
    }

    .back-btn:hover {
      background: #5a6268;
    }

    .header-info h1 {
      color: #2d8a3e;
      margin-bottom: 0.5rem;
      font-size: 2.2rem;
    }

    .header-info p {
      color: #666;
      font-size: 1.1rem;
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .stat-card {
      background: white;
      padding: 2rem;
      border-radius: 15px;
      box-shadow: 0 5px 20px rgba(45, 138, 62, 0.1);
      display: flex;
      align-items: center;
      gap: 1.5rem;
      transition: transform 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-3px);
    }

    .stat-card.dishes {
      border-left: 4px solid #2d8a3e;
    }

    .stat-card.orders {
      border-left: 4px solid #17a2b8;
    }

    .stat-card.revenue {
      border-left: 4px solid #ffc107;
    }

    .stat-card.rating {
      border-left: 4px solid #6f42c1;
    }

    .stat-icon {
      font-size: 2.5rem;
      opacity: 0.8;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: bold;
      color: #2d8a3e;
      margin-bottom: 0.3rem;
    }

    .stat-label {
      color: #666;
      font-size: 0.9rem;
    }

    /* Actions Grid */
    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .action-card {
      background: white;
      padding: 2rem;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(45, 138, 62, 0.1);
      transition: all 0.3s ease;
      border: 2px solid transparent;
      position: relative;
      overflow: hidden;
    }

    .action-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 40px rgba(45, 138, 62, 0.15);
      border-color: #e8f5e8;
    }

    .action-card.primary {
      background: linear-gradient(135deg, #2d8a3e, #4caf50);
      color: white;
    }

    .action-card.primary .card-content h3,
    .action-card.primary .card-content p,
    .action-card.primary .card-stats span {
      color: white;
    }

    .card-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      opacity: 0.9;
    }

    .card-content h3 {
      color: #2d8a3e;
      margin-bottom: 1rem;
      font-size: 1.3rem;
    }

    .card-content p {
      color: #666;
      line-height: 1.5;
      margin-bottom: 1.5rem;
    }

    .card-stats {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }

    .card-stats span {
      background: #e8f5e8;
      color: #2d8a3e;
      padding: 0.3rem 0.8rem;
      border-radius: 15px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .action-card.primary .card-stats span {
      background: rgba(255, 255, 255, 0.2);
      color: white;
    }

    .card-button {
      width: 100%;
      padding: 1rem;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
      font-size: 1rem;
    }

    .action-card:not(.primary) .card-button {
      background: #2d8a3e;
      color: white;
    }

    .action-card.primary .card-button {
      background: white;
      color: #2d8a3e;
    }

    .card-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }

    /* Activity Section */
    .activity-section {
      background: white;
      padding: 2rem;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(45, 138, 62, 0.1);
      margin-bottom: 2rem;
    }

    .activity-section h3 {
      color: #2d8a3e;
      margin-bottom: 1.5rem;
      font-size: 1.4rem;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border-radius: 10px;
      background: #f8f9fa;
      transition: background 0.3s ease;
    }

    .activity-item:hover {
      background: #e8f5e8;
    }

    .activity-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      flex-shrink: 0;
    }

    .activity-icon.activity-order {
      background: #cce5ff;
      color: #004085;
    }

    .activity-icon.activity-dish {
      background: #d4edda;
      color: #155724;
    }

    .activity-icon.activity-review {
      background: #fff3cd;
      color: #856404;
    }

    .activity-icon.activity-setting {
      background: #f8d7da;
      color: #721c24;
    }

    .activity-content {
      flex: 1;
    }

    .activity-text {
      color: #333;
      margin-bottom: 0.3rem;
      font-size: 0.9rem;
    }

    .activity-time {
      color: #888;
      font-size: 0.8rem;
    }

    .no-activity {
      text-align: center;
      padding: 3rem;
      color: #666;
    }

    .no-activity-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      opacity: 0.6;
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

    /* Responsive */
    @media (max-width: 768px) {
      .management-container {
        padding: 1rem;
      }

      .header-content {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .actions-grid {
        grid-template-columns: 1fr;
      }

      .stat-card {
        flex-direction: column;
        text-align: center;
      }

      .card-stats {
        justify-content: center;
      }
    }
  `]
})
export class RestaurantManagementComponent implements OnInit {
  restaurant: any = null;
  stats: any = null;
  categories: string[] = ['مقبلات', 'أطباق رئيسية', 'مشروبات', 'حلويات'];
  recentActivity: any[] = [];
  loading = true;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadRestaurantData();
  }

  loadRestaurantData() {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    // Load restaurant info
    this.apiService.getUserRestaurant(user.id).subscribe({
      next: (response) => {
        this.restaurant = response.restaurant;
        if (this.restaurant) {
          this.loadStats();
          this.loadActivity();
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading restaurant:', err);
        this.loading = false;
      }
    });
  }

  loadStats() {
    if (!this.restaurant) return;

    this.apiService.getRestaurantStats(this.restaurant.id).subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (err) => {
        console.error('Error loading stats:', err);
      }
    });
  }

  loadActivity() {
    if (!this.restaurant) return;

    this.apiService.getRestaurantActivity(this.restaurant.id).subscribe({
      next: (activity) => {
        this.recentActivity = activity.slice(0, 5);
      },
      error: (err) => {
        console.error('Error loading activity:', err);
      }
    });
  }

  goBack() {
    this.router.navigate(['/user/profile']);
  }

  manageMenu() {
    this.router.navigate(['/user/menu-management']);
  }

  manageOrders() {
    this.router.navigate(['/user/restaurant-orders']);
  }

  editRestaurant() {
    this.router.navigate(['/user/edit-restaurant']);
  }

  viewAnalytics() {
    this.router.navigate(['/user/restaurant-analytics']);
  }

  manageFinance() {
    this.router.navigate(['/user/restaurant-finance']);
  }

  restaurantSettings() {
    this.router.navigate(['/user/restaurant-settings']);
  }

  getActivityIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'order': '🛍️',
      'dish': '🍽️',
      'review': '⭐',
      'setting': '⚙️',
      'payment': '💳'
    };
    return icons[type] || '📝';
  }

  formatPrice(price: number): string {
    return `${price.toLocaleString()}`;
  }

  formatTime(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `منذ ${days} أيام`;
    if (hours > 0) return `منذ ${hours} ساعات`;
    if (minutes > 0) return `منذ ${minutes} دقائق`;
    return 'الآن';
  }
}