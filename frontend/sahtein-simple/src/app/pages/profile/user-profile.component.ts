// app/pages/user/profile/user-profile.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';  
import { ApiService } from '../../services/api.service';   
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="profile-container">
      <div class="profile-header">
        <div class="profile-avatar">
          <div class="avatar-circle">👤</div>
        </div>
        <div class="profile-info">
          <h1>{{ user?.name || 'المستخدم' }}</h1>
          <p class="user-email">{{ user?.email }}</p>
          <p class="member-since">عضو منذ {{ formatDate(user?.created_at) }}</p>
        </div>
      </div>

      <div class="profile-content">
        <!-- Personal Information -->
        <div class="info-card">
          <h3>المعلومات الشخصية</h3>
          <div class="info-grid">
            <div class="info-item">
              <label>الاسم الكامل:</label>
              <span>{{ user?.name }}</span>
            </div>
            <div class="info-item">
              <label>البريد الإلكتروني:</label>
              <span>{{ user?.email }}</span>
            </div>
            <div class="info-item">
              <label>رقم الهاتف:</label>
              <span>{{ user?.phone }}</span>
            </div>
            <div class="info-item">
              <label>العنوان:</label>
              <span>{{ user?.address }}</span>
            </div>
          </div>
          <button class="edit-profile-btn" (click)="editProfile()">
            تعديل المعلومات
          </button>
        </div>

        <!-- Restaurant Management -->
        <div class="restaurant-card">
          <div class="restaurant-header">
            <h3>🏪 إدارة المطعم</h3>
            <div class="restaurant-status" [ngClass]="getRestaurantStatusClass()">
              {{ getRestaurantStatusText() }}
            </div>
          </div>
          
          <div class="restaurant-content">
            <div *ngIf="!userRestaurant && !hasRestaurantApplication" class="no-restaurant">
              <div class="no-restaurant-icon">🍽️</div>
              <h4>لا تملك مطعماً بعد</h4>
              <p>ابدأ رحلتك في عالم الطعام وأنشئ مطعمك الخاص</p>
              <button class="create-restaurant-btn" (click)="createRestaurant()">
                إنشاء مطعم جديد
              </button>
            </div>

            <div *ngIf="hasRestaurantApplication && !userRestaurant" class="pending-restaurant">
              <div class="pending-icon">⏳</div>
              <h4>طلب المطعم قيد المراجعة</h4>
              <p>سيتم مراجعة طلبك خلال 24-48 ساعة</p>
              <div class="application-info">
                <p><strong>اسم المطعم:</strong> {{ pendingApplication?.restaurant_name }}</p>
                <p><strong>تاريخ التقديم:</strong> {{ formatDate(pendingApplication?.created_at) }}</p>
              </div>
            </div>

            <div *ngIf="userRestaurant" class="active-restaurant">
              <div class="restaurant-info">
                <h4>{{ userRestaurant.name_ar }}</h4>
                <p class="restaurant-description">{{ userRestaurant.description_ar }}</p>
                <div class="restaurant-details">
                  <span class="restaurant-category">{{ userRestaurant.category }}</span>
                  <span class="restaurant-rating">⭐ {{ userRestaurant.rating || 'جديد' }}</span>
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
        </div>

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
          </div>
          <button class="view-all-orders-btn" (click)="viewAllOrders()">
            عرض جميع الطلبات
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 2rem;
      background: #f8f9fa;
      min-height: 100vh;
    }

    .profile-header {
      background: white;
      padding: 2rem;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(45, 138, 62, 0.1);
      margin-bottom: 2rem;
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .profile-avatar {
      text-align: center;
    }

    .avatar-circle {
      width: 100px;
      height: 100px;
      background: linear-gradient(135deg, #2d8a3e, #4caf50);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .profile-info h1 {
      color: #2d8a3e;
      margin-bottom: 0.5rem;
      font-size: 2rem;
    }

    .user-email {
      color: #666;
      margin-bottom: 0.3rem;
      font-size: 1.1rem;
    }

    .member-since {
      color: #888;
      font-size: 0.9rem;
    }

    .profile-content {
      display: grid;
      gap: 2rem;
    }

    /* Info Card */
    .info-card {
      background: white;
      padding: 2rem;
      border-radius: 15px;
      box-shadow: 0 5px 20px rgba(45, 138, 62, 0.1);
    }

    .info-card h3 {
      color: #2d8a3e;
      margin-bottom: 1.5rem;
      font-size: 1.4rem;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }

    .info-item label {
      color: #666;
      font-weight: 500;
      font-size: 0.9rem;
    }

    .info-item span {
      color: #333;
      font-size: 1rem;
    }

    .edit-profile-btn {
      background: #2d8a3e;
      color: white;
      border: none;
      padding: 0.8rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.3s ease;
    }

    .edit-profile-btn:hover {
      background: #268a37;
    }

    /* Restaurant Card */
    .restaurant-card {
      background: white;
      padding: 2rem;
      border-radius: 15px;
      box-shadow: 0 5px 20px rgba(45, 138, 62, 0.1);
      border: 2px solid #e8f5e8;
    }

    .restaurant-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .restaurant-header h3 {
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

    .restaurant-status.pending {
      background: #fff3cd;
      color: #856404;
    }

    .restaurant-status.active {
      background: #d4edda;
      color: #155724;
    }

    .restaurant-status.none {
      background: #f8d7da;
      color: #721c24;
    }

    /* No Restaurant */
    .no-restaurant {
      text-align: center;
      padding: 3rem 2rem;
    }

    .no-restaurant-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .no-restaurant h4 {
      color: #2d8a3e;
      margin-bottom: 1rem;
    }

    .no-restaurant p {
      color: #666;
      margin-bottom: 2rem;
    }

    .create-restaurant-btn {
      background: linear-gradient(135deg, #2d8a3e, #4caf50);
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 10px;
      cursor: pointer;
      font-size: 1.1rem;
      font-weight: 500;
      transition: transform 0.3s ease;
    }

    .create-restaurant-btn:hover {
      transform: translateY(-2px);
    }

    /* Pending Restaurant */
    .pending-restaurant {
      text-align: center;
      padding: 2rem;
      background: #fff3cd;
      border-radius: 10px;
    }

    .pending-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .pending-restaurant h4 {
      color: #856404;
      margin-bottom: 1rem;
    }

    .pending-restaurant p {
      color: #856404;
      margin-bottom: 1.5rem;
    }

    .application-info {
      background: white;
      padding: 1rem;
      border-radius: 8px;
      text-align: right;
    }

    .application-info p {
      margin: 0.5rem 0;
      color: #333;
    }

    /* Active Restaurant */
    .active-restaurant {
      display: grid;
      gap: 2rem;
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

    /* Orders Card */
    .orders-card {
      background: white;
      padding: 2rem;
      border-radius: 15px;
      box-shadow: 0 5px 20px rgba(45, 138, 62, 0.1);
    }

    .orders-card h3 {
      color: #2d8a3e;
      margin-bottom: 1.5rem;
      font-size: 1.4rem;
    }

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
      text-align: left;
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
      .profile-header {
        flex-direction: column;
        text-align: center;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }

      .restaurant-actions {
        grid-template-columns: 1fr;
      }

      .order-item {
        grid-template-columns: 1fr;
        text-align: center;
      }
    }
  `]
})
export class UserProfileComponent implements OnInit {
  user: any = null;
  userRestaurant: any = null;
  hasRestaurantApplication = false;
  pendingApplication: any = null;
  recentOrders: any[] = [];
  loading = true;

  constructor(
    private router: Router,
    private authService: AuthService,  // ← Muss hier stehen
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.loadUserData();
  }

loadRecentOrders() {
  // this.apiService.getUserOrders(this.user.id).subscribe({
  //   next: (orders) => {
  //     this.recentOrders = orders.slice(0, 5); // Last 5 orders
  //   },
  //   error: (err) => {
  //     console.error('Error loading orders:', err);
  //   }
  // });
  
  // Temporär:
  this.recentOrders = [];
}

loadUserData() {
  this.user = this.authService.getCurrentUser();
  
  if (this.user) {
    this.loadUserRestaurant();
    this.loadRecentOrders();
  }
}
loadUserRestaurant() {
  // this.apiService.getUserRestaurant(this.user.id).subscribe({...
  
  // Temporär - Mock Restaurant hinzufügen:
  this.userRestaurant = {
    id: 1,
    name_ar: 'مطعم الشام',
    description_ar: 'أفضل المأكولات السورية الأصيلة',
    category: 'مشاوي',
    rating: 4.5
  };

  this.loading = false;
}



  getRestaurantStatusClass(): string {
    if (this.userRestaurant) return 'active';
    if (this.hasRestaurantApplication) return 'pending';
    return 'none';
  }

  getRestaurantStatusText(): string {
    if (this.userRestaurant) return 'نشط';
    if (this.hasRestaurantApplication) return 'قيد المراجعة';
    return 'غير موجود';
  }

  createRestaurant() {
    this.router.navigate(['/user/create-restaurant']);
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

  editProfile() {
    this.router.navigate(['/user/edit-profile']);
  }

  viewAllOrders() {
    this.router.navigate(['/user/orders']);
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