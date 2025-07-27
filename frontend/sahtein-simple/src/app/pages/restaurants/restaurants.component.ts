// app/pages/restaurants/restaurants.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService, Restaurant } from '../../services/api.service';

@Component({
  selector: 'app-restaurants',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="restaurants-container">
      <div class="header">
        <h1>المطاعم المتاحة</h1>
        <p>اختر من أفضل المطاعم السورية</p>
      </div>

      <!-- البحث والفلترة -->
      <div class="search-filters">
        <div class="search-box">
          <input 
            type="text" 
            [(ngModel)]="searchText" 
            (input)="applyFilters()"
            placeholder="ابحث عن المطعم أو العنوان..."
            class="search-input"
          >
          <span class="search-icon">🔍</span>
        </div>
        
        <div class="filter-row">
          <div class="filter-group">
            <label>نوع المطعم:</label>
            <select [(ngModel)]="selectedCategory" (change)="applyFilters()" class="filter-select">
              <option *ngFor="let category of categories" [value]="category.value">
                {{ category.label }}
              </option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>المدينة:</label>
            <select [(ngModel)]="selectedCity" (change)="applyFilters()" class="filter-select">
              <option *ngFor="let city of syrianCities" [value]="city.value">
                {{ city.label }}
              </option>
            </select>
          </div>
          
          <button (click)="clearFilters()" class="clear-btn">مسح الفلترة</button>
        </div>
      </div>

      <!-- نتائج البحث -->
      <div class="results-info" *ngIf="!loading">
        <p>تم العثور على {{ filteredRestaurants.length }} مطعم</p>
      </div>

      <!-- قائمة المطاعم -->
      <div class="restaurants-grid" *ngIf="!loading && filteredRestaurants.length > 0">
        <div 
          *ngFor="let restaurant of filteredRestaurants" 
          class="restaurant-card"
          [routerLink]="['/restaurant', restaurant.id]"
        >
          <div class="restaurant-image">
            🍽️
          </div>
          <div class="restaurant-info">
            <h3>{{ restaurant.name_ar }}</h3>
            <p class="restaurant-category">{{ restaurant.category }}</p>
            <div class="restaurant-location">
              <p class="restaurant-address">📍 {{ restaurant.address }}</p>
              <p class="restaurant-city">🏢 {{ restaurant.city }}</p>
            </div>
            <div class="restaurant-rating">
              <span class="stars">⭐⭐⭐⭐⭐</span>
              <span class="rating">{{ restaurant.rating || 4.5 }}</span>
            </div>
            <p class="restaurant-hours">🕒 {{ restaurant.open_times }}</p>
            <p class="restaurant-phone">📞 {{ restaurant.phone }}</p>
          </div>
        </div>
      </div>

      <div *ngIf="loading" class="loading">
        جارٍ تحميل المطاعم...
      </div>

      <div *ngIf="!loading && filteredRestaurants.length === 0" class="no-results">
        <div class="no-results-icon">🔍</div>
        <h3>لا توجد مطاعم مطابقة لمعايير البحث</h3>
        <p>جرب تغيير المرشحات أو البحث عن شيء آخر</p>
        <button (click)="clearFilters()" class="clear-btn">مسح جميع المرشحات</button>
      </div>
    </div>
  `,
  styles: [`
    .restaurants-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
      background: #ffffff;
      min-height: 100vh;
    }
    .header {
      text-align: center;
      margin-bottom: 3rem;
    }
    .header h1 {
      color: #2d8a3e;
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
    .header p {
      color: #666;
      font-size: 1.2rem;
    }
    
    /* بحث وفلترة */
    .search-filters {
      background: white;
      padding: 2rem;
      border-radius: 15px;
      box-shadow: 0 5px 20px rgba(45, 138, 62, 0.1);
      margin-bottom: 2rem;
      border: 2px solid #e8f5e8;
    }
    .search-box {
      position: relative;
      margin-bottom: 1.5rem;
    }
    .search-input {
      width: 100%;
      padding: 1rem 3rem 1rem 1rem;
      border: 2px solid #e8f5e8;
      border-radius: 10px;
      font-size: 1.1rem;
      transition: border-color 0.3s ease;
      direction: rtl;
    }
    .search-input:focus {
      outline: none;
      border-color: #2d8a3e;
    }
    .search-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1.2rem;
      color: #666;
    }
    .filter-row {
      display: grid;
      grid-template-columns: 1fr 1fr auto;
      gap: 1.5rem;
      align-items: end;
    }
    .filter-group {
      display: flex;
      flex-direction: column;
      text-align: right;
    }
    .filter-group label {
      margin-bottom: 0.5rem;
      color: #2d8a3e;
      font-weight: 500;
    }
    .filter-select {
      padding: 0.8rem;
      border: 2px solid #e8f5e8;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s ease;
      direction: rtl;
    }
    .filter-select:focus {
      outline: none;
      border-color: #2d8a3e;
    }
    .clear-btn {
      padding: 0.8rem 1.5rem;
      background: #ff6b6b;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.3s ease;
      font-weight: 500;
      height: fit-content;
    }
    .clear-btn:hover {
      background: #ff5252;
    }
    
    /* نتائج البحث */
    .results-info {
      text-align: center;
      margin-bottom: 1.5rem;
      color: #666;
      font-size: 1.1rem;
    }
    
    /* قائمة المطاعم */
    .restaurants-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 2rem;
    }
    .restaurant-card {
      background: white;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(45, 138, 62, 0.1);
      transition: all 0.3s ease;
      cursor: pointer;
      text-decoration: none;
      color: inherit;
      border: 2px solid #e8f5e8;
    }
    .restaurant-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 40px rgba(45, 138, 62, 0.2);
      border-color: #2d8a3e;
    }
    .restaurant-image {
      height: 180px;
      background: linear-gradient(135deg, #2d8a3e, #4caf50);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3.5rem;
    }
    .restaurant-info {
      padding: 1.5rem;
    }
    .restaurant-info h3 {
      color: #2d8a3e;
      margin-bottom: 0.8rem;
      font-size: 1.4rem;
    }
    .restaurant-category {
      color: #4caf50;
      font-weight: 500;
      margin-bottom: 1rem;
      background: #e8f5e8;
      padding: 0.3rem 0.8rem;
      border-radius: 15px;
      display: inline-block;
      font-size: 0.9rem;
    }
    .restaurant-location {
      margin-bottom: 1rem;
    }
    .restaurant-address {
      color: #666;
      margin-bottom: 0.3rem;
      font-size: 0.95rem;
    }
    .restaurant-city {
      color: #2d8a3e;
      font-weight: 500;
      font-size: 0.9rem;
    }
    .restaurant-rating {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.8rem;
    }
    .stars {
      color: #ffa502;
    }
    .rating {
      color: #333;
      font-weight: 500;
    }
    .restaurant-hours {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }
    .restaurant-phone {
      color: #666;
      font-size: 0.9rem;
    }
    
    /* loading وعدم وجود نتائج */
    .loading {
      text-align: center;
      padding: 4rem;
      color: #666;
      font-size: 1.2rem;
    }
    .no-results {
      text-align: center;
      padding: 4rem 2rem;
    }
    .no-results-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }
    .no-results h3 {
      color: #2d8a3e;
      margin-bottom: 1rem;
    }
    .no-results p {
      color: #666;
      margin-bottom: 2rem;
    }
    
    /* Responsive */
    @media (max-width: 768px) {
      .filter-row {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      .restaurants-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class RestaurantsComponent implements OnInit {
  restaurants: Restaurant[] = [];
  filteredRestaurants: Restaurant[] = [];
  loading = true;
  
  // Filter-Variablen
  searchText = '';
  selectedCategory = 'all';
  selectedCity = 'all';

  // Kategorien
  categories = [
    { value: 'all', label: 'جميع الأنواع' },
    { value: 'مشاوي', label: 'مشاوي' },
    { value: 'بيتزا', label: 'بيتزا' },
    { value: 'أكولات بحرية', label: 'أكولات بحرية' },
    { value: 'نباتي', label: 'نباتي' },
    { value: 'شاورما', label: 'شاورما' },
    { value: 'حلويات', label: 'حلويات' },
    { value: 'مأكولات شعبية', label: 'مأكولات شعبية' }
  ];

  // المدن السورية الكبيرة (أكثر من 100,000 نسمة)
  syrianCities = [
    { value: 'all', label: 'جميع المدن' },
    { value: 'دمشق', label: 'دمشق' },
    { value: 'حلب', label: 'حلب' },
    { value: 'حمص', label: 'حمص' },
    { value: 'حماة', label: 'حماة' },
    { value: 'اللاذقية', label: 'اللاذقية' },
    { value: 'دير الزور', label: 'دير الزور' },
    { value: 'الرقة', label: 'الرقة' },
    { value: 'درعا', label: 'درعا' },
    { value: 'السويداء', label: 'السويداء' },
    { value: 'القنيطرة', label: 'القنيطرة' },
    { value: 'طرطوس', label: 'طرطوس' },
    { value: 'الحسكة', label: 'الحسكة' },
    { value: 'منبج', label: 'منبج' },
    { value: 'القامشلي', label: 'القامشلي' },
    { value: 'رأس العين', label: 'رأس العين' },
    { value: 'أعزاز', label: 'أعزاز' },
    { value: 'الباب', label: 'الباب' },
    { value: 'سلمية', label: 'سلمية' },
    { value: 'تدمر', label: 'تدمر' },
    { value: 'عفرين', label: 'عفرين' },
    { value: 'اعتماد', label: 'اعتماد' },
    { value: 'جبلة', label: 'جبلة' },
    { value: 'بانياس', label: 'بانياس' },
    { value: 'صافيتا', label: 'صافيتا' }
  ];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadRestaurants();
  }

  loadRestaurants() {
    this.apiService.getRestaurants('ar').subscribe({
      next: (response: any) => {
        console.log('Backend response:', response);
        
        if (Array.isArray(response)) {
          this.restaurants = response;
        } else if (response.restaurants && Array.isArray(response.restaurants)) {
          this.restaurants = response.restaurants;
        } else {
          console.error('Unexpected response format:', response);
          this.restaurants = [];
        }
        
        this.filteredRestaurants = this.restaurants;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading restaurants:', err);
        this.loading = false;
        // Fallback zu Mock-Daten mit syrischen Städten
        this.restaurants = this.getMockRestaurants();
        this.filteredRestaurants = this.restaurants;
      }
    });
  }

  applyFilters() {
    if (!Array.isArray(this.restaurants)) {
      console.error('Restaurants is not an array:', this.restaurants);
      return;
    }

    this.filteredRestaurants = this.restaurants.filter(restaurant => {
      // Textsuche (Name oder Adresse)
      const matchesSearch = this.searchText === '' || 
        restaurant.name_ar.toLowerCase().includes(this.searchText.toLowerCase()) ||
        restaurant.address.toLowerCase().includes(this.searchText.toLowerCase());

      // Kategorie-Filter
      const matchesCategory = this.selectedCategory === 'all' || 
        restaurant.category === this.selectedCategory;

      // Stadt-Filter
      const matchesCity = this.selectedCity === 'all' || 
        (restaurant as any).city === this.selectedCity;

      return matchesSearch && matchesCategory && matchesCity;
    });
  }

  clearFilters() {
    this.searchText = '';
    this.selectedCategory = 'all';
    this.selectedCity = 'all';
    this.filteredRestaurants = this.restaurants;
  }

  // Mock-Daten mit syrischen Städten
  getMockRestaurants(): Restaurant[] {
    return [
      {
        id: 1,
        name_ar: 'مطعم الشام الدمشقي',
        name_en: 'Damascus Al Sham Restaurant',
        description_ar: 'أفضل المأكولات السورية التقليدية',
        description_en: 'Best traditional Syrian cuisine',
        category: 'مشاوي',
        address: 'شارع بغداد، باب توما',
        phone: '+963112345678',
        open_times: '9:00 ص - 11:00 م',
        rating: 4.5,
        is_active: true,
        city: 'دمشق'
      } as Restaurant & { city: string },
      {
        id: 2,
        name_ar: 'مطعم حلب الشهباء',
        name_en: 'Aleppo Al Shahba Restaurant',
        description_ar: 'كباب حلبي أصيل وأطباق شامية',
        description_en: 'Authentic Aleppo kebab and Levantine dishes',
        category: 'مشاوي',
        address: 'حي الجديدة، شارع الكورنيش',
        phone: '+963212345678',
        open_times: '10:00 ص - 12:00 ص',
        rating: 4.7,
        is_active: true,
        city: 'حلب'
      } as Restaurant & { city: string },
      
    ];
  }
}