// app/pages/auth/login-select/login-select.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login-select',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="login-select-container">
      <div class="selection-card">
        <div class="header">
          <h1>🍕 تسجيل الدخول</h1>
          <p>اختر نوع الحساب للدخول</p>
        </div>

        <div class="login-options">
          <!-- Customer Login -->
          <div class="login-option" routerLink="/login">
            <div class="option-icon customer-icon">👤</div>
            <div class="option-content">
              <h3>دخول العملاء</h3>
              <p>للعملاء الذين يريدون طلب الطعام</p>
              <div class="login-features">
                <span class="feature-tag">تصفح المطاعم</span>
                <span class="feature-tag">طلب الطعام</span>
              </div>
            </div>
            <div class="option-arrow">←</div>
          </div>

          <!-- Restaurant Login -->
          <div class="login-option" routerLink="/restaurant-login">
            <div class="option-icon restaurant-icon">🏪</div>
            <div class="option-content">
              <h3>دخول المطاعم</h3>
              <p>لأصحاب المطاعم المسجلين</p>
              <div class="login-features">
                <span class="feature-tag">إدارة القائمة</span>
                <span class="feature-tag">متابعة الطلبات</span>
              </div>
            </div>
            <div class="option-arrow">←</div>
          </div>

          <!-- Admin Login -->
          <div class="login-option admin-option" routerLink="/admin-login">
            <div class="option-icon admin-icon">👨‍💼</div>
            <div class="option-content">
              <h3>دخول الإدارة</h3>
              <p>للمشرفين والإداريين</p>
              <div class="login-features">
                <span class="feature-tag">إدارة النظام</span>
                <span class="feature-tag">مراجعة الطلبات</span>
              </div>
            </div>
            <div class="option-arrow">←</div>
          </div>
        </div>

        <!-- Quick Login Cards -->
        <div class="quick-login">
          <h4>دخول سريع للتجربة:</h4>
          <div class="demo-accounts">
            <div class="demo-card" (click)="quickLogin('customer')">
              <div class="demo-icon">👤</div>
              <div class="demo-info">
                <strong>عميل تجريبي</strong>
                <small>test@sahtein.com</small>
              </div>
            </div>
            <div class="demo-card" (click)="quickLogin('restaurant')">
              <div class="demo-icon">🏪</div>
              <div class="demo-info">
                <strong>مطعم تجريبي</strong>
                <small>restaurant@sahtein.com</small>
              </div>
            </div>
          </div>
        </div>

        <div class="register-link">
          <p>ليس لديك حساب؟ <a routerLink="/auth-select">إنشاء حساب جديد</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-select-container {
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
      max-width: 650px;
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
    .login-options {
      display: grid;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .login-option {
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: 1.5rem;
      align-items: center;
      padding: 1.5rem;
      border: 2px solid #e8f5e8;
      border-radius: 12px;
      transition: all 0.3s ease;
      cursor: pointer;
      text-decoration: none;
      color: inherit;
      text-align: right;
    }
    .login-option:hover {
      border-color: #2d8a3e;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(45, 138, 62, 0.15);
    }
    .admin-option {
      background: linear-gradient(45deg, #fff8e1, #ffffff);
      border-color: #ff9800;
    }
    .admin-option:hover {
      border-color: #f57c00;
    }
    .option-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
    }
    .customer-icon {
      background: linear-gradient(135deg, #667eea, #764ba2);
    }
    .restaurant-icon {
      background: linear-gradient(135deg, #f093fb, #f5576c);
    }
    .admin-icon {
      background: linear-gradient(135deg, #ffa726, #ff9800);
    }
    .option-content h3 {
      color: #2d8a3e;
      margin-bottom: 0.3rem;
      font-size: 1.2rem;
    }
    .option-content p {
      color: #666;
      margin-bottom: 0.8rem;
      font-size: 0.9rem;
    }
    .login-features {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      justify-content: flex-end;
    }
    .feature-tag {
      background: #e8f5e8;
      color: #2d8a3e;
      padding: 0.2rem 0.6rem;
      border-radius: 10px;
      font-size: 0.8rem;
      font-weight: 500;
    }
    .option-arrow {
      font-size: 1.2rem;
      color: #2d8a3e;
      font-weight: bold;
    }
    
    /* Quick Login Section */
    .quick-login {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 12px;
      margin-bottom: 2rem;
    }
    .quick-login h4 {
      color: #2d8a3e;
      margin-bottom: 1rem;
      font-size: 1.1rem;
    }
    .demo-accounts {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .demo-card {
      background: white;
      padding: 1rem;
      border-radius: 8px;
      border: 2px solid #e8f5e8;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.8rem;
    }
    .demo-card:hover {
      border-color: #2d8a3e;
      transform: scale(1.02);
    }
    .demo-icon {
      font-size: 1.5rem;
    }
    .demo-info {
      text-align: right;
      flex: 1;
    }
    .demo-info strong {
      display: block;
      color: #2d8a3e;
      font-size: 0.9rem;
    }
    .demo-info small {
      color: #666;
      font-size: 0.8rem;
    }
    
    .register-link {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #eee;
    }
    .register-link p {
      color: #666;
    }
    .register-link a {
      color: #2d8a3e;
      text-decoration: none;
      font-weight: 500;
    }
    .register-link a:hover {
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
      .login-option {
        grid-template-columns: 1fr;
        gap: 1rem;
        text-align: center;
        padding: 1.2rem;
      }
      .option-icon {
        width: 50px;
        height: 50px;
        font-size: 1.5rem;
        margin: 0 auto;
      }
      .option-arrow {
        display: none;
      }
      .login-features {
        justify-content: center;
      }
      .demo-accounts {
        grid-template-columns: 1fr;
      }
    }
    
    @media (max-width: 480px) {
      .login-select-container {
        padding: 0.5rem;
      }
      .selection-card {
        padding: 1rem;
      }
      .header h1 {
        font-size: 1.3rem;
      }
      .login-option {
        padding: 1rem;
      }
      .demo-card {
        padding: 0.8rem;
      }
    }
  `]
})
export class LoginSelectComponent {
  
  constructor() {}

  quickLogin(type: 'customer' | 'restaurant') {
    // TODO: Implement quick login functionality
    if (type === 'customer') {
      // Navigate to customer login with pre-filled credentials
      alert('Quick Login: Customer - test@sahtein.com');
    } else {
      // Navigate to restaurant login with pre-filled credentials
      alert('Quick Login: Restaurant - restaurant@sahtein.com');
    }
  }
}