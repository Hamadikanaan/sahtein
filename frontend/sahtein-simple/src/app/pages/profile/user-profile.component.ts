// app/pages/user/profile/user-profile.component.ts - MAIN COMPONENT
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { CustomerProfileComponent } from './customer-profile.component';
import { RestaurantProfileComponent } from './restaurant-profile.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule,
    CustomerProfileComponent,
    RestaurantProfileComponent
  ],
  template: `
    <div class="profile-container">
      <!-- Profile Header -->
      <div class="profile-header">
        <div class="profile-avatar">
          <div class="avatar-circle">👤</div>
        </div>
        <div class="profile-info">
          <h1>{{ user?.name || 'المستخدم' }}</h1>
          <p class="user-email">{{ user?.email }}</p>
          <p class="member-since">عضو منذ {{ formatDate(user?.created_at) }}</p>
          <div class="user-type-badge" [ngClass]="getUserTypeBadgeClass()">
            {{ getUserTypeText() }}
          </div>
        </div>
      </div>

      <div class="profile-content">
        <!-- Personal Information Card -->
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
              <span>{{ user?.phone || 'غير محدد' }}</span>
            </div>
            <div class="info-item">
              <label>العنوان:</label>
              <span>{{ user?.address || 'غير محدد' }}</span>
            </div>
          </div>
          <button class="edit-profile-btn" (click)="editProfile()">
            تعديل المعلومات
          </button>
        </div>

        <!-- Customer-specific Content -->
        <app-customer-profile *ngIf="isCustomer()"></app-customer-profile>

        <!-- Restaurant-specific Content -->
        <app-restaurant-profile *ngIf="isRestaurant()"></app-restaurant-profile>
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
      margin-bottom: 1rem;
    }

    .user-type-badge {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 500;
      display: inline-block;
    }

    .user-type-badge.customer {
      background: #e3f2fd;
      color: #1976d2;
    }

    .user-type-badge.restaurant {
      background: #e8f5e8;
      color: #2d8a3e;
    }

    .user-type-badge.admin {
      background: #fce4ec;
      color: #ad1457;
    }

    .profile-content {
      display: grid;
      gap: 2rem;
    }

    /* Personal Info Card */
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
      padding: 0.5rem 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .edit-profile-btn {
      background: #2d8a3e;
      color: white;
      border: none;
      padding: 0.8rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 1rem;
    }

    .edit-profile-btn:hover {
      background: #268a37;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(45, 138, 62, 0.3);
    }

    @media (max-width: 768px) {
      .profile-container {
        padding: 1rem;
      }

      .profile-header {
        flex-direction: column;
        text-align: center;
        padding: 1.5rem;
      }

      .profile-info h1 {
        font-size: 1.5rem;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }

      .avatar-circle {
        width: 80px;
        height: 80px;
        font-size: 2.5rem;
      }
    }

    @media (max-width: 480px) {
      .profile-container {
        padding: 0.5rem;
      }

      .profile-header {
        padding: 1rem;
      }

      .info-card {
        padding: 1.5rem;
      }
    }
  `]
})
export class UserProfileComponent implements OnInit {
  user: any = null;
  loading = true;

  constructor(
    private router: Router,
    private authService: AuthService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    this.user = this.authService.getCurrentUser();
    
    if (this.user) {
      console.log('Current user:', this.user);
      console.log('User type:', this.authService.getUserType());
      this.loading = false;
    } else {
      // Redirect to login if no user
      this.router.navigate(['/login']);
    }
  }

  // User Type Detection
  isCustomer(): boolean {
    return this.authService.getUserType() === 'customer';
  }

  isRestaurant(): boolean {
    const userType = this.authService.getUserType();
    return userType === 'admin' || userType === 'restaurant';
  }

  isAdmin(): boolean {
    return this.authService.getUserType() === 'admin';
  }

  getUserTypeText(): string {
    if (this.isCustomer()) return 'عميل';
    if (this.isRestaurant()) return 'مالك مطعم';
    if (this.isAdmin()) return 'مدير';
    return 'مستخدم';
  }

  getUserTypeBadgeClass(): string {
    if (this.isCustomer()) return 'customer';
    if (this.isRestaurant()) return 'restaurant';
    if (this.isAdmin()) return 'admin';
    return 'customer';
  }

  editProfile() {
    this.router.navigate(['/user/edit-profile']);
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA');
  }
}