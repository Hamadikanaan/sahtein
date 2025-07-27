// app/pages/profile/profile.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="profile-container">
      <h1>الملف الشخصي</h1>
      
      <div *ngIf="profileData" class="profile-card">
        <div class="profile-header">
          <div class="profile-avatar">
            {{ isAdmin ? '👨‍💼' : '👤' }}
          </div>
          <h2>{{ profileData.name || profileData.username }}</h2>
          <span *ngIf="isAdmin" class="role-badge">{{ getRoleLabel() }}</span>
        </div>
        
        <form class="profile-form">
          <!-- For Regular Users -->
          <div *ngIf="!isAdmin">
            <div class="form-group">
              <label>الاسم الكامل</label>
              <input 
                type="text" 
                [value]="profileData.name" 
                name="name"
                class="form-control"
                readonly
              >
            </div>
            
            <div class="form-group">
              <label>البريد الإلكتروني</label>
              <input 
                type="email" 
                [value]="profileData.email" 
                name="email"
                class="form-control"
                readonly
              >
            </div>
            
            <div class="form-group">
              <label>رقم الهاتف</label>
              <input 
                type="tel" 
                [value]="profileData.phone" 
                name="phone"
                class="form-control"
                readonly
              >
            </div>
            
            <div class="form-group">
              <label>العنوان</label>
              <input 
                type="text" 
                [value]="profileData.address" 
                name="address"
                class="form-control"
                readonly
              >
            </div>
          </div>

          <!-- For Admin Users -->
          <div *ngIf="isAdmin">
            <div class="form-group">
              <label>اسم المستخدم</label>
              <input 
                type="text" 
                [value]="profileData.username" 
                name="username"
                class="form-control"
                readonly
              >
            </div>
            
            <div class="form-group">
              <label>النوع</label>
              <input 
                type="text" 
                [value]="getRoleLabel()" 
                name="role"
                class="form-control"
                readonly
              >
            </div>
            
            <div class="form-group">
              <label>الحالة</label>
              <input 
                type="text" 
                [value]="getStatusLabel()" 
                name="status"
                class="form-control"
                readonly
              >
            </div>
            
            <div *ngIf="profileData.restaurant" class="form-group">
              <label>المطعم</label>
              <input 
                type="text" 
                [value]="profileData.restaurant.name_ar || profileData.restaurant.name" 
                name="restaurant"
                class="form-control"
                readonly
              >
            </div>
            
            <div class="form-group">
              <label>تاريخ الإنشاء</label>
              <input 
                type="text" 
                [value]="formatDate(profileData.created_at)" 
                name="created_at"
                class="form-control"
                readonly
              >
            </div>
            
            <div *ngIf="profileData.last_login" class="form-group">
              <label>آخر دخول</label>
              <input 
                type="text" 
                [value]="formatDate(profileData.last_login)" 
                name="last_login"
                class="form-control"
                readonly
              >
            </div>
          </div>
        </form>
        
        <div class="profile-actions">
          <button class="edit-btn" disabled>
            تعديل الملف الشخصي (قريباً)
          </button>
          <button *ngIf="isAdmin && profileData.role === 'admin'" 
                  (click)="goToAdminPanel()" 
                  class="admin-btn">
            لوحة الإدارة
          </button>
          <button *ngIf="isAdmin && profileData.role === 'restaurant_admin'" 
                  (click)="goToRestaurantDashboard()" 
                  class="restaurant-btn">
            إدارة المطعم
          </button>
          <button (click)="logout()" class="logout-btn">
            تسجيل خروج
          </button>
        </div>
      </div>
      
      <div *ngIf="!profileData && !error" class="loading">
        جارٍ تحميل الملف الشخصي...
      </div>
      
      <div *ngIf="error" class="error">
        خطأ في تحميل الملف الشخصي: {{ error }}
        <button (click)="loadProfile()" class="retry-btn">إعادة المحاولة</button>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 2rem;
    }
    .profile-container h1 {
      text-align: center;
      color: #333;
      margin-bottom: 2rem;
    }
    .profile-card {
      background: white;
      border-radius: 20px;
      padding: 2rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }
    .profile-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    .profile-avatar {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      color: white;
      margin: 0 auto 1rem;
    }
    .profile-header h2 {
      color: #333;
      margin: 0 0 0.5rem 0;
    }
    .role-badge {
      background: #28a745;
      color: white;
      padding: 0.3rem 0.8rem;
      border-radius: 15px;
      font-size: 0.9rem;
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
      border-radius: 10px;
      font-size: 1rem;
      background: #f8f9fa;
      direction: ltr;
      text-align: left;
    }
    .profile-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
      flex-wrap: wrap;
    }
    .edit-btn,
    .logout-btn,
    .admin-btn,
    .restaurant-btn {
      flex: 1;
      min-width: 140px;
      padding: 1rem;
      border: none;
      border-radius: 10px;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .edit-btn {
      background: #e9ecef;
      color: #6c757d;
      cursor: not-allowed;
    }
    .logout-btn {
      background: #ff4757;
      color: white;
    }
    .logout-btn:hover {
      background: #ff3742;
      transform: translateY(-2px);
    }
    .admin-btn {
      background: #667eea;
      color: white;
    }
    .admin-btn:hover {
      background: #5a67d8;
      transform: translateY(-2px);
    }
    .restaurant-btn {
      background: #28a745;
      color: white;
    }
    .restaurant-btn:hover {
      background: #218838;
      transform: translateY(-2px);
    }
    .loading,
    .error {
      text-align: center;
      padding: 3rem;
      color: #666;
      font-size: 1.2rem;
    }
    .error {
      color: #dc3545;
    }
    .retry-btn {
      margin-top: 1rem;
      padding: 0.5rem 1rem;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
  `]
})
export class ProfileComponent implements OnInit {
  profileData: any = null;
  isAdmin = false;
  error = '';

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('Profile component loaded');
    
    // Direct API call test
    this.apiService.getProfile().subscribe({
      next: (response) => {
        console.log('Direct API Response:', response);
      },
      error: (err) => {
        console.error('Direct API Error:', err);
      }
    });
    
    this.loadProfile();
  }

  loadProfile() {
    this.error = '';
    this.apiService.getProfile().subscribe({
      next: (response) => {
        console.log('Profile Response:', response);
        
        if (response.user) {
          // Regular user
          this.profileData = response.user;
          this.isAdmin = false;
        } else if (response.admin) {
          // Admin user
          this.profileData = response.admin;
          this.isAdmin = true;
        } else {
          this.error = 'لم يتم العثور على بيانات المستخدم';
        }
      },
      error: (err) => {
        console.error('Profile Error:', err);
        this.error = 'فشل في تحميل الملف الشخصي';
      }
    });
  }

  getRoleLabel(): string {
    if (!this.isAdmin) return '';
    
    switch (this.profileData.role) {
      case 'admin':
        return 'مدير عام';
      case 'restaurant_admin':
        return 'مدير مطعم';
      default:
        return this.profileData.role;
    }
  }

  getStatusLabel(): string {
    if (!this.isAdmin) return '';
    
    switch (this.profileData.status) {
      case 'approved':
        return 'مُعتمد';
      case 'pending':
        return 'في الانتظار';
      case 'rejected':
        return 'مرفوض';
      default:
        return this.profileData.status;
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  goToAdminPanel() {
    this.router.navigate(['/admin-panel']);
  }

  goToRestaurantDashboard() {
    this.router.navigate(['/restaurant-dashboard']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}