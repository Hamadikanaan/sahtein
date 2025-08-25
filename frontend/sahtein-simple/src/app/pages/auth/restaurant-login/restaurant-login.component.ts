// app/pages/auth/restaurant-login/restaurant-login.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-restaurant-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  styleUrls: ['./restaurant-login.component.css'],
  template: `
    <div class="restaurant-login-container">
      <!-- Animated Background -->
      <div class="bg-gradient"></div>
      <div class="bg-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>
      
      <!-- Floating Restaurant Icons -->
      <div class="floating-icons">
        <span class="float-icon icon-1">🏪</span>
        <span class="float-icon icon-2">🍽️</span>
        <span class="float-icon icon-3">👨‍🍳</span>
        <span class="float-icon icon-4">📊</span>
        <span class="float-icon icon-5">💼</span>
      </div>

      <div class="main-content">
        <!-- Brand Section -->
        <div class="brand-section">
          <div class="logo-container">
            <div class="logo-icon">
              <span class="icon-text">🏪</span>
              <div class="logo-shine"></div>
            </div>
          </div>
          <h1 class="brand-title">لوحة تحكم المطاعم</h1>
          <p class="brand-subtitle">إدارة مطعمك وقائمة الطعام بسهولة ومرونة</p>
          
          <!-- Features List -->
          <div class="features-list">
            <div class="feature-item">
              <span class="feature-icon">📋</span>
              <span>إدارة القوائم والأطباق</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">📊</span>
              <span>تتبع الطلبات والمبيعات</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">⚡</span>
              <span>تحديثات فورية</span>
            </div>
          </div>
        </div>

        <!-- Login Card -->
        <div class="login-card">
          <div class="card-glow"></div>
          
          <div class="card-header">
            <div class="restaurant-header">
              <div class="restaurant-icon-container">
                <div class="restaurant-icon">🏪</div>
                <div class="icon-pulse"></div>
              </div>
              <h2>دخول المطاعم</h2>
              <p>قم بتسجيل الدخول لإدارة مطعمك</p>
            </div>
          </div>

          <form (ngSubmit)="onSubmit()" #loginForm="ngForm" class="login-form">
            
            <!-- Email Field -->
            <div class="form-group">
              <div class="input-container">
                <div class="input-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12.713L.015 3.82A.994.994 0 0 1 1 3h22c.359 0 .688.189.855.51L12 12.713z"/>
                    <path d="M23 6.18L12 15.287L1 6.18V19c0 1.103.897 2 2 2h18c1.103 0 2-.897 2-2V6.18z"/>
                  </svg>
                </div>
                <input 
                  type="email" 
                  [(ngModel)]="credentials.email" 
                  name="email" 
                  required 
                  class="form-input"
                  placeholder="البريد الإلكتروني للمطعم"
                  [class.error]="emailError"
                >
                <div class="input-border"></div>
              </div>
              <div *ngIf="emailError" class="field-error">{{ emailError }}</div>
            </div>

            <!-- Password Field -->
            <div class="form-group">
              <div class="input-container">
                <div class="input-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z"/>
                  </svg>
                </div>
                <input 
                  [type]="showPassword ? 'text' : 'password'"
                  [(ngModel)]="credentials.password" 
                  name="password" 
                  required 
                  class="form-input"
                  placeholder="كلمة المرور"
                  [class.error]="passwordError"
                >
                <button 
                  type="button" 
                  class="password-toggle"
                  (click)="showPassword = !showPassword"
                >
                  <svg *ngIf="!showPassword" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                  <svg *ngIf="showPassword" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                  </svg>
                </button>
                <div class="input-border"></div>
              </div>
              <div *ngIf="passwordError" class="field-error">{{ passwordError }}</div>
            </div>

            <!-- Remember Me -->
            <div class="form-options">
              <label class="checkbox-container">
                <input type="checkbox" [(ngModel)]="rememberMe" name="rememberMe">
                <span class="checkmark"></span>
                <span class="checkbox-text">تذكرني</span>
              </label>
              <a href="#" class="forgot-link">نسيت كلمة المرور؟</a>
            </div>

            <!-- Submit Button -->
            <button 
              type="submit" 
              [disabled]="!loginForm.valid || loading" 
              class="submit-btn"
            >
              <span class="btn-content" [class.loading]="loading">
                <svg *ngIf="loading" class="loading-spinner" width="20" height="20" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.25"/>
                  <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"/>
                </svg>
                <span>{{ loading ? 'جار تسجيل الدخول...' : 'دخول إلى لوحة التحكم' }}</span>
              </span>
              <div class="btn-shine"></div>
            </button>

            <!-- Error Message -->
            <div *ngIf="error" class="error-message">
              <div class="error-icon">⚠️</div>
              <span>{{ error }}</span>
              <button class="error-close" (click)="error = ''">&times;</button>
            </div>
          </form>

          <!-- Auth Links -->
          <div class="auth-links">
            <div class="auth-footer">
              <p>مطعم جديد؟</p>
              <a routerLink="/restaurant-register" class="register-link">
                <span>تقديم طلب انضمام</span>
              </a>
            </div>
            
            <div class="customer-link">
              <a routerLink="/login-select" class="customer-btn">
                <div class="customer-content">
                  <span class="customer-icon">👤</span>
                  <span>دخول العملاء</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RestaurantLoginComponent implements OnInit {
  credentials = { 
    email: '', 
    password: '' 
  };
  loading = false;
  error = '';
  emailError = '';
  passwordError = '';
  showPassword = false;
  rememberMe = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Check if restaurant should be remembered
    const rememberedRestaurant = localStorage.getItem('rememberRestaurant');
    if (rememberedRestaurant) {
      this.credentials.email = rememberedRestaurant;
      this.rememberMe = true;
    }
  }

  onSubmit() {
    // Reset errors
    this.emailError = '';
    this.passwordError = '';
    this.error = '';

    // Validate form
    if (!this.credentials.email) {
      this.emailError = 'البريد الإلكتروني مطلوب';
      return;
    }

    if (!this.validateEmail(this.credentials.email)) {
      this.emailError = 'صيغة البريد الإلكتروني غير صحيحة';
      return;
    }

    if (!this.credentials.password) {
      this.passwordError = 'كلمة المرور مطلوبة';
      return;
    }

    if (this.credentials.password.length < 6) {
      this.passwordError = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
      return;
    }

    this.loading = true;

    // TODO: Separate Restaurant Auth Service
    // For now, use regular login but redirect to restaurant dashboard
    this.authService.login(this.credentials.email, this.credentials.password).subscribe({
      next: (response) => {
        // Handle remember me
        if (this.rememberMe) {
          localStorage.setItem('rememberRestaurant', this.credentials.email);
        }
        
        this.loading = false;
        this.router.navigate(['/restaurant-dashboard']);
      },
      error: (err) => {
        this.loading = false;
        
        if (err.status === 401) {
          this.error = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
        } else if (err.status === 403) {
          this.error = 'حساب المطعم غير مفعل. تحقق من تأكيد الحساب';
        } else if (err.status === 429) {
          this.error = 'تم تجاوز عدد المحاولات المسموح. حاول مرة أخرى لاحقاً';
        } else if (err.status === 0) {
          this.error = 'مشكلة في الاتصال. تحقق من الإنترنت';
        } else {
          this.error = 'فشل في تسجيل الدخول. حاول مرة أخرى';
        }
        
        console.error('Restaurant login error:', err);
      }
    });
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}