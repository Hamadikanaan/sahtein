// app/pages/auth/login/login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>تسجيل الدخول</h2>
        
        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="form-group">
            <label>البريد الإلكتروني</label>
            <input 
              type="email" 
              [(ngModel)]="credentials.email" 
              name="email" 
              required 
              class="form-control"
              placeholder=" Your mail"
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
              placeholder="password"
            >
          </div>
          
          <button 
            type="submit" 
            [disabled]="!loginForm.valid || loading" 
            class="submit-btn"
          >
            {{ loading ? 'جارٍ تسجيل الدخول...' : 'دخول' }}
          </button>
          
          <div *ngIf="error" class="error-message">
            {{ error }}
          </div>
        </form>
        
        <p class="auth-link">
          ليس لديك حساب؟ <a routerLink="/register">سجل الآن</a>
        </p>
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
    }
    .auth-card {
      background: white;
      padding: 3rem;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.15);
      width: 100%;
      max-width: 400px;
      text-align: center;
    }
    .auth-card h2 {
      color: #333;
      margin-bottom: 2rem;
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
      border-color: #667eea;
    }
    .submit-btn {
      width: 100%;
      padding: 1rem;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 1.1rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
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
    .auth-link {
      margin-top: 2rem;
      color: #666;
    }
    .auth-link a {
      color: #667eea;
      text-decoration: none;
    }
    .auth-link a:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.loading = true;
    this.error = '';

    this.authService.login(this.credentials.email, this.credentials.password).subscribe({
      next: () => {
        this.router.navigate(['/restaurants']);
      },
      error: (err) => {
        this.error = 'فشل في تسجيل الدخول. تحقق من البيانات.';
        this.loading = false;
      }
    });
  }
}