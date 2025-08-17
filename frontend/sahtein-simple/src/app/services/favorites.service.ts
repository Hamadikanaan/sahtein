// app/services/favorites.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface FavoriteRestaurant {
  id: number;
  restaurant_id: number;
  user_id: number;
  created_at: string;
  restaurant: {
    id: number;
    name_ar: string;
    name_en: string;
    description_ar: string;
    category: string;
    address: string;
    phone: string;
    rating: number;
    is_active: boolean;
    city: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private baseUrl = 'http://localhost:5000/api';
  private favoritesSubject = new BehaviorSubject<FavoriteRestaurant[]>([]);
  public favorites$ = this.favoritesSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Get user's favorite restaurants
  getUserFavorites(): Observable<FavoriteRestaurant[]> {
    return this.http.get<FavoriteRestaurant[]>(`${this.baseUrl}/favorites`).pipe(
      tap(favorites => {
        this.favoritesSubject.next(favorites);
      })
    );
  }

  // Add restaurant to favorites
  addToFavorites(restaurantId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/favorites`, { restaurant_id: restaurantId }).pipe(
      tap(() => {
        // Reload favorites after adding
        this.getUserFavorites().subscribe();
      })
    );
  }

  // Remove restaurant from favorites
  removeFromFavorites(restaurantId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/favorites/${restaurantId}`).pipe(
      tap(() => {
        // Reload favorites after removing
        this.getUserFavorites().subscribe();
      })
    );
  }

  // Check if restaurant is in favorites
  isRestaurantFavorite(restaurantId: number): boolean {
    const favorites = this.favoritesSubject.value;
    return favorites.some(fav => fav.restaurant_id === restaurantId);
  }

  // Toggle favorite status
  toggleFavorite(restaurantId: number): Observable<any> {
    if (this.isRestaurantFavorite(restaurantId)) {
      return this.removeFromFavorites(restaurantId);
    } else {
      return this.addToFavorites(restaurantId);
    }
  }

  // Get current favorites count
  getFavoritesCount(): number {
    return this.favoritesSubject.value.length;
  }

  // Clear favorites (for logout)
  clearFavorites(): void {
    this.favoritesSubject.next([]);
  }
}