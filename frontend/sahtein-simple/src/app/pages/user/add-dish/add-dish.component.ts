// app/pages/user/add-dish/add-dish.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-add-dish',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="add-dish-container">
      <!-- Header -->
      <div class="add-dish-header">
        <button class="back-btn" (click)="goBack()">← العودة لإدارة القائمة</button>
        <div class="header-info">
          <h1>✨ إضافة طبق جديد</h1>
          <p>{{ restaurant?.name_ar || 'مطعمي' }}</p>
        </div>
      </div>

      <!-- Category Selection -->
      <div class="category-section">
        <h3>اختر فئة الطبق</h3>
        <div class="categories-grid">
          <div 
            *ngFor="let category of categories" 
            class="category-card"
            [class.selected]="newDish.category === category.key"
            (click)="selectCategory(category.key)"
          >
            <div class="category-icon">{{ category.icon }}</div>
            <div class="category-name">{{ category.name }}</div>
            <div class="category-description">{{ category.description }}</div>
            <div class="category-examples">
              <small>مثال: {{ category.examples.join('، ') }}</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Dish Form -->
      <div class="dish-form-section" *ngIf="newDish.category">
        <h3>تفاصيل الطبق - {{ getCategoryName(newDish.category) }}</h3>
        
        <form (ngSubmit)="saveDish()" #dishForm="ngForm" class="dish-form">
          <!-- Basic Information -->
          <div class="form-section">
            <h4>📝 المعلومات الأساسية</h4>
            
            <div class="form-row">
              <div class="form-group">
                <label>اسم الطبق (عربي) *</label>
                <input 
                  type="text" 
                  [(ngModel)]="newDish.name_ar" 
                  name="name_ar" 
                  required 
                  class="form-control"
                  placeholder="مثال: كباب حلبي"
                  #nameAr="ngModel"
                >
                <div class="error-message" *ngIf="nameAr.invalid && nameAr.touched">
                  اسم الطبق مطلوب
                </div>
              </div>
              
              <div class="form-group">
                <label>اسم الطبق (إنجليزي)</label>
                <input 
                  type="text" 
                  [(ngModel)]="newDish.name_en" 
                  name="name_en" 
                  class="form-control"
                  placeholder="Example: Aleppo Kebab"
                >
              </div>
            </div>

            <div class="form-group">
              <label>وصف الطبق (عربي) *</label>
              <textarea 
                [(ngModel)]="newDish.description_ar" 
                name="description_ar" 
                required 
                class="form-control"
                rows="4"
                placeholder="وصف مفصل عن الطبق ومكوناته وطريقة التحضير..."
                #descAr="ngModel"
              ></textarea>
              <div class="error-message" *ngIf="descAr.invalid && descAr.touched">
                وصف الطبق مطلوب
              </div>
            </div>

            <div class="form-group">
              <label>وصف الطبق (إنجليزي)</label>
              <textarea 
                [(ngModel)]="newDish.description_en" 
                name="description_en" 
                class="form-control"
                rows="3"
                placeholder="Detailed description of the dish..."
              ></textarea>
            </div>
          </div>

          <!-- Price and Availability -->
          <div class="form-section">
            <h4>💰 السعر والتوفر</h4>
            
            <div class="form-row">
              <div class="form-group">
                <label>السعر (ليرة سورية) *</label>
                <div class="price-input-group">
                  <input 
                    type="number" 
                    [(ngModel)]="newDish.price" 
                    name="price" 
                    required 
                    min="0"
                    step="500"
                    class="form-control price-input"
                    placeholder="15000"
                    #price="ngModel"
                  >
                  <span class="currency">س.ل</span>
                </div>
                <div class="error-message" *ngIf="price.invalid && price.touched">
                  السعر مطلوب ويجب أن يكون أكبر من صفر
                </div>
                <div class="price-preview" *ngIf="newDish.price > 0">
                  المعاينة: {{ formatPrice(newDish.price) }}
                </div>
              </div>

              <div class="form-group">
                <label>حالة التوفر</label>
                <div class="availability-options">
                  <label class="radio-option">
                    <input 
                      type="radio" 
                      [(ngModel)]="newDish.is_available" 
                      name="is_available" 
                      [value]="true"
                    >
                    <span class="radio-custom available">✅ متاح للطلب</span>
                  </label>
                  <label class="radio-option">
                    <input 
                      type="radio" 
                      [(ngModel)]="newDish.is_available" 
                      name="is_available" 
                      [value]="false"
                    >
                    <span class="radio-custom unavailable">❌ غير متاح حالياً</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Ingredients -->
          <div class="form-section">
            <h4>🥘 المكونات والمواصفات</h4>
            
            <div class="form-row">
              <div class="form-group">
                <label>المكونات (عربي)</label>
                <input 
                  type="text" 
                  [(ngModel)]="newDish.ingredients_ar" 
                  name="ingredients_ar" 
                  class="form-control"
                  placeholder="لحم غنم، بصل، بقدونس، بهارات، ملح، فلفل"
                >
                <small class="form-hint">فصل المكونات بفاصلة</small>
              </div>
              
              <div class="form-group">
                <label>المكونات (إنجليزي)</label>
                <input 
                  type="text" 
                  [(ngModel)]="newDish.ingredients_en" 
                  name="ingredients_en" 
                  class="form-control"
                  placeholder="Lamb meat, onions, parsley, spices, salt, pepper"
                >
                <small class="form-hint">Separate ingredients with commas</small>
              </div>
            </div>

            <!-- Additional Options for specific categories -->
            <div class="category-specific-options" *ngIf="getCategorySpecificOptions().length > 0">
              <h5>خيارات خاصة بفئة {{ getCategoryName(newDish.category) }}</h5>
              <div class="options-grid">
                <label 
                  *ngFor="let option of getCategorySpecificOptions()" 
                  class="option-checkbox"
                >
                  <input 
                    type="checkbox" 
                    [(ngModel)]="newDish.specialOptions[option.key]"
                    [name]="option.key"
                  >
                  <span class="checkbox-custom">{{ option.label }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Image Upload -->
          <div class="form-section">
            <h4>📸 صورة الطبق</h4>
            
            <div class="image-upload-area">
              <div class="upload-placeholder" *ngIf="!newDish.image_preview">
                <div class="upload-icon">📷</div>
                <p>اضغط لاختيار صورة الطبق</p>
                <small>أو اسحب الصورة هنا</small>
                <input 
                  type="file" 
                  (change)="handleImageUpload($event)"
                  accept="image/*"
                  class="file-input"
                  #fileInput
                >
              </div>
              
              <div class="image-preview" *ngIf="newDish.image_preview">
                <img [src]="newDish.image_preview" alt="معاينة الطبق">
                <div class="image-actions">
                  <button type="button" class="change-image-btn" (click)="fileInput.click()">
                    تغيير الصورة
                  </button>
                  <button type="button" class="remove-image-btn" (click)="removeImage()">
                    حذف الصورة
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="form-actions">
            <div class="action-buttons">
              <button 
                type="submit" 
                [disabled]="!dishForm.valid || saving" 
                class="save-btn primary"
              >
                {{ saving ? 'جارٍ الحفظ...' : 'حفظ الطبق' }}
              </button>
              
              <button 
                type="button" 
                (click)="saveDraftAndAddAnother()" 
                [disabled]="!dishForm.valid || saving"
                class="save-btn secondary"
              >
                حفظ وإضافة آخر
              </button>
              
              <button type="button" (click)="cancelAdd()" class="cancel-btn">
                إلغاء
              </button>
            </div>
            
            <div class="form-summary">
              <div class="summary-item">
                <strong>الفئة:</strong> {{ getCategoryName(newDish.category) }}
              </div>
              <div class="summary-item" *ngIf="newDish.price > 0">
                <strong>السعر:</strong> {{ formatPrice(newDish.price) }}
              </div>
              <div class="summary-item">
                <strong>الحالة:</strong> {{ newDish.is_available ? 'متاح' : 'غير متاح' }}
              </div>
            </div>
          </div>
        </form>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
        جارٍ التحميل...
      </div>
    </div>
  `,
  styles: [`
    .add-dish-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 2rem;
      background: #f8f9fa;
      min-height: 100vh;
    }

    /* Header */
    .add-dish-header {
      background: white;
      padding: 2rem;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(45, 138, 62, 0.1);
      margin-bottom: 2rem;
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .back-btn {
      background: #6c757d;
      color: white;
      border: none;
      padding: 0.8rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.3s ease;
    }

    .back-btn:hover {
      background: #5a6268;
    }

    .header-info h1 {
      color: #2d8a3e;
      margin-bottom: 0.5rem;
      font-size: 2rem;
    }

    .header-info p {
      color: #666;
      font-size: 1.1rem;
    }

    /* Category Selection */
    .category-section {
      background: white;
      padding: 2rem;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(45, 138, 62, 0.1);
      margin-bottom: 2rem;
    }

    .category-section h3 {
      color: #2d8a3e;
      margin-bottom: 2rem;
      text-align: center;
      font-size: 1.5rem;
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .category-card {
      background: #f8f9fa;
      border: 3px solid #e8f5e8;
      border-radius: 20px;
      padding: 2rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .category-card:hover {
      transform: translateY(-5px);
      border-color: #2d8a3e;
      box-shadow: 0 10px 25px rgba(45, 138, 62, 0.15);
    }

    .category-card.selected {
      background: linear-gradient(135deg, #2d8a3e, #4caf50);
      color: white;
      border-color: #2d8a3e;
    }

    .category-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .category-name {
      font-size: 1.3rem;
      font-weight: bold;
      margin-bottom: 0.8rem;
      color: #2d8a3e;
    }

    .category-card.selected .category-name {
      color: white;
    }

    .category-description {
      color: #666;
      margin-bottom: 1rem;
      line-height: 1.4;
    }

    .category-card.selected .category-description {
      color: rgba(255, 255, 255, 0.9);
    }

    .category-examples {
      font-style: italic;
      color: #888;
    }

    .category-card.selected .category-examples {
      color: rgba(255, 255, 255, 0.8);
    }

    /* Form Section */
    .dish-form-section {
      background: white;
      padding: 2rem;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(45, 138, 62, 0.1);
      margin-bottom: 2rem;
    }

    .dish-form-section h3 {
      color: #2d8a3e;
      margin-bottom: 2rem;
      text-align: center;
      font-size: 1.5rem;
    }

    .form-section {
      margin-bottom: 3rem;
      padding: 2rem;
      background: #f8f9fa;
      border-radius: 15px;
      border-left: 4px solid #2d8a3e;
    }

    .form-section h4 {
      color: #2d8a3e;
      margin-bottom: 1.5rem;
      font-size: 1.2rem;
    }

    .form-section h5 {
      color: #666;
      margin-bottom: 1rem;
      font-size: 1rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-bottom: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      color: #333;
      font-weight: 500;
      font-size: 0.95rem;
    }

    .form-control {
      padding: 1rem;
      border: 2px solid #e8f5e8;
      border-radius: 10px;
      font-size: 1rem;
      transition: border-color 0.3s ease;
      direction: rtl;
      text-align: right;
    }

    .form-control:focus {
      outline: none;
      border-color: #2d8a3e;
      box-shadow: 0 0 0 3px rgba(45, 138, 62, 0.1);
    }

    .form-control.price-input {
      text-align: left;
      direction: ltr;
    }

    textarea.form-control {
      resize: vertical;
      min-height: 100px;
      font-family: inherit;
    }

    .form-hint {
      color: #888;
      font-size: 0.8rem;
      margin-top: 0.3rem;
    }

    .error-message {
      color: #dc3545;
      font-size: 0.9rem;
      margin-top: 0.3rem;
    }

    /* Price Input */
    .price-input-group {
      position: relative;
      display: flex;
      align-items: center;
    }

    .currency {
      position: absolute;
      right: 1rem;
      color: #666;
      font-weight: 500;
      pointer-events: none;
    }

    .price-input {
      padding-right: 3rem !important;
    }

    .price-preview {
      margin-top: 0.5rem;
      padding: 0.5rem 1rem;
      background: #e8f5e8;
      color: #2d8a3e;
      border-radius: 8px;
      font-weight: 500;
      text-align: center;
    }

    /* Availability Options */
    .availability-options {
      display: flex;
      gap: 2rem;
      margin-top: 0.5rem;
    }

    .radio-option {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      cursor: pointer;
    }

    .radio-option input[type="radio"] {
      display: none;
    }

    .radio-custom {
      padding: 0.8rem 1.5rem;
      border: 2px solid #e8f5e8;
      border-radius: 25px;
      transition: all 0.3s ease;
      font-weight: 500;
    }

    .radio-option input[type="radio"]:checked + .radio-custom.available {
      background: #d4edda;
      border-color: #28a745;
      color: #155724;
    }

    .radio-option input[type="radio"]:checked + .radio-custom.unavailable {
      background: #f8d7da;
      border-color: #dc3545;
      color: #721c24;
    }

    /* Category Specific Options */
    .category-specific-options {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #dee2e6;
    }

    .options-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }

    .option-checkbox {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      cursor: pointer;
    }

    .option-checkbox input[type="checkbox"] {
      display: none;
    }

    .checkbox-custom {
      padding: 0.6rem 1rem;
      border: 2px solid #e8f5e8;
      border-radius: 15px;
      transition: all 0.3s ease;
      font-size: 0.9rem;
    }

    .option-checkbox input[type="checkbox"]:checked + .checkbox-custom {
      background: #e8f5e8;
      border-color: #2d8a3e;
      color: #2d8a3e;
    }

    /* Image Upload */
    .image-upload-area {
      margin-top: 1rem;
    }

    .upload-placeholder {
      border: 3px dashed #2d8a3e;
      border-radius: 15px;
      padding: 3rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      background: #f8f9fa;
    }

    .upload-placeholder:hover {
      background: #e8f5e8;
      border-color: #268a37;
    }

    .upload-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      color: #2d8a3e;
    }

    .upload-placeholder p {
      color: #2d8a3e;
      font-weight: 500;
      margin-bottom: 0.5rem;
    }

    .upload-placeholder small {
      color: #666;
    }

    .file-input {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
    }

    .image-preview {
      text-align: center;
    }

    .image-preview img {
      max-width: 300px;
      max-height: 200px;
      border-radius: 15px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      margin-bottom: 1rem;
    }

    .image-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    .change-image-btn,
    .remove-image-btn {
      padding: 0.6rem 1.2rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.3s ease;
    }

    .change-image-btn {
      background: #17a2b8;
      color: white;
    }

    .remove-image-btn {
      background: #dc3545;
      color: white;
    }

    .change-image-btn:hover,
    .remove-image-btn:hover {
      transform: translateY(-1px);
    }

    /* Form Actions */
    .form-actions {
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 2px solid #e8f5e8;
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
      align-items: start;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .save-btn {
      padding: 1rem 2rem;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
      font-size: 1rem;
    }

    .save-btn.primary {
      background: linear-gradient(135deg, #2d8a3e, #4caf50);
      color: white;
    }

    .save-btn.secondary {
      background: #17a2b8;
      color: white;
    }

    .save-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }

    .save-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .cancel-btn {
      background: #6c757d;
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 10px;
      cursor: pointer;
      transition: background 0.3s ease;
    }

    .cancel-btn:hover {
      background: #5a6268;
    }

    .form-summary {
      background: #e8f5e8;
      padding: 1.5rem;
      border-radius: 15px;
      border: 2px solid #2d8a3e;
    }

    .summary-item {
      margin-bottom: 0.8rem;
      color: #333;
    }

    .summary-item:last-child {
      margin-bottom: 0;
    }

    .summary-item strong {
      color: #2d8a3e;
    }

    /* Loading */
    .loading {
      text-align: center;
      padding: 4rem;
      color: #666;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #2d8a3e;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Responsive */
    @media (max-width: 768px) {
      .add-dish-container {
        padding: 1rem;
      }

      .add-dish-header {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
      }

      .categories-grid {
        grid-template-columns: 1fr;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .availability-options {
        flex-direction: column;
        gap: 1rem;
      }

      .form-actions {
        grid-template-columns: 1fr;
      }

      .action-buttons {
        flex-direction: column;
      }
    }
  `]
})
export class AddDishComponent implements OnInit {
  restaurant: any = null;
  loading = false;
  saving = false;

  categories = [
    {
      key: 'مقبلات',
      name: 'مقبلات',
      icon: '🥗',
      description: 'المقبلات والسلطات والوجبات الخفيفة',
      examples: ['حمص', 'متبل', 'تبولة', 'فتوش'],
      options: [
        { key: 'vegetarian', label: 'نباتي' },
        { key: 'spicy', label: 'حار' },
        { key: 'cold', label: 'بارد' }
      ]
    },
    {
      key: 'أطباق رئيسية',
      name: 'أطباق رئيسية',
      icon: '🍖',
      description: 'الأطباق الرئيسية واللحوم والدواجن',
      examples: ['كباب', 'مندي', 'كبسة', 'فروج مشوي'],
      options: [
        { key: 'beef', label: 'لحم بقر' },
        { key: 'lamb', label: 'لحم غنم' },
        { key: 'chicken', label: 'دجاج' },
        { key: 'spicy', label: 'حار' }
      ]
    },
    {
      key: 'مشروبات',
      name: 'مشروبات',
      icon: '🥤',
      description: 'المشروبات الساخنة والباردة والعصائر',
      examples: ['شاي', 'قهوة', 'عصير برتقال', 'لبن'],
      options: [
        { key: 'hot', label: 'ساخن' },
        { key: 'cold', label: 'بارد' },
        { key: 'fresh', label: 'طازج' },
        { key: 'sugar_free', label: 'بدون سكر' }
      ]
    },
    {
      key: 'حلويات',
      name: 'حلويات',
      icon: '🍰',
      description: 'الحلويات الشرقية والغربية والمعجنات',
      examples: ['بقلاوة', 'مهلبية', 'كنافة', 'تيراميسو'],
      options: [
        { key: 'nuts', label: 'يحتوي على مكسرات' },
        { key: 'dairy_free', label: 'خالي من الألبان' },
        { key: 'sugar_free', label: 'بدون سكر' }
      ]
    }
  ];

  newDish = {
    name_ar: '',
    name_en: '',
    description_ar: '',
    description_en: '',
    price: 0,
    ingredients_ar: '',
    ingredients_en: '',
    category: '',
    is_available: true,
    image_preview: '',
    image_file: null as File | null,
    specialOptions: {} as { [key: string]: boolean }
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadRestaurantData();
    this.checkQueryParams();
  }

  loadRestaurantData() {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.apiService.getUserRestaurant(user.id).subscribe({
      next: (response) => {
        this.restaurant = response.restaurant;
      },
      error: (err) => {
        console.error('Error loading restaurant:', err);
      }
    });
  }

  checkQueryParams() {
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectCategory(params['category']);
      }
    });
  }

  selectCategory(categoryKey: string) {
    this.newDish.category = categoryKey;
    this.newDish.specialOptions = {};
    
    // Initialize special options for this category
    const category = this.categories.find(cat => cat.key === categoryKey);
    if (category) {
      category.options.forEach(option => {
        this.newDish.specialOptions[option.key] = false;
      });
    }
  }

  getCategoryName(categoryKey: string): string {
    const category = this.categories.find(cat => cat.key === categoryKey);
    return category ? category.name : categoryKey;
  }

  getCategorySpecificOptions(): any[] {
    const category = this.categories.find(cat => cat.key === this.newDish.category);
    return category ? category.options : [];
  }

  handleImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.newDish.image_file = file;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.newDish.image_preview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.newDish.image_preview = '';
    this.newDish.image_file = null;
  }

  saveDish() {
    if (this.saving || !this.restaurant) return;
    
    this.saving = true;
    
    const dishData = {
      ...this.newDish,
      restaurant_id: this.restaurant.id,
      special_options: this.newDish.specialOptions
    };
    
    this.apiService.createDish(dishData).subscribe({
      next: (response) => {
        this.showNotification('تم إضافة الطبق بنجاح!');
        this.router.navigate(['/user/menu-management']);
      },
      error: (err) => {
        console.error('Error creating dish:', err);
        this.showNotification('فشل في إضافة الطبق');
        this.saving = false;
      }
    });
  }

  saveDraftAndAddAnother() {
    if (this.saving || !this.restaurant) return;
    
    this.saving = true;
    
    const dishData = {
      ...this.newDish,
      restaurant_id: this.restaurant.id,
      special_options: this.newDish.specialOptions
    };
    
    this.apiService.createDish(dishData).subscribe({
      next: (response) => {
        this.showNotification('تم إضافة الطبق بنجاح!');
        this.resetForm();
        this.saving = false;
      },
      error: (err) => {
        console.error('Error creating dish:', err);
        this.showNotification('فشل في إضافة الطبق');
        this.saving = false;
      }
    });
  }

  resetForm() {
    const currentCategory = this.newDish.category;
    this.newDish = {
      name_ar: '',
      name_en: '',
      description_ar: '',
      description_en: '',
      price: 0,
      ingredients_ar: '',
      ingredients_en: '',
      category: currentCategory,
      is_available: true,
      image_preview: '',
      image_file: null,
      specialOptions: {}
    };
    
    // Re-initialize special options
    this.selectCategory(currentCategory);
  }

  cancelAdd() {
    this.router.navigate(['/user/menu-management']);
  }

  goBack() {
    this.router.navigate(['/user/menu-management']);
  }

  formatPrice(price: number): string {
    return `${price.toLocaleString()} س.ل`;
  }

  showNotification(message: string) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #28a745;
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
      direction: rtl;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  }
}