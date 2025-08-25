// app/pages/auth/login-select/login-select.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-login-select',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styleUrls: ['./login-select.component.css'],
  template: `
    <div class="login-select-container">
      <!-- Animated Background -->
      <div class="bg-gradient"></div>
      <div class="bg-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
      </div>
      
      <!-- Floating Icons -->
      <div class="floating-icons">
        <span class="float-icon icon-1">🍽️</span>
        <span class="float-icon icon-2">🏪</span>
        <span class="float-icon icon-3">👨‍💼</span>
        <span class="float-icon icon-4">🥙</span>
        <span class="float-icon icon-5">📊</span>
      </div>

      <div class="main-content">
        <!-- Header Section -->
        <div class="header-section">
          <div class="logo-container">
            <div class="logo-icon">
              <span class="icon-text">صحتين</span>
              <div class="logo-shine"></div>
            </div>
          </div>
          <h1 class="main-title">مرحباً بك في صحتين</h1>
          <p class="main-subtitle">اختر نوع حسابك لتسجيل الدخول</p>
        </div>

        <!-- Selection Card -->
        <div class="selection-card">
          <div class="card-glow"></div>
          
          <div class="card-header">
            <h2>تسجيل الدخول</h2>
            <div class="header-decoration"></div>
          </div>

          <!-- Login Options -->
          <div class="login-options">
            <!-- Customer Login -->
            <div class="login-option customer-option" routerLink="/login">
              <div class="option-background"></div>
              <div class="option-content">
                <div class="option-icon customer-icon">
                  <div class="icon-inner">👤</div>
                  <div class="icon-glow"></div>
                </div>
                <div class="option-info">
                  <h3>دخول العملاء</h3>
                  <p>للعملاء الذين يريدون طلب الطعام</p>
                  <div class="feature-tags">
                    <span class="feature-tag">تصفح المطاعم</span>
                    <span class="feature-tag">طلب الطعام</span>
                    <span class="feature-tag">تتبع الطلبات</span>
                  </div>
                </div>
                <div class="option-arrow">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12l-4.58 4.59z"/>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Restaurant Login -->
            <div class="login-option restaurant-option" routerLink="/restaurant-login">
              <div class="option-background"></div>
              <div class="option-content">
                <div class="option-icon restaurant-icon">
                  <div class="icon-inner">🏪</div>
                  <div class="icon-glow"></div>
                </div>
                <div class="option-info">
                  <h3>دخول المطاعم</h3>
                  <p>لأصحاب المطاعم المسجلين</p>
                  <div class="feature-tags">
                    <span class="feature-tag">إدارة القائمة</span>
                    <span class="feature-tag">متابعة الطلبات</span>
                    <span class="feature-tag">الإحصائيات</span>
                  </div>
                </div>
                <div class="option-arrow">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12l-4.58 4.59z"/>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Admin Login -->
            <div class="login-option admin-option" routerLink="/admin-login">
              <div class="option-background"></div>
              <div class="option-content">
                <div class="option-icon admin-icon">
                  <div class="icon-inner">👨‍💼</div>
                  <div class="icon-glow"></div>
                </div>
                <div class="option-info">
                  <h3>دخول الإدارة</h3>
                  <p>للمشرفين والإداريين فقط</p>
                  <div class="feature-tags">
                    <span class="feature-tag">إدارة النظام</span>
                    <span class="feature-tag">مراجعة الطلبات</span>
                    <span class="feature-tag">التقارير</span>
                  </div>
                </div>
                <div class="option-arrow">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12l-4.58 4.59z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Demo Login -->
          <div class="demo-section">
            <h4>🚀 دخول سريع للتجربة</h4>
            <div class="demo-cards">
              <div class="demo-card customer-demo" (click)="quickLogin('customer')">
                <div class="demo-icon">👤</div>
                <div class="demo-content">
                  <div class="demo-title">عميل تجريبي</div>
                  <div class="demo-email">test@sahtein.com</div>
                  <div class="demo-password">password123</div>
                </div>
                <div class="demo-action">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>

              <div class="demo-card restaurant-demo" (click)="quickLogin('restaurant')">
                <div class="demo-icon">🏪</div>
                <div class="demo-content">
                  <div class="demo-title">مطعم تجريبي</div>
                  <div class="demo-email">restaurant@sahtein.com</div>
                  <div class="demo-password">restaurant123</div>
                </div>
                <div class="demo-action">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>

              <div class="demo-card admin-demo" (click)="quickLogin('admin')">
                <div class="demo-icon">👨‍💼</div>
                <div class="demo-content">
                  <div class="demo-title">إدارة تجريبية</div>
                  <div class="demo-email">admin@sahtein.com</div>
                  <div class="demo-password">admin123</div>
                </div>
                <div class="demo-action">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Register Link -->
          <div class="register-section">
            <div class="divider">
              <span>ليس لديك حساب؟</span>
            </div>
            <a routerLink="/auth-select" class="register-btn">
              <div class="register-content">
                <span class="register-icon">✨</span>
                <span>إنشاء حساب جديد</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginSelectComponent {
  
  constructor(private router: Router) {}

  quickLogin(type: 'customer' | 'restaurant' | 'admin') {
    const demoCard = document.querySelector(`.${type}-demo`) as HTMLElement;
    
    if (demoCard) {
      // Add loading state
      demoCard.classList.add('loading');
      
      setTimeout(() => {
        demoCard.classList.remove('loading');
        demoCard.classList.add('success');
        
        // Navigate after success animation
        setTimeout(() => {
          switch(type) {
            case 'customer':
              this.router.navigate(['/login'], { 
                queryParams: { 
                  email: 'test@sahtein.com',
                  password: 'password123',
                  quick: 'true'
                }
              });
              break;
              
            case 'restaurant':
              this.router.navigate(['/restaurant-login'], { 
                queryParams: { 
                  email: 'restaurant@sahtein.com',
                  password: 'restaurant123',
                  quick: 'true'
                }
              });
              break;
              
            case 'admin':
              this.router.navigate(['/admin-login'], { 
                queryParams: { 
                  email: 'admin@sahtein.com',
                  password: 'admin123',
                  quick: 'true'
                }
              });
              break;
          }
        }, 500);
      }, 1000);
    }
  }

  // Add method to handle keyboard navigation
  onKeyDown(event: KeyboardEvent, action: () => void) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  }
}