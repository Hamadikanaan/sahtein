// app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService, User, Admin } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | Admin | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isAdminSubject = new BehaviorSubject<boolean>(false);
  public isAdmin$ = this.isAdminSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.loadStoredUser();
  }

  login(email: string, password: string): Observable<any> {
    return this.apiService.login(email, password).pipe(
      tap(response => {
        console.log('Login Response:', response);
        if (response.access_token) {
          localStorage.setItem('access_token', response.access_token);
          
          // Store user type info
          if (response.user_type) {
            localStorage.setItem('user_type', response.user_type);
          }
          
          // Set user data immediately from login response
          if (response.user) {
            this.currentUserSubject.next(response.user);
            this.isAdminSubject.next(false);
          } else if (response.admin) {
            this.currentUserSubject.next(response.admin);
            this.isAdminSubject.next(true);
          }
          
          // Also load fresh profile data
          this.loadUserProfile();
        }
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.apiService.register(userData).pipe(
      tap(response => {
        console.log('Register Response:', response);
        if (response.access_token) {
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('user_type', 'customer');
          
          if (response.user) {
            this.currentUserSubject.next(response.user);
            this.isAdminSubject.next(false);
          }
          
          this.loadUserProfile();
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_type');
    this.currentUserSubject.next(null);
    this.isAdminSubject.next(false);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getUserType(): string | null {
    return localStorage.getItem('user_type');
  }

  isAdmin(): boolean {
    return this.getUserType() === 'admin';
  }

  isCustomer(): boolean {
    return this.getUserType() === 'customer';
  }

  getCurrentUser(): User | Admin | null {
    return this.currentUserSubject.value;
  }

  private loadUserProfile(): void {
    this.apiService.getProfile().subscribe({
      next: (response) => {
        console.log('Profile Load Response:', response);
        
        if (response.user) {
          // Regular user (customer)
          this.currentUserSubject.next(response.user);
          this.isAdminSubject.next(false);
          localStorage.setItem('user_type', 'customer');
        } else if (response.admin) {
          // Admin user
          this.currentUserSubject.next(response.admin);
          this.isAdminSubject.next(true);
          localStorage.setItem('user_type', 'admin');
        } else {
          console.error('Invalid profile response:', response);
          this.logout();
        }
      },
      error: (error) => {
        console.error('Profile load error:', error);
        this.logout();
      }
    });
  }

  private loadStoredUser(): void {
    if (this.isAuthenticated()) {
      this.loadUserProfile();
    }
  }
}