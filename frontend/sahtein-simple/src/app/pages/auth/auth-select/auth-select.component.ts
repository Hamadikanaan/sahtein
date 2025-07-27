// app/pages/auth/auth-select/auth-select.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-auth-select',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="auth-select-container">
      <div class="selection-card">
        <div class="header">
          <h1>🍕 إنشاء حساب جديد</h1>
          <p>اختر نوع الحساب المناسب لك</p>
        </div>

        <div class="account-options">
          <!-- Customer Account -->
          <div class="account-option customer-option" routerLink="/register">
            <div class="option-icon customer-icon">👤</div>
            <div class="option-content">
              <h3>حساب عميل</h3>
              <p>للأشخاص الذين يريدون طلب الطعام</p>
              <div class="features">
                <div class="feature-item">
                  <span class="feature-icon">🍽️</span>
                  <span>طلب الطعام من المطاعم</span>
                </div>
                <div class="feature-item">
                  <span class="feature-icon">🚚</span>
                  <span>تتبع حالة التوصيل</span>
                </div>
                <div class="feature-item">
                  <span class="feature-icon">⭐</span>
                  <span>تقييم المطاعم والأطباق</span>
                </div>
                <div class="feature-item">
                  <span class="feature-icon">💰</span>
                  <span>دفع نقدي عند الاستلام</span>
                </div>
              </div>
            </div>
            <div class="option-cta">
              <div class="cta-text">إنشاء حساب عميل</div>
              <div class="cta-arrow">←</div>
            </div>
          </div>

          <!-- Restaurant Account -->
          <div class="account-option restaurant-option" routerLink="/restaurant-register">
            <div class="option-icon restaurant-icon">🏪</div>
            <div class="option-content">
              <h3>حساب مطعم</h3>
              <p>لأصحاب المطاعم الذين يريدون توصيل أطباقهم</p>
              <div class="features">
                <div class="feature-item">
                  <span class="feature-icon">📋</span>
                  <span>إدارة قائمة الطعام</span>
                </div>
                <div class="feature-item">
                  <span class="feature-icon">📦</span>
                  <span>استقبال ومتابعة الطلبات</span>
                </div>
                <div class="feature-item">
                  <span class="feature-icon">📊</span>
                  <span>تقارير المبيعات</span>
                </div>
                <div class="feature-item">
                  <span class="feature-icon">💻</span>
                  <span>لوحة تحكم سهلة</span>
                </div>
              </div>
            </div>
            <div class="option-cta restaurant-cta">
              <div class="cta-text">انضم كمطعم</div>
              <div class="cta-arrow">←</div>
            </div>
          </div>
        </div>

        <!-- Benefits Section -->
        <div class="benefits">
          <h4>🎯 لماذا تختار صحتين؟</h4>
          <div class="benefits-grid">
            <div class="benefit-item">
              <span class="benefit-icon">🇸🇾</span>
              <span>خدمة سورية 100%</span>
            </div>
            <div class="benefit-item">
              <span class="benefit-icon">🆓</span>
              <span>التسجيل مجاني</span>
            </div>
            <div class="benefit-item">
              <span class="benefit-icon">🔒</span>
              <span>آمن وموثوق</span>
            </div>
            <div class="benefit-item">
              <span class="benefit-icon">📱</span>
              <span>سهل الاستخدام</span>
            </div>
          </div>
        </div>

        <div class="login-link">
          <p>لديك حساب بالفعل؟ <a routerLink="/login-select">تسجيل دخول</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-select-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #2d8a3e, #4caf50);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }
    .selection-card {
      background: white;
      border-radius: 20px;
      padding: 2rem;
      box-shadow: 0 25px 60px rgba(0,0,0,0.2);
      width: 100%;
      max-width: 900px;
      text-align: center;
    }
    .header {
      margin-bottom: 2.5rem;
    }
    .header h1 {
      color: #2d8a3e;
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    .header p {
      color: #666;
      font-size: 1.1rem;
    }
    
    .account-options {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
    }
    .account-option {
      background: #ffffff;
      border: 2px solid #e8f5e8;
      border-radius: 15px;
      padding: 2rem;
      transition: all 0.3s ease;
      cursor: pointer;
      text-decoration: none;
      color: inherit;
      position: relative;
      overflow: hidden;
    }
    .account-option:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 40px rgba(45, 138, 62, 0.2);
      border-color: #2d8a3e;
    }
    .customer-option:hover {
      background: linear-gradient(135deg, #f8fffe, #e8f5e8);
    }
    .restaurant-option {
      background: linear-gradient(135deg, #fefff8, #ffffff);
      border-color: #ff9800;
    }
    .restaurant-option:hover {
      background: linear-gradient(135deg, #fff8e1, #fef5e7);
      border-color: #f57c00;
    }
    
    .option-icon {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      margin: 0 auto 1.5rem;
    }
    .customer-icon {
      background: linear-gradient(135deg, #667eea, #764ba2);
    }
    .restaurant-icon {
      background: linear-gradient(135deg, #ffa726, #ff9800);
    }
    
    .option-content h3 {
      color: #2d8a3e;
      margin-bottom: 0.5rem;
      font-size: 1.4rem;
    }
    .restaurant-option h3 {
      color: #f57c00;
    }
    .option-content > p {
      color: #666;
      margin-bottom: 1.5rem;
      line-height: 1.5;
    }
    
    .features {
      text-align: right;
      margin-bottom: 2rem;
    }
    .feature-item {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      margin-bottom: 0.8rem;
      font-size: 0.9rem;
      justify-content: flex-end;
    }
    .feature-icon {
      font-size: 1.1rem;
    }
    
    .option-cta {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      background: #2d8a3e;
      color: white;
      padding: 1rem;
      border-radius: 10px;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    .restaurant-cta {
      background: #ff9800;
    }
    .option-cta:hover {
      transform: scale(1.02);
    }
    .cta-arrow {
      font-size: 1.2rem;
      font-weight: bold;
    }
    
    /* Benefits Section */
    .benefits {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 12px;
      margin-bottom: 2rem;
    }
    .benefits h4 {
      color: #2d8a3e;
      margin-bottom: 1rem;
      font-size: 1.2rem;
    }
    .benefits-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }
    .benefit-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      color: #666;
      justify-content: center;
    }
    .benefit-icon {
      font-size: 1.2rem;
    }
    
    .login-link {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #eee;
    }
    .login-link p {
      color: #666;
    }
    .login-link a {
      color: #2d8a3e;
      text-decoration: none;
      font-weight: 500;
    }
    .login-link a:hover {
      text-decoration: underline;
    }
    
    /* Mobile Optimization */
    @media (max-width: 768px) {
      .selection-card {
        padding: 1.5rem;
        margin: 1rem;
      }
      .header h1 {
        font-size: 1.5rem;
      }
      .account-options {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
      .option-icon {
        width: 60px;
        height: 60px;
        font-size: 2rem;
      }
      .benefits-grid {
        grid-template-columns: 1fr;
      }
    }
    
    @media (max-width: 480px) {
      .auth-select-container {
        padding: 0.5rem;
      }
      .selection-card {
        padding: 1rem;
      }
      .header h1 {
        font-size: 1.3rem;
      }
      .account-option {
        padding: 1.5rem;
      }
      .feature-item {
        font-size: 0.8rem;
      }
    }
  `]
})
export class AuthSelectComponent {
  
  constructor() {}
}