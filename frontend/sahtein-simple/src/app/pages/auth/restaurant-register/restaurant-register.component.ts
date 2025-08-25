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
  styleUrls: ['./restaurant-register.component.css'],
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
      
      <!-- Floating Restaurant Icons -->
      <div class="floating-icons">
        <span class="float-icon icon-1">🏪</span>
        <span class="float-icon icon-2">📋</span>
        <span class="float-icon icon-3">👨‍🍳</span>
        <span class="float-icon icon-4">📊</span>
        <span class="float-icon icon-5">🍽️</span>
        <span class="float-icon icon-6">💼</span>
      </div>

      <div class="register-card">
        <div class="card-glow"></div>
        
        <div class="header">
          <div class="header-icon">
            <span class="main-icon">🏪</span>
            <div class="icon-pulse"></div>
          </div>
          <h1>تسجيل مطعم جديد</h1>
          <p>قدم طلب لإضافة مطعمك إلى منصة صحتين</p>
        </div>

        <form (ngSubmit)="onSubmit()" #restaurantForm="ngForm" class="register-form">
          
          <!-- Login Information -->
          <div class="form-section">
            <h3>
              <span class="section-icon">🔐</span>
              معلومات تسجيل الدخول
            </h3>
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
            <h3>
              <span class="section-icon">🏪</span>
              معلومات المطعم
            </h3>
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
            <h3>
              <span class="section-icon">📍</span>
              معلومات الموقع
            </h3>
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
            <h3>
              <span class="section-icon">👨‍💼</span>
              معلومات صاحب المطعم
            </h3>
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
            <h3>
              <span class="section-icon">📄</span>
              الوثائق المطلوبة
            </h3>
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
              <span class="btn-content" [class.loading]="isSubmitting">
                <svg *ngIf="isSubmitting" class="loading-spinner" width="20" height="20" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.25"/>
                  <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"/>
                </svg>
                <span>{{ isSubmitting ? 'جار الإرسال...' : 'تقديم طلب التسجيل' }}</span>
              </span>
              <div class="btn-shine"></div>
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
            <button class="error-close" (click)="showError = false">&times;</button>
          </div>

        </form>

        <!-- Login Link -->
        <div class="login-link">
          <p>لديك حساب مطعم؟ <a routerLink="/restaurant-login">تسجيل دخول</a></p>
          <p>عميل؟ <a routerLink="/login-select">دخول العملاء</a></p>
        </div>
      </div>
    </div>
  `
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