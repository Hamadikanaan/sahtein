// app/app.routes.ts - VOLLSTÄNDIG mit allen Routes
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
import { ProfileComponent } from './pages/profile/profile.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminPanelComponent } from './pages/admin/admin-panel/admin-panel.component';

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
  
  // Restaurant Management (temporarily redirect until components exist)
  { path: 'restaurant-dashboard', redirectTo: '/restaurants' },
  { path: 'admin-panel', component: AdminPanelComponent },
  
  // Customer Pages
  { path: 'restaurants', component: RestaurantsComponent },
  { path: 'restaurant/:id', component: RestaurantDetailComponent },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'orders', component: OrdersComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  
  // Fallback
  { path: '**', redirectTo: '' }
];