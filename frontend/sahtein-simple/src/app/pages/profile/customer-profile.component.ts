// app/pages/profile/customer-profile.component.ts (UPDATED)
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="customer-profile">
      <!-- Recent Orders -->
      <div class="orders-card">
        <h3>آخر الطلبات</h3>
        
        <!-- Loading State -->
        <div *ngIf="ordersLoading" class="loading-state">
          <div class="loading-spinner">⏳</div>
          <p>جاري تحميل الطلبات...</p>
        </div>

        <!-- Orders List -->
        <div *ngIf="!ordersLoading && recentOrders.length > 0" class="orders-list">
          <div *ngFor="let order of recentOrders.slice(0, 3)" class="order-item">
            <div class="order-info">
              <span class="order-id">#{{ order.id }}</span>
              <span class="order-restaurant">{{ order.restaurant_name || 'مطعم غير محدد' }}</span>
              <span class="order-date">{{ formatDate(order.created_at) }}</span>
            </div>
            <div class="order-status" [ngClass]="'status-' + order.status">
              {{ getOrderStatusText(order.status) }}
            </div>
            <div class="order-total">{{ formatPrice(order.total_price) }}</div>
          </div>
        </div>

        <!-- No Orders State -->
        <div *ngIf="!ordersLoading && recentOrders.length === 0" class="no-orders">
          <div class="no-orders-icon">📦</div>
          <p>لا توجد طلبات سابقة</p>
          <a routerLink="/restaurants" class="start-ordering-btn">ابدأ الطلب الآن</a>
        </div>

        <button *ngIf="!ordersLoading && recentOrders.length > 0" class="view-all-orders-btn" (click)="viewAllOrders()">
          عرض جميع الطلبات
        </button>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions-card">
        <h3>الإجراءات السريعة</h3>
        <div class="quick-actions-grid">
          <a routerLink="/restaurants" class="quick-action">
            <div class="action-icon">🍽️</div>
            <span>تصفح المطاعم</span>
          </a>
          <a routerLink="/cart" class="quick-action">
            <div class="action-icon">🛒</div>
            <span>السلة</span>
          </a>
          <a routerLink="/orders" class="quick-action">
            <div class="action-icon">📦</div>
            <span>طلباتي</span>
          </a>
          <a routerLink="/favorites" class="quick-action favorites-action">
            <div class="action-icon">❤️</div>
            <span>المفضلة</span>
            <div *ngIf="favoritesCount > 0" class="favorites-badge">{{ favoritesCount }}</div>
          </a>
        </div>
      </div>

      <!-- Order Statistics -->
      <div *ngIf="orderStats" class="stats-card">
        <h3>إحصائيات الطلبات</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">{{ orderStats.total_orders || 0 }}</div>
            <div class="stat-label">إجمالي الطلبات</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ formatPrice(orderStats.total_spent || 0) }}</div>
            <div class="stat-label">إجمالي المبلغ</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ orderStats.completed_orders || 0 }}</div>
            <div class="stat-label">طلبات مكتملة</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ orderStats.favorite_restaurant || 'لا يوجد' }}</div>
            <div class="stat-label">المطعم المفضل</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .customer-profile {
      display: grid;
      gap: 2rem;
    }

    .orders-card, .quick-actions-card, .stats-card {
      background: white;
      padding: 2rem;
      border-radius: 15px;
      box-shadow: 0 5px 20px rgba(45, 138, 62, 0.1);
    }

    .orders-card h3, .quick-actions-card h3, .stats-card h3 {
      color: #2d8a3e;
      margin-bottom: 1.5rem;
      font-size: 1.4rem;
    }

    /* Loading State */
    .loading-state {
      text-align: center;
      padding: 2rem;
      color: #666;
    }

    .loading-spinner {
      font-size: 2rem;
      margin-bottom: 1rem;
      animation: spin 2s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Orders */
    .orders-list {
      margin-bottom: 1.5rem;
    }

    .order-item {
      display: grid;
      grid-template-columns: 2fr 1fr auto;
      gap: 1rem;
      align-items: center;
      padding: 1rem;
      border: 1px solid #e8f5e8;
      border-radius: 8px;
      margin-bottom: 0.5rem;
      transition: background 0.2s ease;
    }

    .order-item:hover {
      background: #f8fff8;
    }

    .order-info {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }

    .order-id {
      font-weight: bold;
      color: #2d8a3e;
    }

    .order-restaurant {
      color: #666;
      font-size: 0.9rem;
    }

    .order-date {
      color: #888;
      font-size: 0.8rem;
    }

    .order-status {
      padding: 0.3rem 0.8rem;
      border-radius: 15px;
      font-size: 0.8rem;
      text-align: center;
      font-weight: 500;
    }

    .order-status.status-delivered {
      background: #d4edda;
      color: #155724;
    }

    .order-status.status-pending {
      background: #fff3cd;
      color: #856404;
    }

    .order-status.status-preparing {
      background: #cce5ff;
      color: #004085;
    }

    .order-status.status-cancelled {
      background: #f8d7da;
      color: #721c24;
    }

    .order-total {
      font-weight: bold;
      color: #2d8a3e;
      font-size: 1.1rem;
    }

    .no-orders {
      text-align: center;
      padding: 2rem;
      color: #666;
    }

    .no-orders-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .start-ordering-btn {
      background: linear-gradient(135deg, #2d8a3e, #4caf50);
      color: white;
      padding: 1rem 2rem;
      border-radius: 10px;
      text-decoration: none;
      display: inline-block;
      margin-top: 1rem;
      transition: transform 0.3s ease;
    }

    .start-ordering-btn:hover {
      transform: translateY(-2px);
      color: white;
    }

    .view-all-orders-btn {
      background: #2d8a3e;
      color: white;
      border: none;
      padding: 0.8rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      width: 100%;
      transition: background 0.3s ease;
    }

    .view-all-orders-btn:hover {
      background: #268a37;
    }

    /* Quick Actions */
    .quick-actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
    }

    .quick-action {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1.5rem;
      background: #f8f9fa;
      border-radius: 12px;
      text-decoration: none;
      color: #333;
      transition: all 0.3s ease;
      position: relative;
    }

    .quick-action:hover {
      background: #2d8a3e;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(45, 138, 62, 0.3);
    }

    .action-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .favorites-action {
      position: relative;
    }

    .favorites-badge {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: #ff4757;
      color: white;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      font-weight: bold;
    }

    /* Statistics */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
    }

    .stat-item {
      text-align: center;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 10px;
    }

    .stat-number {
      font-size: 1.5rem;
      font-weight: bold;
      color: #2d8a3e;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      color: #666;
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .order-item {
        grid-template-columns: 1fr;
        text-align: center;
        gap: 0.5rem;
      }

      .quick-actions-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class CustomerProfileComponent implements OnInit {
  recentOrders: any[] = [];
  orderStats: any = null;
  ordersLoading = true;
  favoritesCount = 0;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit() {
    this.loadCustomerData();
    this.loadFavoritesCount();
  }

  loadCustomerData() {
    this.ordersLoading = true;
    
    // Load user orders
    this.apiService.getUserOrders().subscribe({
      next: (response) => {
        console.log('Orders response:', response);
        this.recentOrders = response.orders || [];
        this.ordersLoading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.ordersLoading = false;
        this.recentOrders = [];
      }
    });

    // Load order statistics
    this.apiService.getUserOrderStats().subscribe({
      next: (stats) => {
        console.log('Order stats:', stats);
        this.orderStats = stats;
      },
      error: (error) => {
        console.error('Error loading order stats:', error);
      }
    });
  }

  loadFavoritesCount() {
    this.favoritesService.getUserFavorites().subscribe({
      next: (favorites) => {
        this.favoritesCount = favorites.length;
      },
      error: (error) => {
        console.error('Error loading favorites count:', error);
      }
    });
  }

  viewAllOrders() {
    this.router.navigate(['/orders']);
  }

  getOrderStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'قيد الانتظار',
      'preparing': 'قيد التحضير',
      'ready': 'جاهز',
      'delivering': 'قيد التوصيل',
      'delivered': 'تم التوصيل',
      'cancelled': 'ملغي'
    };
    return statusMap[status] || status;
  }

  formatPrice(price: number): string {
    if (!price) return '0 س.ل';
    return `${price.toLocaleString()} س.ل`;
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA');
  }
}