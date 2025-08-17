// app/pages/favorites/favorites.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FavoritesService, FavoriteRestaurant } from '../../services/favorites.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="favorites-container">
      <div class="favorites-header">
        <h1>المطاعم المفضلة</h1>
        <p>مطاعمك المفضلة في مكان واحد</p>
      </div>

      <div class="favorites-content">
        <!-- Loading State -->
        <div *ngIf="loading" class="loading-state">
          <div class="loading-spinner">⏳</div>
          <p>جاري تحميل المطاعم المفضلة...</p>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading && favorites.length === 0" class="empty-state">
          <div class="empty-icon">💔</div>
          <h3>لا توجد مطاعم مفضلة</h3>
          <p>أضف مطاعمك المفضلة لتسهيل الوصول إليها</p>
          <a routerLink="/restaurants" class="browse-restaurants-btn">
            تصفح المطاعم
          </a>
        </div>

        <!-- Favorites List -->
        <div *ngIf="!loading && favorites.length > 0" class="favorites-grid">
          <div *ngFor="let favorite of favorites" class="restaurant-card">
            <div class="restaurant-info">
              <div class="restaurant-header">
                <h3>{{ favorite.restaurant.name_ar }}</h3>
                <button 
                  class="remove-favorite-btn" 
                  (click)="removeFromFavorites(favorite.restaurant_id)"
                  title="إزالة من المفضلة">
                  ❌
                </button>
              </div>
              
              <p class="restaurant-description">{{ favorite.restaurant.description_ar }}</p>
              
              <div class="restaurant-details">
                <div class="detail-item">
                  <span class="detail-icon">🏷️</span>
                  <span>{{ getCategoryText(favorite.restaurant.category) }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-icon">📍</span>
                  <span>{{ favorite.restaurant.address }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-icon">⭐</span>
                  <span>{{ favorite.restaurant.rating || 'غير مقيم' }}</span>
                </div>
              </div>

              <div class="restaurant-actions">
                <a 
                  [routerLink]="['/restaurant', favorite.restaurant_id]" 
                  class="view-menu-btn">
                  عرض القائمة
                </a>
                <button 
                  class="order-now-btn"
                  (click)="goToRestaurant(favorite.restaurant_id)">
                  اطلب الآن
                </button>
              </div>
            </div>

            <div class="favorite-date">
              <small>أضيف في {{ formatDate(favorite.created_at) }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .favorites-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      background: #f8f9fa;
      min-height: 100vh;
    }

    .favorites-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .favorites-header h1 {
      color: #2d8a3e;
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }

    .favorites-header p {
      color: #666;
      font-size: 1.1rem;
    }

    /* Loading State */
    .loading-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #666;
    }

    .loading-spinner {
      font-size: 3rem;
      margin-bottom: 1rem;
      animation: spin 2s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(45, 138, 62, 0.1);
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      color: #2d8a3e;
      margin-bottom: 1rem;
      font-size: 1.5rem;
    }

    .empty-state p {
      color: #666;
      margin-bottom: 2rem;
    }

    .browse-restaurants-btn {
      background: linear-gradient(135deg, #2d8a3e, #4caf50);
      color: white;
      padding: 1rem 2rem;
      border-radius: 10px;
      text-decoration: none;
      display: inline-block;
      transition: transform 0.3s ease;
    }

    .browse-restaurants-btn:hover {
      transform: translateY(-2px);
      color: white;
    }

    /* Favorites Grid */
    .favorites-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 2rem;
    }

    .restaurant-card {
      background: white;
      border-radius: 15px;
      box-shadow: 0 5px 20px rgba(45, 138, 62, 0.1);
      overflow: hidden;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .restaurant-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 40px rgba(45, 138, 62, 0.2);
    }

    .restaurant-info {
      padding: 1.5rem;
    }

    .restaurant-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .restaurant-header h3 {
      color: #2d8a3e;
      font-size: 1.3rem;
      margin: 0;
      flex: 1;
    }

    .remove-favorite-btn {
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      padding: 0.2rem;
      transition: transform 0.2s ease;
    }

    .remove-favorite-btn:hover {
      transform: scale(1.2);
    }

    .restaurant-description {
      color: #666;
      margin-bottom: 1rem;
      font-size: 0.9rem;
      line-height: 1.4;
    }

    .restaurant-details {
      margin-bottom: 1.5rem;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
      color: #555;
    }

    .detail-icon {
      font-size: 1rem;
    }

    .restaurant-actions {
      display: flex;
      gap: 1rem;
    }

    .view-menu-btn {
      flex: 1;
      background: #f8f9fa;
      color: #2d8a3e;
      border: 2px solid #2d8a3e;
      padding: 0.8rem;
      border-radius: 8px;
      text-decoration: none;
      text-align: center;
      transition: all 0.3s ease;
    }

    .view-menu-btn:hover {
      background: #2d8a3e;
      color: white;
    }

    .order-now-btn {
      flex: 1;
      background: #2d8a3e;
      color: white;
      border: none;
      padding: 0.8rem;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.3s ease;
    }

    .order-now-btn:hover {
      background: #268a37;
    }

    .favorite-date {
      background: #f8f9fa;
      padding: 0.8rem 1.5rem;
      border-top: 1px solid #e9ecef;
      text-align: center;
    }

    .favorite-date small {
      color: #888;
      font-size: 0.8rem;
    }

    @media (max-width: 768px) {
      .favorites-container {
        padding: 1rem;
      }

      .favorites-header h1 {
        font-size: 2rem;
      }

      .favorites-grid {
        grid-template-columns: 1fr;
      }

      .restaurant-actions {
        flex-direction: column;
      }
    }
  `]
})
export class FavoritesComponent implements OnInit {
  favorites: FavoriteRestaurant[] = [];
  loading = true;

  constructor(
    private favoritesService: FavoritesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.loading = true;
    this.favoritesService.getUserFavorites().subscribe({
      next: (favorites) => {
        this.favorites = favorites;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading favorites:', error);
        this.loading = false;
      }
    });
  }

  removeFromFavorites(restaurantId: number) {
    this.favoritesService.removeFromFavorites(restaurantId).subscribe({
      next: () => {
        this.favorites = this.favorites.filter(fav => fav.restaurant_id !== restaurantId);
      },
      error: (error) => {
        console.error('Error removing favorite:', error);
      }
    });
  }

  goToRestaurant(restaurantId: number) {
    this.router.navigate(['/restaurant', restaurantId]);
  }

  getCategoryText(category: string): string {
    const categoryMap: { [key: string]: string } = {
      'syrian': 'مأكولات شامية',
      'lebanese': 'مأكولات لبنانية',
      'turkish': 'مأكولات تركية',
      'pizza': 'بيتزا',
      'burger': 'برجر',
      'sweets': 'حلويات',
      'traditional': 'مأكولات تراثية',
      'fastfood': 'وجبات سريعة'
    };
    return categoryMap[category] || category;
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA');
  }
}