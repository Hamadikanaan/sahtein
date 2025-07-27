// app/pages/orders/orders.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="orders-container">
      <h1>طلباتي</h1>
      
      <!-- User Stats -->
      <div *ngIf="stats" class="stats-section">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number">{{ stats.total_orders }}</div>
            <div class="stat-label">إجمالي الطلبات</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ stats.delivered_orders }}</div>
            <div class="stat-label">طلبات مُسلمة</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ stats.pending_orders }}</div>
            <div class="stat-label">طلبات معلقة</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ formatPrice(stats.total_spent) }}</div>
            <div class="stat-label">إجمالي المصروفات</div>
          </div>
        </div>
      </div>
      
      <!-- Status Filter -->
      <div class="filter-section">
        <label>فلترة حسب الحالة:</label>
        <select [(ngModel)]="selectedStatus" (change)="applyFilter()" class="status-filter">
          <option value="all">جميع الطلبات</option>
          <option value="pending">في الانتظار</option>
          <option value="confirmed">مؤكد</option>
          <option value="preparing">يتم التحضير</option>
          <option value="ready">جاهز</option>
          <option value="delivered">تم التوصيل</option>
          <option value="cancelled">ملغي</option>
        </select>
      </div>
      
      <div *ngIf="!loading && filteredOrders.length > 0" class="orders-list">
        <div *ngFor="let order of filteredOrders" class="order-card">
          <div class="order-header">
            <div class="order-info">
              <h3>طلب #{{ order.id }}</h3>
              <p class="order-date">{{ formatDate(order.created_at) }}</p>
              <p class="restaurant-name">🏪 {{ order.restaurant_name }}</p>
            </div>
            <div class="order-status" [class]="'status-' + order.status">
              {{ getStatusText(order.status) }}
            </div>
          </div>
          
          <div class="order-items">
            <div *ngFor="let item of order.items" class="order-item">
              <span class="item-name">{{ item.dish_name }}</span>
              <span class="item-qty">x{{ item.quantity }}</span>
              <span class="item-price">{{ formatPrice(item.subtotal) }}</span>
            </div>
          </div>
          
          <div class="order-details">
            <p class="order-address">📍 {{ order.delivery_address }}</p>
            <p class="order-phone">📞 {{ order.phone }}</p>
            <p *ngIf="order.notes" class="order-notes">📝 {{ order.notes }}</p>
          </div>
          
          <div class="order-footer">
            <div class="order-total">
              المجموع: {{ formatPrice(order.total_price) }}
            </div>
            <div class="order-actions">
              <button 
                *ngIf="order.status === 'pending'" 
                (click)="cancelOrder(order.id)"
                class="cancel-btn"
              >
                إلغاء الطلب
              </button>
              <button 
                (click)="viewOrderDetails(order.id)"
                class="details-btn"
              >
                تفاصيل
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
        جارٍ تحميل الطلبات...
      </div>
      
      <div *ngIf="!loading && orders.length === 0" class="no-orders">
        <div class="no-orders-icon">📦</div>
        <h2>لا توجد طلبات</h2>
        <p>لم تقم بإجراء أي طلبات بعد</p>
        <a routerLink="/restaurants" class="browse-btn">تصفح المطاعم</a>
      </div>
      
      <div *ngIf="!loading && orders.length > 0 && filteredOrders.length === 0" class="no-filtered-results">
        <div class="no-results-icon">🔍</div>
        <h3>لا توجد طلبات مطابقة للفلتر</h3>
        <p>جرب تغيير الفلتر لرؤية طلبات أخرى</p>
      </div>
      
      <div *ngIf="error" class="error-message">
        <p>{{ error }}</p>
        <button (click)="loadOrders()" class="retry-btn">إعادة المحاولة</button>
      </div>
    </div>
  `,
  styles: [`
    .orders-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem;
    }
    .orders-container h1 {
      text-align: center;
      color: #333;
      margin-bottom: 2rem;
    }
    
    /* Statistics */
    .stats-section {
      margin-bottom: 2rem;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 15px;
      text-align: center;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      border-left: 4px solid #667eea;
    }
    .stat-number {
      font-size: 2rem;
      font-weight: bold;
      color: #667eea;
      margin-bottom: 0.5rem;
    }
    .stat-label {
      color: #666;
      font-size: 0.9rem;
    }
    
    /* Filter */
    .filter-section {
      background: white;
      padding: 1rem;
      border-radius: 10px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
      text-align: right;
    }
    .filter-section label {
      margin-left: 1rem;
      color: #555;
      font-weight: 500;
    }
    .status-filter {
      padding: 0.5rem;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 1rem;
      direction: rtl;
    }
    
    /* Orders List */
    .orders-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .order-card {
      background: white;
      border-radius: 15px;
      padding: 1.5rem;
      box-shadow: 0 8px 25px rgba(0,0,0,0.1);
      border: 1px solid #e8f4fd;
      transition: transform 0.3s ease;
    }
    .order-card:hover {
      transform: translateY(-2px);
    }
    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #eee;
    }
    .order-info h3 {
      color: #333;
      margin-bottom: 0.5rem;
    }
    .order-date {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 0.3rem;
    }
    .restaurant-name {
      color: #667eea;
      font-weight: 500;
      font-size: 0.9rem;
    }
    .order-status {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-weight: 500;
      font-size: 0.9rem;
      white-space: nowrap;
    }
    .status-pending {
      background: #fff3cd;
      color: #856404;
    }
    .status-confirmed {
      background: #d4edda;
      color: #155724;
    }
    .status-preparing {
      background: #cce5ff;
      color: #004085;
    }
    .status-ready {
      background: #d1ecf1;
      color: #0c5460;
    }
    .status-delivered {
      background: #d4edda;
      color: #155724;
    }
    .status-cancelled {
      background: #f8d7da;
      color: #721c24;
    }
    .order-items {
      margin-bottom: 1rem;
    }
    .order-item {
      display: grid;
      grid-template-columns: 1fr auto auto;
      gap: 1rem;
      align-items: center;
      padding: 0.5rem 0;
      border-bottom: 1px solid #f5f5f5;
    }
    .order-item:last-child {
      border-bottom: none;
    }
    .item-name {
      color: #333;
    }
    .item-qty {
      color: #666;
      font-size: 0.9rem;
    }
    .item-price {
      color: #ff4757;
      font-weight: 500;
    }
    .order-details {
      margin-bottom: 1rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
    }
    .order-details p {
      margin-bottom: 0.5rem;
      color: #555;
      font-size: 0.9rem;
    }
    .order-details p:last-child {
      margin-bottom: 0;
    }
    .order-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      border-top: 1px solid #eee;
    }
    .order-total {
      font-weight: bold;
      color: #333;
      font-size: 1.1rem;
    }
    .order-actions {
      display: flex;
      gap: 0.5rem;
    }
    .cancel-btn,
    .details-btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: background 0.3s ease;
    }
    .cancel-btn {
      background: #ff4757;
      color: white;
    }
    .cancel-btn:hover {
      background: #ff3742;
    }
    .details-btn {
      background: #667eea;
      color: white;
    }
    .details-btn:hover {
      background: #5a67d8;
    }
    
    /* Loading */
    .loading {
      text-align: center;
      padding: 3rem;
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
    
    /* No Orders */
    .no-orders {
      text-align: center;
      padding: 4rem 2rem;
    }
    .no-orders-icon {
      font-size: 5rem;
      margin-bottom: 1rem;
    }
    .no-orders h2 {
      color: #333;
      margin-bottom: 1rem;
    }
    .no-orders p {
      color: #666;
      margin-bottom: 2rem;
    }
    .browse-btn {
      display: inline-block;
      background: #667eea;
      color: white;
      padding: 1rem 2rem;
      text-decoration: none;
      border-radius: 10px;
      transition: background 0.3s ease;
    }
    .browse-btn:hover {
      background: #5a67d8;
    }
    
    /* No Filtered Results */
    .no-filtered-results {
      text-align: center;
      padding: 3rem 2rem;
    }
    .no-results-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }
    .no-filtered-results h3 {
      color: #333;
      margin-bottom: 1rem;
    }
    .no-filtered-results p {
      color: #666;
    }
    
    /* Error */
    .error-message {
      text-align: center;
      padding: 2rem;
      background: #f8d7da;
      color: #721c24;
      border-radius: 10px;
      margin-bottom: 2rem;
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
      .order-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }
      .order-footer {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }
      .order-actions {
        justify-content: center;
      }
    }
  `]
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];
  stats: any = null;
  loading = true;
  error = '';
  selectedStatus = 'all';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadOrders();
    this.loadStats();
  }

  loadOrders() {
    this.loading = true;
    this.error = '';
    
    this.apiService.getUserOrders().subscribe({
      next: (response) => {
        console.log('Orders Response:', response);
        this.orders = response.orders || [];
        this.applyFilter();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.error = 'فشل في تحميل الطلبات';
        this.loading = false;
      }
    });
  }

  loadStats() {
    this.apiService.getUserOrderStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (err) => {
        console.error('Error loading stats:', err);
      }
    });
  }

  applyFilter() {
    if (this.selectedStatus === 'all') {
      this.filteredOrders = this.orders;
    } else {
      this.filteredOrders = this.orders.filter(order => order.status === this.selectedStatus);
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatPrice(price: number): string {
    return `${price.toLocaleString()} س.ل`;
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'في الانتظار',
      'confirmed': 'مؤكد',
      'preparing': 'يتم التحضير',
      'ready': 'جاهز',
      'delivered': 'تم التوصيل',
      'cancelled': 'ملغي'
    };
    return statusMap[status] || status;
  }

  cancelOrder(orderId: number) {
    if (confirm('هل أنت متأكد من إلغاء هذا الطلب؟')) {
      this.apiService.updateOrderStatus(orderId, 'cancelled').subscribe({
        next: () => {
          this.loadOrders(); // Reload orders
          alert('تم إلغاء الطلب بنجاح');
        },
        error: (err) => {
          console.error('Error cancelling order:', err);
          alert('فشل في إلغاء الطلب');
        }
      });
    }
  }

  viewOrderDetails(orderId: number) {
    // TODO: Navigate to order details page or show modal
    alert(`عرض تفاصيل الطلب #${orderId}`);
  }
}