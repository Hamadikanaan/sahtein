// app/services/cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Dish } from './api.service';

export interface CartItem {
  dish: Dish;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItems.asObservable();

  addToCart(dish: Dish, quantity: number = 1): void {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(item => item.dish.id === dish.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentItems.push({ dish, quantity });
    }

    this.cartItems.next([...currentItems]);
  }

  removeFromCart(dishId: number): void {
    const currentItems = this.cartItems.value.filter(item => item.dish.id !== dishId);
    this.cartItems.next(currentItems);
  }

  updateQuantity(dishId: number, quantity: number): void {
    const currentItems = this.cartItems.value;
    const item = currentItems.find(item => item.dish.id === dishId);
    
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(dishId);
      } else {
        item.quantity = quantity;
        this.cartItems.next([...currentItems]);
      }
    }
  }

  getTotal(): number {
    return this.cartItems.value.reduce((total, item) => 
      total + (item.dish.price * item.quantity), 0
    );
  }

  getItemCount(): number {
    return this.cartItems.value.reduce((count, item) => count + item.quantity, 0);
  }

  clearCart(): void {
    this.cartItems.next([]);
  }
}