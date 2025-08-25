// app/pages/auth/register/register.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  styleUrls: ['./register.component.css'],
  template: `
    <div class="register-container">
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
        <span class="float-icon icon-5">🧆</span>
        <span class="float-icon icon-6">🍕</span>
      </div>

      <div class="main-content">
        <!-- Welcome Section -->
        <div class="welcome-section">
          <div class="logo-container">
            <div class="logo-icon">
              <span class="icon-text">صحتين</span>
              <div class="logo-shine"></div>
            </div>
          </div>
          <h1 class="welcome-title">انضم إلى عائلة صحتين</h1>
          <p class="welcome-subtitle">اكتشف أشهى المأكولات السورية واستمتع بتجربة طعام لا تُنسى</p>
        </div>

        <!-- Register Card -->
        <div class="register-card">
          <div class="card-glow"></div>
          
          <div class="card-header">
            <div class="welcome-icon">
              <div class="icon-container">
                <span class="main-icon">👋</span>
                <div class="icon-ripple"></div>
              </div>
            </div>
            <h2>إنشاء حساب جديد</h2>
            <p>املأ البيانات التالية لإنشاء حسابك</p>
          </div>

          <form (ngSubmit)="onSubmit()" #registerForm="ngForm" class="register-form">
            
            <!-- Name Field -->
            <div class="form-group">
              <div class="input-container">
                <div class="input-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <input 
                  type="text" 
                  [(ngModel)]="userData.name" 
                  name="name" 
                  required 
                  class="form-input"
                  placeholder="الاسم الكامل"
                  [class.error]="nameError"
                  (blur)="validateName()"
                >
                <div class="input-border"></div>
              </div>
              <div *ngIf="nameError" class="field-error">{{ nameError }}</div>
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
                  [(ngModel)]="userData.email" 
                  name="email" 
                  required 
                  class="form-input"
                  placeholder="البريد الإلكتروني"
                  [class.error]="emailError"
                  (blur)="validateEmail()"
                >
                <div class="input-border"></div>
              </div>
              <div *ngIf="emailError" class="field-error">{{ emailError }}</div>
            </div>

            <!-- Phone Field -->
            <div class="form-group">
              <div class="input-container">
                <div class="input-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                </div>
                <input 
                  type="tel" 
                  [(ngModel)]="userData.phone" 
                  name="phone" 
                  required 
                  class="form-input"
                  placeholder="رقم الهاتف (+963xxxxxxxxx)"
                  [class.error]="phoneError"
                  (blur)="validatePhone()"
                >
                <div class="input-border"></div>
              </div>
              <div *ngIf="phoneError" class="field-error">{{ phoneError }}</div>
            </div>

            <!-- Address Field -->
            <div class="form-group">
              <div class="input-container">
                <div class="input-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <input 
                  type="text" 
                  [(ngModel)]="userData.address" 
                  name="address" 
                  required 
                  class="form-input"
                  placeholder="العنوان (باب توما، دمشق)"
                  [class.error]="addressError"
                  (blur)="validateAddress()"
                >
                <div class="input-border"></div>
              </div>
              <div *ngIf="addressError" class="field-error">{{ addressError }}</div>
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
                  [(ngModel)]="userData.password" 
                  name="password" 
                  required 
                  minlength="6"
                  class="form-input"
                  placeholder="كلمة المرور (6 أحرف على الأقل)"
                  [class.error]="passwordError"
                  (blur)="validatePassword()"
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

            <!-- Submit Button -->
            <button 
              type="submit" 
              [disabled]="!registerForm.valid || loading" 
              class="submit-btn"
            >
              <span class="btn-content" [class.loading]="loading">
                <svg *ngIf="loading" class="loading-spinner" width="20" height="20" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.25"/>
                  <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"/>
                </svg>
                <span>{{ loading ? 'جار إنشاء الحساب...' : 'إنشاء الحساب' }}</span>
              </span>
              <div class="btn-shine"></div>
            </button>

            <!-- Error Message -->
            <div *ngIf="error" class="error-message">
              <div class="error-icon">⚠️</div>
              <span>{{ error }}</span>
              <button class="error-close" (click)="error = ''">&times;</button>
            </div>

            <!-- Divider -->
            <div class="divider">
              <span>أو</span>
            </div>

            <!-- Social Buttons -->
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

          <!-- Login Link -->
          <div class="auth-footer">
            <p>لديك حساب بالفعل؟</p>
            <a routerLink="/login-select" class="login-link">
              <span>تسجيل الدخول</span>
            </a>
          </div>

          <!-- Restaurant Registration Link -->
          <div class="restaurant-link">
            <a routerLink="/restaurant-register" class="restaurant-btn">
              <div class="restaurant-content">
                <span class="restaurant-icon">🏪</span>
                <span>تسجيل مطعم جديد</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  userData = {
    name: '',
    email: '',
    phone: '',
    address: '',
    password: ''
  };
  loading = false;
  error = '';
  nameError = '';
  emailError = '';
  phoneError = '';
  addressError = '';
  passwordError = '';
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    // Reset errors
    this.nameError = '';
    this.emailError = '';
    this.phoneError = '';
    this.addressError = '';
    this.passwordError = '';
    this.error = '';

    // Validate all fields
    let isValid = true;

    if (!this.userData.name.trim()) {
      this.nameError = 'الاسم الكامل مطلوب';
      isValid = false;
    }

    if (!this.userData.email) {
      this.emailError = 'البريد الإلكتروني مطلوب';
      isValid = false;
    } else if (!this.isValidEmail(this.userData.email)) {
      this.emailError = 'صيغة البريد الإلكتروني غير صحيحة';
      isValid = false;
    }

    if (!this.userData.phone) {
      this.phoneError = 'رقم الهاتف مطلوب';
      isValid = false;
    } else if (!this.isValidPhone(this.userData.phone)) {
      this.phoneError = 'رقم الهاتف غير صحيح (مثال: +963911234567)';
      isValid = false;
    }

    if (!this.userData.address.trim()) {
      this.addressError = 'العنوان مطلوب';
      isValid = false;
    }

    if (this.userData.password.length < 6) {
      this.passwordError = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
      isValid = false;
    }

    if (!isValid) return;

    this.loading = true;

    this.authService.register(this.userData).subscribe({
      next: (response) => {
        this.loading = false;
        this.router.navigate(['/restaurants']);
      },
      error: (err) => {
        this.loading = false;
        
        if (err.status === 409) {
          this.error = 'البريد الإلكتروني مستخدم بالفعل';
        } else if (err.status === 400) {
          this.error = 'البيانات المدخلة غير صحيحة';
        } else if (err.status === 0) {
          this.error = 'مشكلة في الاتصال. تحقق من الإنترنت';
        } else {
          this.error = 'حدث خطأ غير متوقع. حاول مرة أخرى';
        }
      }
    });
  }

  validateName() {
    if (!this.userData.name.trim()) {
      this.nameError = 'الاسم الكامل مطلوب';
    } else if (this.userData.name.trim().length < 2) {
      this.nameError = 'الاسم يجب أن يكون حرفين على الأقل';
    } else {
      this.nameError = '';
    }
  }

  validateEmail() {
    if (!this.userData.email) {
      this.emailError = 'البريد الإلكتروني مطلوب';
    } else if (!this.isValidEmail(this.userData.email)) {
      this.emailError = 'صيغة البريد الإلكتروني غير صحيحة';
    } else {
      this.emailError = '';
    }
  }

  validatePhone() {
    if (!this.userData.phone) {
      this.phoneError = 'رقم الهاتف مطلوب';
    } else if (!this.isValidPhone(this.userData.phone)) {
      this.phoneError = 'رقم الهاتف غير صحيح (مثال: +963911234567)';
    } else {
      this.phoneError = '';
    }
  }

  validateAddress() {
    if (!this.userData.address.trim()) {
      this.addressError = 'العنوان مطلوب';
    } else if (this.userData.address.trim().length < 5) {
      this.addressError = 'العنوان قصير جداً';
    } else {
      this.addressError = '';
    }
  }

  validatePassword() {
    if (!this.userData.password) {
      this.passwordError = 'كلمة المرور مطلوبة';
    } else if (this.userData.password.length < 6) {
      this.passwordError = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    } else {
      this.passwordError = '';
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+963[0-9]{9}$/;
    return phoneRegex.test(phone);
  }
}