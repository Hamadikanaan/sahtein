// app/pages/profile/restaurant-profile.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-restaurant-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="restaurant-profile">
      <!-- Restaurant Management -->
      <div class="restaurant-card">
        <div class="restaurant-header">
          <h3>🏪 إدارة المطعم</h3>
          <div class="restaurant-status active">نشط</div>
        </div>
        
        <div class="restaurant-content">
          <div class="restaurant-info">
            <h4>{{ restaurantName }}</h4>
            <p class="restaurant-description">{{ restaurantDescription }}</p>
            <div class="restaurant-details">
              <span class="restaurant-category">{{ restaurantCategory }}</span>
              <span class="restaurant-rating">⭐ {{ restaurantRating }}</span>
            </div>
          </div>
          <div class="restaurant-actions">
            <button class="manage-btn primary" (click)="manageRestaurant()">
              إدارة المطعم
            </button>
            <button class="menu-btn" (click)="manageMenu()">
              إدارة القائمة
            </button>
            <button class="orders-btn" (click)="viewOrders()">
              الطلبات
            </button>
            <button class="stats-btn" (click)="viewStats()">
              الإحصائيات
            </button>
          </div>
        </div>
      </div>

      <!-- Restaurant Quick Stats -->
      <div class="restaurant-stats-card">
        <h3>إحصائيات سريعة</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">{{ todayOrders }}</div>
            <div class="stat-label">طلبات اليوم</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ menuItems }}</div>
            <div class="stat-label">عناصر القائمة</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ restaurantRating }}</div>
            <div class="stat-label">التقييم</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ formatPrice(monthlyRevenue) }}</div>
            <div class="stat-label">الإيرادات الشهرية</div>
          </div>
        </div>
      </div>

      <!-- Recent Restaurant Orders -->
      <div class="restaurant-orders-card">
        <h3>آخر الطلبات</h3>
        <div *ngIf="recentRestaurantOrders.length > 0" class="orders-list">
          <div *ngFor="let order of recentRestaurantOrders.slice(0, 5)" class="order-item">
            <div class="order-info">
              <span class="order-id">#{{ order.id }}</span>
              <span class="customer-name">{{ order.customer_name }}</span>
              <span class="order-time">{{ formatTime(order.created_at) }}</span>
            </div>
            <div class="order-status" [ngClass]="'status-' + order.status">
              {{ getOrderStatusText(order.status) }}
            </div>
            <div class="order-total">{{ formatPrice(order.total_price) }}</div>
            <div class="order-actions">
              <button *ngIf="order.status === 'pending'" class="accept-btn" (click)="acceptOrder(order.id)">
                قبول
              </button>
              <button *ngIf="order.status === 'preparing'" class="ready-btn" (click)="markReady(order.id)">
                جاهز
              </button>
            </div>
          </div>
        </div>
        <div *ngIf="recentRestaurantOrders.length === 0" class="no-orders">
          <div class="no-orders-icon">📋</div>
          <p>لا توجد طلبات جديدة</p>
        </div>
        <button class="view-all-orders-btn" (click)="viewAllRestaurantOrders()">
          عرض جميع الطلبات
        </button>
      </div>
    </div>
  `,
  styles: [`
    .restaurant-profile {
      display: grid;
      gap: 2rem;
    }

    .restaurant-card, .restaurant-stats-card, .restaurant-orders-card {
      background: white;
      padding: 2rem;
      border-radius: 15px;
      box-shadow: 0 5px 20px rgba(45, 138, 62, 0.1);
    }

    .restaurant-card {
      border: 2px solid #e8f5e8;
    }

    .restaurant-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .restaurant-header h3, .restaurant-stats-card h3, .restaurant-orders-card h3 {
      color: #2d8a3e;
      margin: 0;
      font-size: 1.4rem;
    }

    .restaurant-status {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .restaurant-status.active {
      background: #d4edda;
      color: #155724;
    }

    .restaurant-info h4 {
      color: #2d8a3e;
      margin-bottom: 0.5rem;
      font-size: 1.3rem;
    }

    .restaurant-description {
      color: #666;
      margin-bottom: 1rem;
      line-height: 1.5;
    }

    .restaurant-details {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .restaurant-category {
      background: #e8f5e8;
      color: #2d8a3e;
      padding: 0.3rem 0.8rem;
      border-radius: 15px;
      font-size: 0.9rem;
    }

    .restaurant-rating {
      color: #ffa502;
      font-weight: 500;
    }

    .restaurant-actions {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
    }

    .restaurant-actions button {
      padding: 1rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;
    }

    .manage-btn.primary {
      background: linear-gradient(135deg, #2d8a3e, #4caf50);
      color: white;
    }

    .menu-btn {
      background: #17a2b8;
      color: white;
    }

    .orders-btn {
      background: #ffc107;
      color: #212529;
    }

    .stats-btn {
      background: #6f42c1;
      color: white;
    }

    .restaurant-actions button:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }

    /* Restaurant Stats */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 1rem;
    }

    .stat-item {
      text-align: center;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 12px;
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

    /* Restaurant Orders */
    .orders-list {
      margin-bottom: 1.5rem;
    }

    .order-item {
      display: grid;
      grid-template-columns: 2fr 1fr auto 1fr;
      gap: 1rem;
      align-items: center;
      padding: 1rem;
      border: 1px solid #e8f5e8;
      border-radius: 8px;
      margin-bottom: 0.5rem;
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

    .customer-name {
      color: #666;
      font-size: 0.9rem;
    }

    .order-time {
      color: #888;
      font-size: 0.8rem;
    }

    .order-status {
      padding: 0.3rem 0.8rem;
      border-radius: 15px;
      font-size: 0.8rem;
      text-align: center;
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

    .order-status.status-ready {
      background: #d1ecf1;
      color: #0c5460;
    }

    .order-total {
      font-weight: bold;
      color: #2d8a3e;
    }

    .order-actions {
      display: flex;
      gap: 0.5rem;
    }

    .accept-btn, .ready-btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.8rem;
      transition: all 0.3s ease;
    }

    .accept-btn {
      background: #28a745;
      color: white;
    }

    .ready-btn {
      background: #17a2b8;
      color: white;
    }

    .accept-btn:hover, .ready-btn:hover {
      transform: translateY(-1px);
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

    @media (max-width: 768px) {
      .restaurant-actions {
        grid-template-columns: 1fr;
      }

      .order-item {
        grid-template-columns: 1fr;
        text-align: center;
        gap: 0.5rem;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class RestaurantProfileComponent implements OnInit {
  restaurantName = 'مطعم الشام';
  restaurantDescription = 'أفضل المأكولات السورية الأصيلة';
  restaurantCategory = 'مشاوي';
  restaurantRating = 4.5;
  
  recentRestaurantOrders: any[] = [];
  todayOrders = 8;
  menuItems = 25;
  monthlyRevenue = 2500000;

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadRestaurantData();
  }

  loadRestaurantData() {
    // Mock Orders
    this.recentRestaurantOrders = [
      {
        id: 101,
        customer_name: 'أحمد محمد',
        created_at: '2025-01-15T14:30:00',
        status: 'pending',
        total_price: 45000
      },
      {
        id: 102,
        customer_name: 'فاطمة علي',
        created_at: '2025-01-15T13:15:00',
        status: 'preparing',
        total_price: 32000
      },
      {
        id: 103,
        customer_name: 'محمد حسن',
        created_at: '2025-01-15T12:45:00',
        status: 'ready',
        total_price: 28000
      }
    ];
  }

  manageRestaurant() {
    this.router.navigate(['/user/restaurant-management']);
  }

  manageMenu() {
    this.router.navigate(['/user/menu-management']);
  }

  viewOrders() {
    this.router.navigate(['/user/restaurant-orders']);
  }

  viewStats() {
    this.router.navigate(['/user/restaurant-stats']);
  }

  viewAllRestaurantOrders() {
    this.router.navigate(['/user/restaurant-orders']);
  }

  acceptOrder(orderId: number) {
    const order = this.recentRestaurantOrders.find(o => o.id === orderId);
    if (order) {
      order.status = 'preparing';
    }
  }

  markReady(orderId: number) {
    const order = this.recentRestaurantOrders.find(o => o.id === orderId);
    if (order) {
      order.status = 'ready';
    }
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
    return `${price.toLocaleString()} س.ل`;
  }

  formatTime(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
  }
}