// app/components/navbar/navbar.component.ts - Improved Mobile Menu
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="nav-container">
        <!-- Logo -->
        <a routerLink="/" class="nav-brand">
          🍕 صحتين
        </a>
        
        <!-- Desktop Navigation -->
        <div class="nav-links desktop-nav">
          <a routerLink="/restaurants" class="nav-link">المطاعم</a>
          
          <!-- Customer Links (when logged in as customer) -->
          <ng-container *ngIf="isCustomerLoggedIn()">
            <a routerLink="/cart" class="nav-link cart-link">
              🛒 السلة
              <span *ngIf="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
            </a>
            <a routerLink="/orders" class="nav-link">طلباتي</a>
            <a routerLink="/profile" class="nav-link">الملف الشخصي</a>
            <button (click)="logout()" class="nav-link logout-btn">خروج</button>
          </ng-container>
          
          <!-- Restaurant Links (when logged in as restaurant) -->
          <ng-container *ngIf="isRestaurantLoggedIn()">
            <a routerLink="/user/restaurant-management" class="nav-link">لوحة التحكم</a>
            <a routerLink="/user/restaurant-orders" class="nav-link">الطلبات</a>
            <button (click)="logout()" class="nav-link logout-btn">خروج</button>
          </ng-container>
          
          <!-- Guest Links -->
          <ng-container *ngIf="!isAuthenticated()">
            <a routerLink="/auth-select" class="nav-link register-btn">تسجيل</a>
            <a routerLink="/login" class="nav-link">دخول</a>
          </ng-container>
        </div>
        
        <!-- Mobile Navigation -->
        <div class="mobile-nav">
          <!-- Cart Badge for Mobile -->
          <a *ngIf="isCustomerLoggedIn()" routerLink="/cart" class="mobile-cart">
            🛒
            <span *ngIf="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
          </a>
          
          <!-- Burger Button -->
          <button 
            class="burger-btn" 
            (click)="toggleMobileMenu()"
            [class.active]="isMobileMenuOpen"
            aria-label="فتح القائمة"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
      
      <!-- Mobile Menu Overlay -->
      <div class="mobile-overlay" [class.show]="isMobileMenuOpen" (click)="closeMobileMenu()"></div>
      
      <!-- Mobile Menu -->
      <div class="mobile-menu" [class.open]="isMobileMenuOpen">
        <div class="mobile-header">
          <div class="mobile-logo">🍕 صحتين</div>
          <button class="close-btn" (click)="closeMobileMenu()" aria-label="إغلاق القائمة">
            ✕
          </button>
        </div>
        
        <div class="mobile-content">
          <!-- Main Navigation -->
          <div class="menu-section">
            <a routerLink="/" (click)="closeMobileMenu()" class="mobile-link">
              <span class="link-icon">🏠</span>
              الرئيسية
            </a>
            <a routerLink="/restaurants" (click)="closeMobileMenu()" class="mobile-link">
              <span class="link-icon">🍽️</span>
              تصفح المطاعم
            </a>
          </div>
          
          <!-- Customer Menu -->
          <ng-container *ngIf="isCustomerLoggedIn()">
            <div class="menu-section">
              <div class="section-title">حسابي</div>
              <a routerLink="/cart" (click)="closeMobileMenu()" class="mobile-link">
                <span class="link-icon">🛒</span>
                السلة
                <span *ngIf="cartCount > 0" class="notification-badge">{{ cartCount }}</span>
              </a>
              <a routerLink="/orders" (click)="closeMobileMenu()" class="mobile-link">
                <span class="link-icon">📦</span>
                طلباتي
              </a>
              <a routerLink="/profile" (click)="closeMobileMenu()" class="mobile-link">
                <span class="link-icon">👤</span>
                الملف الشخصي
              </a>
            </div>
            
            <div class="menu-section">
              <button (click)="logout()" class="mobile-link logout-link">
                <span class="link-icon">🚪</span>
                تسجيل خروج
              </button>
            </div>
          </ng-container>
          
          <!-- Restaurant Menu -->
          <ng-container *ngIf="isRestaurantLoggedIn()">
            <div class="menu-section">
              <div class="section-title">إدارة المطعم</div>
              <a routerLink="/user/restaurant-management" (click)="closeMobileMenu()" class="mobile-link">
              <span class="link-icon">📊</span>
              لوحة التحكم
            </a>
            <a routerLink="/user/restaurant-orders" (click)="closeMobileMenu()" class="mobile-link">
              <span class="link-icon">📋</span>
              الطلبات
            </a>
            <a routerLink="/user/menu-management" (click)="closeMobileMenu()" class="mobile-link">
              <span class="link-icon">🍽️</span>
              إدارة القائمة
            </a>
            </div>
            
            <div class="menu-section">
              <button (click)="logout()" class="mobile-link logout-link">
                <span class="link-icon">🚪</span>
                تسجيل خروج
              </button>
            </div>
          </ng-container>
          
          <!-- Guest Menu -->
          <ng-container *ngIf="!isAuthenticated()">
            <div class="menu-section">
              <div class="section-title">الحساب</div>
              <a routerLink="/auth-select" (click)="closeMobileMenu()" class="mobile-link primary-link">
                <span class="link-icon">✨</span>
                إنشاء حساب جديد
              </a>
              <a routerLink="/login" (click)="closeMobileMenu()" class="mobile-link">
                <span class="link-icon">🔑</span>
                تسجيل دخول
              </a>
            </div>
          </ng-container>
          
          <!-- Admin Menu -->
          <ng-container *ngIf="isAdminLoggedIn()">
            <div class="menu-section">
              <div class="section-title">الإدارة</div>
              <a routerLink="/admin-panel" (click)="closeMobileMenu()" class="mobile-link">
                <span class="link-icon">⚙️</span>
                لوحة الإدارة
              </a>
            </div>
            
            <div class="menu-section">
              <button (click)="logout()" class="mobile-link logout-link">
                <span class="link-icon">🚪</span>
                تسجيل خروج
              </button>
            </div>
          </ng-container>
        </div>
        
        <!-- Footer Info -->
        <div class="mobile-footer">
          <div class="app-info">
            <div class="version">صحتين v1.0</div>
            <div class="tagline">منصة توصيل الطعام السوري</div>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: #ffffff;
      box-shadow: 0 2px 15px rgba(45, 138, 62, 0.15);
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      padding: 1rem 0;
    }
    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 1rem;
    }
    .nav-brand {
      font-size: 1.5rem;
      font-weight: bold;
      color: #2d8a3e;
      text-decoration: none;
    }
    
    /* Desktop Navigation */
    .desktop-nav {
      display: flex;
      gap: 1.5rem;
      align-items: center;
    }
    .nav-link {
      color: #333;
      text-decoration: none;
      font-weight: 500;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      transition: all 0.3s ease;
      position: relative;
      border: none;
      background: none;
      cursor: pointer;
    }
    .nav-link:hover {
      background: #2d8a3e;
      color: white;
    }
    .register-btn {
      background: #2d8a3e;
      color: white;
    }
    .register-btn:hover {
      background: #1e5f2a;
    }
    .cart-link {
      position: relative;
    }
    .cart-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      background: #ff4757;
      color: white;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7rem;
      font-weight: bold;
    }
    
    /* Mobile Navigation */
    .mobile-nav {
      display: none;
      align-items: center;
      gap: 1rem;
    }
    .mobile-cart {
      position: relative;
      font-size: 1.5rem;
      text-decoration: none;
      color: #2d8a3e;
    }
    
    /* Burger Button */
    .burger-btn {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 30px;
      height: 30px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      position: relative;
    }
    .burger-btn span {
      width: 100%;
      height: 3px;
      background: #2d8a3e;
      margin: 2px 0;
      transition: all 0.3s ease;
      border-radius: 2px;
    }
    .burger-btn.active span:nth-child(1) {
      transform: rotate(45deg) translate(6px, 6px);
    }
    .burger-btn.active span:nth-child(2) {
      opacity: 0;
    }
    .burger-btn.active span:nth-child(3) {
      transform: rotate(-45deg) translate(6px, -6px);
    }
    
    /* Mobile Menu Overlay */
    .mobile-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1001;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }
    .mobile-overlay.show {
      opacity: 1;
      visibility: visible;
    }
    
    /* Mobile Menu */
    .mobile-menu {
      position: fixed;
      top: 0;
      right: -100%;
      width: 320px;
      max-width: 85vw;
      height: 100vh;
      background: #ffffff;
      box-shadow: -5px 0 25px rgba(0, 0, 0, 0.15);
      transition: right 0.3s ease;
      z-index: 1002;
      overflow-y: auto;
      direction: rtl;
    }
    .mobile-menu.open {
      right: 0;
    }
    
    /* Mobile Header */
    .mobile-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      background: linear-gradient(135deg, #2d8a3e, #4caf50);
      color: white;
      position: sticky;
      top: 0;
      z-index: 10;
    }
    .mobile-logo {
      font-size: 1.3rem;
      font-weight: bold;
    }
    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: white;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 50%;
      transition: background 0.3s ease;
    }
    .close-btn:hover {
      background: rgba(255, 255, 255, 0.2);
    }
    
    /* Mobile Content */
    .mobile-content {
      padding: 1rem 0;
    }
    .menu-section {
      margin-bottom: 1.5rem;
      border-bottom: 1px solid #f0f0f0;
      padding-bottom: 1rem;
    }
    .menu-section:last-child {
      border-bottom: none;
      margin-bottom: 0;
    }
    .section-title {
      font-size: 0.9rem;
      font-weight: 600;
      color: #2d8a3e;
      padding: 0.5rem 1.5rem;
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    /* Mobile Links */
    .mobile-link {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.5rem;
      color: #333;
      text-decoration: none;
      border: none;
      background: none;
      width: 100%;
      text-align: right;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 1rem;
      position: relative;
    }
    .mobile-link:hover,
    .mobile-link:focus {
      background: #f8f9fa;
      color: #2d8a3e;
    }
    .mobile-link.primary-link {
      background: linear-gradient(135deg, #2d8a3e, #4caf50);
      color: white;
      margin: 0 1rem;
      border-radius: 12px;
      font-weight: 600;
    }
    .mobile-link.primary-link:hover {
      background: linear-gradient(135deg, #1e5f2a, #388e3c);
      transform: translateY(-1px);
    }
    .mobile-link.logout-link {
      color: #ff4757;
    }
    .mobile-link.logout-link:hover {
      background: #fff1f1;
      color: #ff3742;
    }
    
    .link-icon {
      font-size: 1.2rem;
      min-width: 24px;
      text-align: center;
    }
    .notification-badge {
      background: #ff4757;
      color: white;
      padding: 0.2rem 0.6rem;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: bold;
      margin-left: auto;
    }
    
    /* Mobile Footer */
    .mobile-footer {
      margin-top: auto;
      padding: 1.5rem;
      background: #f8f9fa;
      border-top: 1px solid #e9ecef;
    }
    .app-info {
      text-align: center;
    }
    .version {
      font-size: 0.9rem;
      color: #2d8a3e;
      font-weight: 600;
    }
    .tagline {
      font-size: 0.8rem;
      color: #666;
      margin-top: 0.2rem;
    }
    
    /* Responsive Breakpoints */
    @media (max-width: 768px) {
      .desktop-nav {
        display: none;
      }
      .mobile-nav {
        display: flex;
      }
      .nav-brand {
        font-size: 1.3rem;
      }
    }
    
    /* Small Mobile Optimization */
    @media (max-width: 480px) {
      .mobile-menu {
        width: 100vw;
        max-width: 100vw;
      }
      .mobile-header {
        padding: 1rem;
      }
      .mobile-logo {
        font-size: 1.1rem;
      }
      .mobile-link {
        padding: 0.8rem 1rem;
      }
    }
    
    /* Smooth scrolling for mobile menu */
    .mobile-menu {
      scroll-behavior: smooth;
    }
    
    /* iOS Safari specific fixes */
    @supports (-webkit-touch-callout: none) {
      .mobile-menu {
        -webkit-overflow-scrolling: touch;
      }
    }
  `]
})
export class NavbarComponent implements OnInit {
  currentUser$: any;
  cartCount = 0;
  isMobileMenuOpen = false;
  userType: 'customer' | 'restaurant' | 'admin' | null = null;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser$ = this.authService.currentUser$;
    
    this.cartService.cartItems$.subscribe(items => {
      this.cartCount = this.cartService.getItemCount();
    });

    // User type detection - FIXED
        // User type detection - SIMPLIFIED
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        const userTypeFromStorage = localStorage.getItem('user_type');
        console.log('User type from storage:', userTypeFromStorage);
        
        if (userTypeFromStorage === 'customer') {
          this.userType = 'customer';
        } else {
          this.userType = 'restaurant'; // Alle anderen als Restaurant
        }
        
        console.log('Final userType set to:', this.userType);
      } else {
        this.userType = null;
      }
    });
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    
    // Prevent body scroll when menu is open
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    document.body.style.overflow = '';
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  isCustomerLoggedIn(): boolean {
    return this.isAuthenticated() && this.userType === 'customer';
  }

  isRestaurantLoggedIn(): boolean {
    return this.isAuthenticated() && this.userType === 'restaurant';
  }

  isAdminLoggedIn(): boolean {
    return this.isAuthenticated() && this.userType === 'admin';
  }

  logout() {
    this.authService.logout();
    this.userType = null;
    this.closeMobileMenu();
    this.router.navigate(['/']);
  }
}