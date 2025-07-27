// app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at?: string;
  is_active?: boolean;
}

export interface Admin {
  id: number;
  username: string;
  role: string;
  is_active: boolean;
  status: string;
  restaurant_id?: number;
  created_at?: string;
  last_login?: string;
  restaurant?: Restaurant;
}

export interface ProfileResponse {
  user?: User;
  admin?: Admin;
}

export interface Restaurant {
  id: number;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  category: string;
  address: string;
  phone: string;
  open_times: string;
  rating: number;
  is_active: boolean;
  city?: string; // Hinzugefügt für syrische Städte
}

export interface Dish {
  id: number;
  restaurant_id: number;
  name_ar: string;
  name_en: string;
  name?: string;        // ✅ Hinzufügen
  description: string;
  description_ar?: string;  // ✅ Hinzufügen  
  description_en?: string;  // ✅ Hinzufügen
  price: number;
  ingredients: string;
  ingredients_ar?: string;  // ✅ Hinzufügen
  ingredients_en?: string;  // ✅ Hinzufügen
  photo_url: string;
  is_available: boolean;
  category?: string;    // ✅ Hinzufügen - Das fehlende Feld!
  created_at?: string;  // ✅ Hinzufügen
  updated_at?: string;  // ✅ Hinzufügen
}

export interface Order {
  id: number;
  user_id: number;
  restaurant_id: number;
  status: string;
  total_price: number;
  delivery_address: string;
  payment_method: string;
  created_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  dish_id: number;
  quantity: number;
  price: number;
  dish: Dish;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  // Auth
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, { email, password });
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, userData);
  }

  getProfile(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`${this.baseUrl}/auth/profile`);
  }

  // Restaurants
  getRestaurants(lang: string = 'ar'): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(`${this.baseUrl}/restaurants?lang=${lang}`);
  }

  getRestaurant(id: number, lang: string = 'ar'): Observable<Restaurant> {
    return this.http.get<Restaurant>(`${this.baseUrl}/restaurants/${id}?lang=${lang}`);
  }

  // Orders
  createOrder(orderData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/orders`, orderData);
  }

  getUserOrders(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/orders/user`);
  }

  getUserOrderStats(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/orders/stats/user`);
  }

  getOrder(orderId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/orders/${orderId}`);
  }

  updateOrderStatus(orderId: number, status: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/orders/${orderId}/status`, { status });
  }

  getRestaurantOrders(restaurantId: number, status?: string): Observable<any> {
    const params = status ? `?status=${status}` : '';
    return this.http.get<any>(`${this.baseUrl}/orders/restaurant/${restaurantId}${params}`);
  }

  getRestaurantOrderStats(restaurantId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/orders/stats/restaurant/${restaurantId}`);
  }

  // Admin APIs
  getRestaurantApplications(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/restaurant-applications`);
  }

  approveRestaurantApplication(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/restaurant-applications/${id}/approve`, {});
  }

  rejectRestaurantApplication(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/restaurant-applications/${id}/reject`, {});
  }

  // Restaurant Registration
  registerRestaurant(restaurantData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/restaurant/register`, restaurantData);
  }

  // Dishes
  getRestaurantDishes(restaurantId: number, lang: string = 'ar'): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/dishes/restaurant/${restaurantId}?lang=${lang}`);
  }

  getDish(dishId: number, lang: string = 'ar'): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/dishes/${dishId}?lang=${lang}`);
  }

  createDish(dishData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/dishes`, dishData);
  }

  updateDish(dishId: number, dishData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/dishes/${dishId}`, dishData);
  }

  deleteDish(dishId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/dishes/${dishId}`);
  }

  toggleDishAvailability(dishId: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/dishes/${dishId}/toggle`, {});
  }

  getRestaurantDishStats(restaurantId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/dishes/restaurant/${restaurantId}/stats`);
  }
}