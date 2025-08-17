// app/app.routes.ts - ERWEITERT mit neuen Komponenten
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { AuthSelectComponent } from './pages/auth/auth-select/auth-select.component';
import { LoginSelectComponent } from './pages/auth/login-select/login-select.component';
import { RestaurantLoginComponent } from './pages/auth/restaurant-login/restaurant-login.component';
import { RestaurantRegisterComponent } from './pages/auth/restaurant-register/restaurant-register.component';
import { RestaurantsComponent } from './pages/restaurants/restaurants.component';
import { RestaurantDetailComponent } from './pages/restaurant-detail/restaurant-detail.component';
import { CartComponent } from './pages/cart/cart.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { FavoritesComponent } from './pages/favorites/favorites.component'; // ✅ NEU

import { AuthGuard } from './guards/auth.guard';
import { AdminPanelComponent } from './pages/admin/admin-panel/admin-panel.component';

// NEUE IMPORTS für User-Restaurant-Management
import { UserProfileComponent } from './pages/profile/user-profile.component';  // ✅ Dieser ist OK
import { RestaurantManagementComponent } from './pages/user/restaurant-management/restaurant-management.component';  // ✅ Dieser ist OK  
import { MenuManagementComponent } from './pages/user/menu-management/menu-management.component';  // ✅ Dieser ist OK
import { AddDishComponent } from './pages/user/add-dish/add-dish.component';  // ✅ Dieser ist OK

export const routes: Routes = [
  // Public Routes
  { path: '', component: HomeComponent },
  
  // New Auth Selection Routes
  { path: 'auth-select', component: AuthSelectComponent },
  { path: 'login-select', component: LoginSelectComponent },
  
  // Customer Auth
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  // Restaurant Auth
  { path: 'restaurant-login', component: RestaurantLoginComponent },
  { path: 'restaurant-register', component: RestaurantRegisterComponent },
  
  // Restaurant Management - KORRIGIERT!
  { path: 'restaurant-dashboard', redirectTo: '/user/restaurant-management' },
  { path: 'admin-panel', component: AdminPanelComponent },
  
  // Customer Pages
  { path: 'restaurants', component: RestaurantsComponent },
  { path: 'restaurant/:id', component: RestaurantDetailComponent },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'orders', component: OrdersComponent, canActivate: [AuthGuard] },

  { path: 'favorites', component: FavoritesComponent, canActivate: [AuthGuard] },
  
  // Profile Routes - ERWEITERT!
  { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard] },

  
  // User Restaurant Management Routes - NEU!
  { 
    path: 'user', 
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' }, // ← NEU
      { path: 'profile', component: UserProfileComponent },
      { path: 'restaurant-management', component: RestaurantManagementComponent },
      { path: 'menu-management', component: MenuManagementComponent },
      { path: 'add-dish', component: AddDishComponent },
      { path: 'edit-dish/:id', component: AddDishComponent }, // Wiederverwendung für Edit
      
      // Weitere User-Routes für später:
      { path: 'create-restaurant', redirectTo: '/restaurant-register' },
      { path: 'edit-profile', component: UserProfileComponent },
      { path: 'restaurant-orders', component: OrdersComponent }, // Temporär
      { path: 'restaurant-stats', component: RestaurantManagementComponent }, // Temporär
      { path: 'restaurant-analytics', component: RestaurantManagementComponent }, // Temporär
      { path: 'restaurant-finance', component: RestaurantManagementComponent }, // Temporär
      { path: 'restaurant-settings', component: RestaurantManagementComponent }, // Temporär
    ]
  },
  
  // Fallback
  { path: '**', redirectTo: '' }
];