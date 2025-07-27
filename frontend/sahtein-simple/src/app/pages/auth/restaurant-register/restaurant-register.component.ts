// app/pages/auth/restaurant-register/restaurant-register.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-restaurant-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="register-container">
      <div class="register-card">
        <div class="header">
          <h1>🏪 تسجيل مطعم جديد</h1>
          <p>قدم طلب لإضافة مطعمك إلى منصة صحتين</p>
        </div>

        <form (ngSubmit)="onSubmit()" #restaurantForm="ngForm" class="register-form">
          
          <!-- Login Information -->
          <div class="form-section">
            <h3>معلومات تسجيل الدخول</h3>
            <div class="form-row">
              <div class="form-group">
                <label>اسم المستخدم *</label>
                <input 
                  type="text" 
                  [(ngModel)]="formData.username" 
                  name="username"
                  required
                  placeholder="اختر اسم مستخدم فريد"
                  class="form-control"
                >
              </div>
              <div class="form-group">
                <label>كلمة المرور *</label>
                <input 
                  type="password" 
                  [(ngModel)]="formData.password" 
                  name="password"
                  required
                  minlength="6"
                  placeholder="كلمة مرور قوية"
                  class="form-control"
                >
              </div>
            </div>
          </div>

          <!-- Restaurant Information -->
          <div class="form-section">
            <h3>معلومات المطعم</h3>
            <div class="form-row">
              <div class="form-group">
                <label>اسم المطعم (عربي) *</label>
                <input 
                  type="text" 
                  [(ngModel)]="formData.restaurant.name_ar" 
                  name="name_ar"
                  required
                  placeholder="مطعم الشام"
                  class="form-control"
                >
              </div>
              <div class="form-group">
                <label>اسم المطعم (إنجليزي) *</label>
                <input 
                  type="text" 
                  [(ngModel)]="formData.restaurant.name_en" 
                  name="name_en"
                  required
                  placeholder="Al Sham Restaurant"
                  class="form-control"
                >
              </div>
            </div>

            <div class="form-row">
              <div class="form-group full-width">
                <label>وصف المطعم (عربي) *</label>
                <textarea 
                  [(ngModel)]="formData.restaurant.description_ar" 
                  name="description_ar"
                  required
                  placeholder="وصف مفصل عن المطعم والأطباق"
                  class="form-control"
                  rows="3"
                ></textarea>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group full-width">
                <label>وصف المطعم (إنجليزي) *</label>
                <textarea 
                  [(ngModel)]="formData.restaurant.description_en" 
                  name="description_en"
                  required
                  placeholder="Detailed description of the restaurant and dishes"
                  class="form-control"
                  rows="3"
                ></textarea>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>نوع المطعم *</label>
                <select 
                  [(ngModel)]="formData.restaurant.category" 
                  name="category"
                  required
                  class="form-control"
                >
                  <option value="">اختر نوع المطعم</option>
                  <option value="مشاوي">مشاوي</option>
                  <option value="بيتزا">بيتزا</option>
                  <option value="مأكولات بحرية">مأكولات بحرية</option>
                  <option value="نباتي">نباتي</option>
                  <option value="شاورما">شاورما</option>
                  <option value="حلويات">حلويات</option>
                  <option value="مأكولات شعبية">مأكولات شعبية</option>
                  <option value="فطار وعشاء">فطار وعشاء</option>
                  <option value="مشروبات">مشروبات</option>
                  <option value="وجبات سريعة">وجبات سريعة</option>
                </select>
              </div>
              <div class="form-group">
                <label>المدينة *</label>
                <select 
                  [(ngModel)]="formData.restaurant.city" 
                  name="city"
                  required
                  class="form-control"
                >
                  <option value="">اختر المدينة</option>
                  <option value="دمشق">دمشق</option>
                  <option value="حلب">حلب</option>
                  <option value="حمص">حمص</option>
                  <option value="حماة">حماة</option>
                  <option value="اللاذقية">اللاذقية</option>
                  <option value="دير الزور">دير الزور</option>
                  <option value="الرقة">الرقة</option>
                  <option value="درعا">درعا</option>
                  <option value="السويداء">السويداء</option>
                  <option value="القنيطرة">القنيطرة</option>
                  <option value="طرطوس">طرطوس</option>
                  <option value="الحسكة">الحسكة</option>
                  <option value="منبج">منبج</option>
                  <option value="القامشلي">القامشلي</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Location Information -->
          <div class="form-section">
            <h3>معلومات الموقع</h3>
            <div class="form-row">
              <div class="form-group full-width">
                <label>العنوان التفصيلي *</label>
                <textarea 
                  [(ngModel)]="formData.restaurant.address" 
                  name="address"
                  required
                  placeholder="العنوان الكامل مع رقم البناء والشارع والحي"
                  class="form-control"
                  rows="2"
                ></textarea>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>رقم الهاتف *</label>
                <input 
                  type="tel" 
                  [(ngModel)]="formData.restaurant.phone" 
                  name="phone"
                  required
                  placeholder="+963 11 123 4567"
                  class="form-control"
                >
              </div>
              <div class="form-group">
                <label>ساعات العمل *</label>
                <input 
                  type="text" 
                  [(ngModel)]="formData.restaurant.open_times" 
                  name="open_times"
                  required
                  placeholder="9:00 AM - 11:00 PM"
                  class="form-control"
                >
              </div>
            </div>
          </div>

          <!-- Owner Information -->
          <div class="form-section">
            <h3>معلومات صاحب المطعم</h3>
            <div class="form-row">
              <div class="form-group">
                <label>الاسم الكامل *</label>
                <input 
                  type="text" 
                  [(ngModel)]="formData.owner.name" 
                  name="owner_name"
                  required
                  placeholder="محمد أحمد علي"
                  class="form-control"
                >
              </div>
              <div class="form-group">
                <label>البريد الإلكتروني *</label>
                <input 
                  type="email" 
                  [(ngModel)]="formData.owner.email" 
                  name="owner_email"
                  required
                  placeholder="owner@restaurant.com"
                  class="form-control"
                >
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>رقم الهاتف الشخصي *</label>
                <input 
                  type="tel" 
                  [(ngModel)]="formData.owner.phone" 
                  name="owner_phone"
                  required
                  placeholder="+963 999 123 456"
                  class="form-control"
                >
              </div>
            </div>
          </div>

          <!-- Documents Section -->
          <div class="form-section">
            <h3>الوثائق المطلوبة</h3>
            <div class="documents-info">
              <div class="document-item">
                <span class="doc-icon">📋</span>
                <span>ترخيص المطعم</span>
              </div>
              <div class="document-item">
                <span class="doc-icon">🆔</span>
                <span>الهوية الشخصية لصاحب المطعم</span>
              </div>
              <div class="document-item">
                <span class="doc-icon">🏥</span>
                <span>شهادة صحية للمطعم</span>
              </div>
              <div class="document-item">
                <span class="doc-icon">📸</span>
                <span>صور المطعم من الداخل والخارج</span>
              </div>
            </div>
            <div class="document-note">
              ⚠️ سيتم التواصل معك لاستكمال الوثائق بعد تقديم الطلب
            </div>
          </div>

          <!-- Terms -->
          <div class="form-section">
            <label class="checkbox-container">
              <input 
                type="checkbox" 
                [(ngModel)]="formData.acceptTerms" 
                name="acceptTerms"
                required
              >
              <span class="checkmark"></span>
              أوافق على <a href="#" class="terms-link">شروط وأحكام</a> منصة صحتين
            </label>
          </div>

          <!-- Submit Button -->
          <div class="form-actions">
            <button 
              type="submit" 
              class="submit-btn"
              [disabled]="!restaurantForm.valid || isSubmitting"
            >
              <span *ngIf="!isSubmitting">تقديم طلب التسجيل</span>
              <span *ngIf="isSubmitting">جارٍ الإرسال...</span>
            </button>
          </div>

          <!-- Success Message -->
          <div *ngIf="showSuccess" class="success-message">
            <div class="success-icon">✅</div>
            <h4>تم تقديم طلبك بنجاح!</h4>
            <p>سيتم التواصل معك خلال 24-48 ساعة للمراجعة والموافقة على انضمام مطعمك إلى منصة صحتين.</p>
            <div class="login-info">
              <strong>معلومات تسجيل الدخول:</strong><br>
              اسم المستخدم: {{ formData.username }}<br>
              <small>احتفظ بهذه المعلومات لتسجيل الدخول بعد الموافقة</small>
            </div>
          </div>

          <!-- Error Message -->
          <div *ngIf="showError" class="error-message">
            <div class="error-icon">❌</div>
            <h4>حدث خطأ!</h4>
            <p>{{ errorMessage }}</p>
          </div>

        </form>

        <!-- Login Link -->
        <div class="login-link">
          <p>لديك حساب مطعم؟ <a routerLink="/restaurant-login">تسجيل دخول</a></p>
          <p>عميل؟ <a routerLink="/login">دخول العملاء</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #2d8a3e, #4caf50);
      padding: 2rem 1rem;
      direction: rtl;
    }
    
    .register-card {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 20px;
      box-shadow: 0 25px 60px rgba(0,0,0,0.2);
      overflow: hidden;
    }
    
    .header {
      background: linear-gradient(135deg, #2d8a3e, #4caf50);
      color: white;
      padding: 2rem;
      text-align: center;
    }
    
    .header h1 {
      margin: 0 0 0.5rem 0;
      font-size: 2rem;
    }
    
    .header p {
      margin: 0;
      opacity: 0.9;
      font-size: 1.1rem;
    }
    
    .register-form {
      padding: 2rem;
    }
    
    .form-section {
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #eee;
    }
    
    .form-section:last-of-type {
      border-bottom: none;
    }
    
    .form-section h3 {
      color: #2d8a3e;
      margin-bottom: 1.5rem;
      font-size: 1.3rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
    }
    
    .form-group.full-width {
      grid-column: 1 / -1;
    }
    
    .form-group label {
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: #333;
    }
    
    .form-control {
      padding: 0.8rem;
      border: 2px solid #e8f5e8;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s ease;
      direction: rtl;
    }
    
    .form-control:focus {
      outline: none;
      border-color: #2d8a3e;
    }
    
    .form-control:invalid {
      border-color: #ff4757;
    }
    
    select.form-control {
      cursor: pointer;
    }
    
    textarea.form-control {
      resize: vertical;
      min-height: 80px;
    }
    
    /* Documents Section */
    .documents-info {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 10px;
      margin-bottom: 1rem;
    }
    
    .document-item {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      margin-bottom: 0.8rem;
      font-size: 0.95rem;
    }
    
    .document-item:last-child {
      margin-bottom: 0;
    }
    
    .doc-icon {
      font-size: 1.2rem;
    }
    
    .document-note {
      background: #fff3cd;
      color: #856404;
      padding: 1rem;
      border-radius: 8px;
      border: 1px solid #ffeaa7;
      font-size: 0.9rem;
      text-align: center;
    }
    
    /* Checkbox */
    .checkbox-container {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      cursor: pointer;
      font-size: 0.95rem;
    }
    
    .checkbox-container input[type="checkbox"] {
      width: 18px;
      height: 18px;
      accent-color: #2d8a3e;
    }
    
    .terms-link {
      color: #2d8a3e;
      text-decoration: none;
    }
    
    .terms-link:hover {
      text-decoration: underline;
    }
    
    /* Form Actions */
    .form-actions {
      text-align: center;
      margin-top: 2rem;
    }
    
    .submit-btn {
      background: linear-gradient(135deg, #2d8a3e, #4caf50);
      color: white;
      border: none;
      padding: 1rem 3rem;
      border-radius: 50px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      min-width: 200px;
    }
    
    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(45, 138, 62, 0.3);
    }
    
    .submit-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    /* Messages */
    .success-message, .error-message {
      margin-top: 2rem;
      padding: 2rem;
      border-radius: 12px;
      text-align: center;
    }
    
    .success-message {
      background: #d4edda;
      border: 1px solid #c3e6cb;
      color: #155724;
    }
    
    .error-message {
      background: #f8d7da;
      border: 1px solid #f5c6cb;
      color: #721c24;
    }
    
    .success-icon, .error-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    
    .login-info {
      background: rgba(45, 138, 62, 0.1);
      padding: 1rem;
      border-radius: 8px;
      margin-top: 1rem;
      font-size: 0.9rem;
    }
    
    /* Login Link */
    .login-link {
      text-align: center;
      padding: 2rem;
      background: #f8f9fa;
      border-top: 1px solid #eee;
    }
    
    .login-link p {
      margin: 0.5rem 0;
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
    
    /* Mobile Responsive */
    @media (max-width: 768px) {
      .register-container {
        padding: 1rem;
      }
      
      .register-card {
        margin: 0;
      }
      
      .header {
        padding: 1.5rem;
      }
      
      .header h1 {
        font-size: 1.5rem;
      }
      
      .register-form {
        padding: 1.5rem;
      }
      
      .form-row {
        grid-template-columns: 1fr;
        gap: 0.5rem;
      }
      
      .submit-btn {
        width: 100%;
        padding: 1rem;
      }
    }
    
    @media (max-width: 480px) {
      .register-container {
        padding: 0.5rem;
      }
      
      .header {
        padding: 1rem;
      }
      
      .register-form {
        padding: 1rem;
      }
      
      .form-section h3 {
        font-size: 1.1rem;
      }
    }
  `]
})
export class RestaurantRegisterComponent {
  isSubmitting = false;
  showSuccess = false;
  showError = false;
  errorMessage = '';

  formData = {
    username: '',
    password: '',
    restaurant: {
      name_ar: '',
      name_en: '',
      description_ar: '',
      description_en: '',
      category: '',
      city: '',
      address: '',
      phone: '',
      open_times: ''
    },
    owner: {
      name: '',
      email: '',
      phone: ''
    },
    acceptTerms: false
  };

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.formData.acceptTerms) {
      this.showError = true;
      this.errorMessage = 'يجب الموافقة على الشروط والأحكام';
      return;
    }

    this.isSubmitting = true;
    this.showError = false;

    const payload = {
      admin: {
        username: this.formData.username,
        password: this.formData.password,
        role: 'restaurant_admin'
      },
      restaurant: this.formData.restaurant,
      owner: this.formData.owner
    };

    this.http.post('http://localhost:5000/api/restaurant/register', payload)
      .subscribe({
        next: (response: any) => {
          this.isSubmitting = false;
          this.showSuccess = true;
          console.log('Restaurant registration successful:', response);
          
          // Reset form after 5 seconds
          setTimeout(() => {
            this.router.navigate(['/restaurant-login']);
          }, 5000);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.showError = true;
          
          if (error.error?.message) {
            this.errorMessage = error.error.message;
          } else if (error.status === 409) {
            this.errorMessage = 'اسم المستخدم موجود بالفعل. اختر اسماً آخر.';
          } else {
            this.errorMessage = 'حدث خطأ في الخادم. يرجى المحاولة مرة أخرى.';
          }
          
          console.error('Registration error:', error);
        }
      });
  }
}