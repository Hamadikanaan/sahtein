// app/pages/auth/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  styleUrls: ['./login.component.css'],
  template: `
    <div class="auth-container">
      <!-- Animated Background -->
      <div class="bg-gradient"></div>
      <div class="bg-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
      </div>
      
      <!-- Floating Food Icons -->
      <div class="floating-icons">
        <span class="float-icon icon-1">🍽️</span>
        <span class="float-icon icon-2">🥙</span>
        <span class="float-icon icon-3">🍲</span>
        <span class="float-icon icon-4">🥗</span>
        <span class="float-icon icon-5">🍕</span>
        <span class="float-icon icon-6">🧆</span>
      </div>

      <div class="main-content">
        <!-- Logo Section -->
        <div class="brand-section">
          <div class="logo-container">
            <div class="logo-icon">
              <span class="icon-text">صحتين</span>
              <div class="logo-shine"></div>
            </div>
          </div>
          <h1 class="brand-title">مرحباً بعودتك</h1>
          <p class="brand-subtitle">سجل دخولك واستمتع بأشهى الأطباق السورية</p>
        </div>

        <!-- Login Card -->
        <div class="auth-card">
          <div class="card-glow"></div>
          
          <form (ngSubmit)="onSubmit()" #loginForm="ngForm" class="login-form">
            <div class="form-header">
              <h2>تسجيل الدخول</h2>
              <div class="header-decoration"></div>
            </div>

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
                  placeholder="البريد الإلكتروني"
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
                <span>{{ loading ? 'جار تسجيل الدخول...' : 'دخول' }}</span>
              </span>
              <div class="btn-shine"></div>
            </button>

            <!-- Error Message -->
            <div *ngIf="error" class="error-message">
              <div class="error-icon">⚠️</div>
              <span>{{ error }}</span>
            </div>

            <!-- Social Login -->
            <div class="divider">
              <span>أو</span>
            </div>

            <div class="social-buttons">
              <div class="social-btn google">
                <button class="social-btn-real" type="button"></button>
                <div class="button-border">
                  <div class="social-btn-inner">
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Google</span>
                  </div>
                </div>
                <div class="social-backdrop"></div>
                <div class="social-spin social-spin-blur"></div>
                <div class="social-spin social-spin-intense"></div>
                <div class="social-spin social-spin-inside"></div>
              </div>
              
              <div class="social-btn facebook">
                <button class="social-btn-real" type="button"></button>
                <div class="button-border">
                  <div class="social-btn-inner">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877f2">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span>Facebook</span>
                  </div>
                </div>
                <div class="social-backdrop"></div>
                <div class="social-spin social-spin-blur"></div>
                <div class="social-spin social-spin-intense"></div>
                <div class="social-spin social-spin-inside"></div>
              </div>
            </div>
          </form>

          <!-- Register Link -->
          <div class="auth-footer">
            <p>ليس لديك حساب؟</p>
            <a routerLink="/auth-select" class="register-link">
              <span>إنشاء حساب جديد</span>
            </a>
          </div>

          <!-- Restaurant Login Link -->
          <div class="restaurant-link">
            <a routerLink="/restaurant-login" class="restaurant-btn">
              <div class="restaurant-content">
                <span class="restaurant-icon">🏪</span>
                <span>دخول المطاعم</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent implements OnInit {
  credentials = { email: '', password: '' };
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
    // Check if user should be remembered
    const rememberedUser = localStorage.getItem('rememberUser');
    if (rememberedUser) {
      this.credentials.email = rememberedUser;
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

    this.authService.login(this.credentials.email, this.credentials.password).subscribe({
      next: (response) => {
        // Handle remember me
        if (this.rememberMe) {
          localStorage.setItem('rememberUser', this.credentials.email);
        }
        
        this.loading = false;
        this.router.navigate(['/restaurants']);
      },
      error: (err) => {
        this.loading = false;
        
        if (err.status === 401) {
          this.error = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
        } else if (err.status === 429) {
          this.error = 'تم تجاوز عدد المحاولات المسموح. حاول مرة أخرى لاحقاً';
        } else if (err.status === 0) {
          this.error = 'مشكلة في الاتصال. تحقق من الإنترنت';
        } else {
          this.error = 'حدث خطأ غير متوقع. حاول مرة أخرى';
        }
        
        console.error('Login error:', err);
      }
    });
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}