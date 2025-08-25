// app/pages/auth/auth-select/auth-select.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-auth-select',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styleUrls: ['./auth-select.component.css'],
  template: `
    <div class="auth-select-container">
      <!-- Animated Background -->
      <div class="bg-gradient"></div>
      <div class="bg-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
        <div class="shape shape-5"></div>
      </div>
      
      <!-- Floating Icons -->
      <div class="floating-icons">
        <span class="float-icon icon-1">🍽️</span>
        <span class="float-icon icon-2">🏪</span>
        <span class="float-icon icon-3">👤</span>
        <span class="float-icon icon-4">🥙</span>
        <span class="float-icon icon-5">📊</span>
        <span class="float-icon icon-6">⭐</span>
        <span class="float-icon icon-7">💰</span>
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
          <h1 class="main-title">انضم إلى عائلة صحتين</h1>
          <p class="main-subtitle">اختر نوع الحساب المناسب لك واستمتع بأفضل تجربة طعام</p>
        </div>

        <!-- Selection Card -->
        <div class="selection-card">
          <div class="card-glow"></div>
          
          <div class="card-header">
            <h2>إنشاء حساب جديد</h2>
            <div class="header-decoration"></div>
            <p class="header-subtitle">اختر الخيار المناسب لك</p>
          </div>

          <!-- Account Options -->
          <div class="account-options">
            
            <!-- Customer Account -->
            <div class="account-option customer-option" routerLink="/register" (click)="onOptionClick('customer')">
              <div class="option-background"></div>
              <div class="option-content">
                <div class="option-header">
                  <div class="option-icon customer-icon">
                    <div class="icon-inner">👤</div>
                    <div class="icon-glow"></div>
                  </div>
                  <div class="option-info">
                    <h3>حساب عميل</h3>
                    <p>للأشخاص الذين يريدون طلب الطعام</p>
                  </div>
                </div>

                <div class="features-list">
                  <div class="feature-item">
                    <div class="feature-icon">🍽️</div>
                    <div class="feature-text">
                      <strong>طلب الطعام</strong>
                      <span>من أشهى المطاعم السورية</span>
                    </div>
                  </div>
                  <div class="feature-item">
                    <div class="feature-icon">🚚</div>
                    <div class="feature-text">
                      <strong>تتبع التوصيل</strong>
                      <span>متابعة حالة طلبك لحظة بلحظة</span>
                    </div>
                  </div>
                  <div class="feature-item">
                    <div class="feature-icon">⭐</div>
                    <div class="feature-text">
                      <strong>التقييمات</strong>
                      <span>قيم المطاعم والأطباق</span>
                    </div>
                  </div>
                  <div class="feature-item">
                    <div class="feature-icon">💰</div>
                    <div class="feature-text">
                      <strong>دفع مرن</strong>
                      <span>نقدي أو بالبطاقة</span>
                    </div>
                  </div>
                </div>

                <div class="option-cta customer-cta">
                  <span class="cta-text">إنشاء حساب عميل</span>
                  <div class="cta-arrow">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12l-4.58 4.59z"/>
                    </svg>
                  </div>
                  <div class="cta-shine"></div>
                </div>
              </div>
            </div>

            <!-- Restaurant Account -->
            <div class="account-option restaurant-option" routerLink="/restaurant-register" (click)="onOptionClick('restaurant')">
              <div class="option-background"></div>
              <div class="option-content">
                <div class="option-header">
                  <div class="option-icon restaurant-icon">
                    <div class="icon-inner">🏪</div>
                    <div class="icon-glow"></div>
                  </div>
                  <div class="option-info">
                    <h3>حساب مطعم</h3>
                    <p>لأصحاب المطاعم الذين يريدون توصيل أطباقهم</p>
                  </div>
                </div>

                <div class="features-list">
                  <div class="feature-item">
                    <div class="feature-icon">📋</div>
                    <div class="feature-text">
                      <strong>إدارة القائمة</strong>
                      <span>أضف وعدل أطباقك بسهولة</span>
                    </div>
                  </div>
                  <div class="feature-item">
                    <div class="feature-icon">📦</div>
                    <div class="feature-text">
                      <strong>استقبال الطلبات</strong>
                      <span>متابعة وإدارة الطلبات</span>
                    </div>
                  </div>
                  <div class="feature-item">
                    <div class="feature-icon">📊</div>
                    <div class="feature-text">
                      <strong>تقارير المبيعات</strong>
                      <span>إحصائيات مفصلة ومربحة</span>
                    </div>
                  </div>
                  <div class="feature-item">
                    <div class="feature-icon">💻</div>
                    <div class="feature-text">
                      <strong>لوحة تحكم</strong>
                      <span>واجهة سهلة ومتطورة</span>
                    </div>
                  </div>
                </div>

                <div class="option-cta restaurant-cta">
                  <span class="cta-text">انضم كمطعم شريك</span>
                  <div class="cta-arrow">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12l-4.58 4.59z"/>
                    </svg>
                  </div>
                  <div class="cta-shine"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Benefits Section -->
          <div class="benefits-section">
            <h4>🎯 لماذا تختار صحتين؟</h4>
            <div class="benefits-grid">
              <div class="benefit-item">
                <div class="benefit-icon">🇸🇾</div>
                <div class="benefit-content">
                  <strong>خدمة سورية</strong>
                  <span>100% محلية</span>
                </div>
              </div>
              <div class="benefit-item">
                <div class="benefit-icon">🆓</div>
                <div class="benefit-content">
                  <strong>التسجيل مجاني</strong>
                  <span>بدون رسوم خفية</span>
                </div>
              </div>
              <div class="benefit-item">
                <div class="benefit-icon">🔒</div>
                <div class="benefit-content">
                  <strong>آمن وموثوق</strong>
                  <span>حماية بيانات متقدمة</span>
                </div>
              </div>
              <div class="benefit-item">
                <div class="benefit-icon">📱</div>
                <div class="benefit-content">
                  <strong>سهل الاستخدام</strong>
                  <span>تصميم بديهي</span>
                </div>
              </div>
              <div class="benefit-item">
                <div class="benefit-icon">⚡</div>
                <div class="benefit-content">
                  <strong>سرعة التوصيل</strong>
                  <span>خدمة سريعة</span>
                </div>
              </div>
              <div class="benefit-item">
                <div class="benefit-icon">🎁</div>
                <div class="benefit-content">
                  <strong>عروض حصرية</strong>
                  <span>خصومات مستمرة</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Statistics Section -->
          <div class="stats-section">
            <div class="stat-item">
              <div class="stat-number">25+</div>
              <div class="stat-label">مدينة سورية</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">100+</div>
              <div class="stat-label">مطعم شريك</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">500+</div>
              <div class="stat-label">طبق متنوع</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">24/7</div>
              <div class="stat-label">خدمة مستمرة</div>
            </div>
          </div>

          <!-- Login Link -->
          <div class="login-section">
            <div class="divider">
              <span>لديك حساب بالفعل؟</span>
            </div>
            <a routerLink="/login-select" class="login-btn">
              <div class="login-content">
                <span class="login-icon">🔓</span>
                <span>تسجيل الدخول</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AuthSelectComponent {
  
  constructor() {}

  // Handle option selection feedback
  onOptionClick(optionType: 'customer' | 'restaurant') {
    const option = document.querySelector(`.${optionType}-option`) as HTMLElement;
    
    if (option) {
      option.classList.add('selected');
      
      // Add loading state briefly
      setTimeout(() => {
        option.classList.add('loading');
      }, 100);
    }
  }

  // Keyboard navigation support
  onKeyDown(event: KeyboardEvent, action: () => void) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  }
}