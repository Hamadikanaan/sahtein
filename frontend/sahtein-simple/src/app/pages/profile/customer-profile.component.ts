// app/pages/profile/customer-profile.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="customer-profile">
      <!-- Recent Orders -->
      <div class="orders-card">
        <h3>آخر الطلبات</h3>
        <div *ngIf="recentOrders.length > 0" class="orders-list">
          <div *ngFor="let order of recentOrders.slice(0, 3)" class="order-item">
            <div class="order-info">
              <span class="order-id">#{{ order.id }}</span>
              <span class="order-restaurant">{{ order.restaurant_name }}</span>
              <span class="order-date">{{ formatDate(order.created_at) }}</span>
            </div>
            <div class="order-status" [ngClass]="'status-' + order.status">
              {{ getOrderStatusText(order.status) }}
            </div>
            <div class="order-total">{{ formatPrice(order.total_price) }}</div>
          </div>
        </div>
        <div *ngIf="recentOrders.length === 0" class="no-orders">
          <div class="no-orders-icon">📦</div>
          <p>لا توجد طلبات سابقة</p>
          <a routerLink="/restaurants" class="start-ordering-btn">ابدأ الطلب الآن</a>
        </div>
        <button *ngIf="recentOrders.length > 0" class="view-all-orders-btn" (click)="viewAllOrders()">
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
          <a routerLink="/favorites" class="quick-action">
            <div class="action-icon">❤️</div>
            <span>المفضلة</span>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .customer-profile {
      display: grid;
      gap: 2rem;
    }

    .orders-card, .quick-actions-card {
      background: white;
      padding: 2rem;
      border-radius: 15px;
      box-shadow: 0 5px 20px rgba(45, 138, 62, 0.1);
    }

    .orders-card h3, .quick-actions-card h3 {
      color: #2d8a3e;
      margin-bottom: 1.5rem;
      font-size: 1.4rem;
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

    .order-total {
      font-weight: bold;
      color: #2d8a3e;
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

    @media (max-width: 768px) {
      .order-item {
        grid-template-columns: 1fr;
        text-align: center;
      }

      .quick-actions-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class CustomerProfileComponent implements OnInit {
  recentOrders: any[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadCustomerData();
  }

  loadCustomerData() {
    // Mock Data
    this.recentOrders = [
      {
        id: 1,
        restaurant_name: 'مطعم الشام',
        created_at: '2025-01-15',
        status: 'delivered',
        total_price: 45000
      },
      {
        id: 2,
        restaurant_name: 'مطعم حلب',
        created_at: '2025-01-10',
        status: 'delivered',
        total_price: 32000
      }
    ];
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
    return `${price.toLocaleString()} س.ل`;
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA');
  }
}