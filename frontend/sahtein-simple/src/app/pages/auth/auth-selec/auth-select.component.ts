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
          <h1>🍕 مرحباً بك في صحتين</h1>
          <p>اختر نوع الحساب الذي تريد إنشاؤه</p>
        </div>

        <div class="account-options">
          <!-- Customer Account -->
          <div class="account-option" routerLink="/register">
            <div class="option-icon customer-icon">👤</div>
            <div class="option-content">
              <h3>حساب عميل</h3>
              <p>للطلب من المطاعم المختلفة</p>
              <ul class="features-list">
                <li>✅ تصفح المطاعم</li>
                <li>✅ طلب الطعام</li>
                <li>✅ تتبع الطلبات</li>
                <li>✅ تقييم المطاعم</li>
              </ul>
            </div>
            <div class="option-arrow">←</div>
          </div>

          <!-- Restaurant Account -->
          <div class="account-option" routerLink="/restaurant-register">
            <div class="option-icon restaurant-icon">🏪</div>
            <div class="option-content">
              <h3>حساب مطعم</h3>
              <p>لإدارة مطعمك والحصول على طلبات</p>
              <ul class="features-list">
                <li>✅ إدارة القائمة</li>
                <li>✅ استقبال الطلبات</li>
                <li>✅ متابعة الإحصائيات</li>
                <li>✅ إدارة المخزون</li>
              </ul>
            </div>
            <div class="option-arrow">←</div>
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
      max-width: 600px;
      text-align: center;
    }
    .header {
      margin-bottom: 3rem;
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
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .account-option {
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: 1.5rem;
      align-items: center;
      padding: 2rem;
      border: 3px solid #e8f5e8;
      border-radius: 15px;
      transition: all 0.3s ease;
      cursor: pointer;
      text-decoration: none;
      color: inherit;
      text-align: right;
    }
    .account-option:hover {
      border-color: #2d8a3e;
      transform: translateY(-3px);
      box-shadow: 0 10px 30px rgba(45, 138, 62, 0.2);
    }
    .option-icon {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
    }
    .customer-icon {
      background: linear-gradient(135deg, #667eea, #764ba2);
    }
    .restaurant-icon {
      background: linear-gradient(135deg, #f093fb, #f5576c);
    }
    .option-content h3 {
      color: #2d8a3e;
      margin-bottom: 0.5rem;
      font-size: 1.4rem;
    }
    .option-content p {
      color: #666;
      margin-bottom: 1rem;
    }
    .features-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .features-list li {
      padding: 0.3rem 0;
      color: #555;
      font-size: 0.9rem;
    }
    .option-arrow {
      font-size: 1.5rem;
      color: #2d8a3e;
      font-weight: bold;
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
      .account-option {
        grid-template-columns: 1fr;
        gap: 1rem;
        text-align: center;
        padding: 1.5rem;
      }
      .option-icon {
        width: 60px;
        height: 60px;
        font-size: 2rem;
        margin: 0 auto;
      }
      .option-arrow {
        display: none;
      }
      .features-list {
        text-align: center;
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
      .header p {
        font-size: 1rem;
      }
      .account-option {
        padding: 1rem;
      }
      .option-content h3 {
        font-size: 1.2rem;
      }
    }
  `]
})
export class AuthSelectComponent {}