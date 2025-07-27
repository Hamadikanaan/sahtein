// app/pages/auth/restaurant-login/restaurant-login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-restaurant-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="restaurant-header">
          <div class="restaurant-icon">🏪</div>
          <h2>دخول المطاعم</h2>
          <p>إدارة مطعمك وقائمة الطعام</p>
        </div>
        
        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="form-group">
            <label>البريد الإلكتروني للمطعم</label>
            <input 
              type="email" 
              [(ngModel)]="credentials.email" 
              name="email" 
              required 
              class="form-control"
              placeholder="restaurant@example.com"
            >
          </div>
          
          <div class="form-group">
            <label>كلمة المرور</label>
            <input 
              type="password" 
              [(ngModel)]="credentials.password" 
              name="password" 
              required 
              class="form-control"
              placeholder="••••••••"
            >
          </div>
          
          <button 
            type="submit" 
            [disabled]="!loginForm.valid || loading" 
            class="submit-btn"
          >
            {{ loading ? 'جارٍ تسجيل الدخول...' : 'دخول إلى لوحة التحكم' }}
          </button>
          
          <div *ngIf="error" class="error-message">
            {{ error }}
          </div>
        </form>
        
        <div class="auth-links">
          <p class="auth-link">
            مطعم جديد؟ <a routerLink="/restaurant-register">تقديم طلب انضمام</a>
          </p>
          
          <p class="auth-link">
            عميل؟ <a routerLink="/login">دخول العملاء</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background: linear-gradient(135deg, #2d8a3e, #4caf50);
    }
    .auth-card {
      background: white;
      padding: 3rem;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.2);
      width: 100%;
      max-width: 450px;
      text-align: center;
    }
    .restaurant-header {
      margin-bottom: 2rem;
    }
    .restaurant-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }
    .restaurant-header h2 {
      color: #2d8a3e;
      margin-bottom: 0.5rem;
      font-size: 2rem;
    }
    .restaurant-header p {
      color: #666;
      font-size: 1.1rem;
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
      transition: border-color 0.3s ease;
      direction: ltr;
      text-align: left;
    }
    .form-control:focus {
      outline: none;
      border-color: #2d8a3e;
    }
    .submit-btn {
      width: 100%;
      padding: 1rem;
      background: linear-gradient(135deg, #2d8a3e, #4caf50);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 1.1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-bottom: 1rem;
    }
    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(45, 138, 62, 0.3);
    }
    .submit-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .error-message {
      background: #ff4757;
      color: white;
      padding: 1rem;
      border-radius: 8px;
      margin-top: 1rem;
    }
    .auth-links {
      margin-top: 2rem;
      border-top: 1px solid #eee;
      padding-top: 2rem;
    }
    .auth-link {
      margin-bottom: 1rem;
      color: #666;
    }
    .auth-link a {
      color: #2d8a3e;
      text-decoration: none;
      font-weight: 500;
    }
    .auth-link a:hover {
      text-decoration: underline;
    }
  `]
})
export class RestaurantLoginComponent {
  credentials = { 
    email: 'restaurant@sahtein.com', 
    password: 'restaurant123' 
  };
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.loading = true;
    this.error = '';

    // TODO: Separate Restaurant Auth Service
    // For now, use regular login but redirect to restaurant dashboard
    this.authService.login(this.credentials.email, this.credentials.password).subscribe({
      next: () => {
        this.router.navigate(['/restaurant-dashboard']);
      },
      error: (err) => {
        this.error = 'فشل في تسجيل الدخول. تحقق من البيانات أو تأكد من تفعيل حساب المطعم.';
        this.loading = false;
      }
    });
  }
}