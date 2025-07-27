// app/pages/cart/cart.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="cart-container">
      <h1>سلة التسوق</h1>
      
      <div *ngIf="cartItems.length > 0; else emptyCart" class="cart-content">
        <div class="cart-items">
          <div *ngFor="let item of cartItems" class="cart-item">
            <div class="item-image">🍽️</div>
            <div class="item-info">
              <h3>{{ item.dish.name_ar }}</h3>
              <p class="item-price">{{ item.dish.price }} س.ل</p>
            </div>
            <div class="item-controls">
              <button (click)="decreaseQuantity(item)" class="qty-btn">-</button>
              <span class="quantity">{{ item.quantity }}</span>
              <button (click)="increaseQuantity(item)" class="qty-btn">+</button>
            </div>
            <div class="item-total">
              {{ item.dish.price * item.quantity }} س.ل
            </div>
            <button (click)="removeItem(item.dish.id)" class="remove-btn">🗑️</button>
          </div>
        </div>
        
        <div class="cart-summary">
          <div class="total-section">
            <h3>ملخص الطلب</h3>
            <div class="total-line">
              <span>المجموع الفرعي:</span>
              <span>{{ getTotal() }} س.ل</span>
            </div>
            <div class="total-line">
              <span>رسوم التوصيل:</span>
              <span>2000 س.ل</span>
            </div>
            <div class="total-line final-total">
              <span>المجموع النهائي:</span>
              <span>{{ getTotal() + 2000 }} س.ل</span>
            </div>
          </div>
          
          <button (click)="proceedToCheckout()" class="checkout-btn">
            إتمام الطلب
          </button>
        </div>
      </div>
      
      <ng-template #emptyCart>
        <div class="empty-cart">
          <div class="empty-icon">🛒</div>
          <h2>سلة التسوق فارغة</h2>
          <p>أضف بعض الأطباق اللذيذة لتبدأ طلبك</p>
          <a routerLink="/restaurants" class="browse-btn">تصفح المطاعم</a>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .cart-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 2rem;
    }
    .cart-container h1 {
      text-align: center;
      color: #333;
      margin-bottom: 2rem;
    }
    .cart-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
    }
    .cart-items {
      background: white;
      border-radius: 15px;
      padding: 1.5rem;
      box-shadow: 0 8px 25px rgba(0,0,0,0.1);
    }
    .cart-item {
      display: grid;
      grid-template-columns: 80px 1fr auto auto auto;
      gap: 1rem;
      align-items: center;
      padding: 1rem 0;
      border-bottom: 1px solid #eee;
    }
    .cart-item:last-child {
      border-bottom: none;
    }
    .item-image {
      width: 60px;
      height: 60px;
      background: linear-gradient(45deg, #667eea, #764ba2);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }
    .item-info h3 {
      color: #333;
      margin-bottom: 0.5rem;
    }
    .item-price {
      color: #666;
      font-size: 0.9rem;
    }
    .item-controls {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .qty-btn {
      width: 30px;
      height: 30px;
      border: 1px solid #ddd;
      background: white;
      border-radius: 5px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .qty-btn:hover {
      background: #f5f5f5;
    }
    .quantity {
      min-width: 30px;
      text-align: center;
      font-weight: 500;
    }
    .item-total {
      font-weight: bold;
      color: #ff4757;
    }
    .remove-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.2rem;
      padding: 0.5rem;
    }
    .remove-btn:hover {
      opacity: 0.7;
    }
    .cart-summary {
      background: white;
      border-radius: 15px;
      padding: 1.5rem;
      box-shadow: 0 8px 25px rgba(0,0,0,0.1);
      height: fit-content;
    }
    .total-section h3 {
      color: #333;
      margin-bottom: 1rem;
      text-align: center;
    }
    .total-line {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      color: #666;
    }
    .final-total {
      border-top: 1px solid #eee;
      padding-top: 0.5rem;
      margin-top: 1rem;
      font-weight: bold;
      color: #333;
      font-size: 1.1rem;
    }
    .checkout-btn {
      width: 100%;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border: none;
      padding: 1rem;
      border-radius: 10px;
      font-size: 1.1rem;
      cursor: pointer;
      margin-top: 1rem;
      transition: transform 0.3s ease;
    }
    .checkout-btn:hover {
      transform: translateY(-2px);
    }
    .empty-cart {
      text-align: center;
      padding: 4rem 2rem;
    }
    .empty-icon {
      font-size: 5rem;
      margin-bottom: 1rem;
    }
    .empty-cart h2 {
      color: #333;
      margin-bottom: 1rem;
    }
    .empty-cart p {
      color: #666;
      margin-bottom: 2rem;
    }
    .browse-btn {
      display: inline-block;
      background: #667eea;
      color: white;
      padding: 1rem 2rem;
      text-decoration: none;
      border-radius: 10px;
      transition: background 0.3s ease;
    }
    .browse-btn:hover {
      background: #5a67d8;
    }
    @media (max-width: 768px) {
      .cart-content {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
  }

  increaseQuantity(item: CartItem) {
    this.cartService.updateQuantity(item.dish.id, item.quantity + 1);
  }

  decreaseQuantity(item: CartItem) {
    this.cartService.updateQuantity(item.dish.id, item.quantity - 1);
  }

  removeItem(dishId: number) {
    this.cartService.removeFromCart(dishId);
  }

  getTotal(): number {
    return this.cartService.getTotal();
  }

  proceedToCheckout() {
    alert('سيتم توجيهك لصفحة الدفع قريباً!');
  }
}