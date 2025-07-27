// app/pages/home/home.component.ts - Mobile Optimized
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="home-container">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <div class="hero-logo">🍕</div>
          <h1 class="hero-title">صحتين</h1>
          <h2 class="hero-subtitle">منصة توصيل الطعام السوري</h2>
          <p class="hero-description">
            اطلب ألذ الأطباق السورية من أفضل المطاعم في جميع أنحاء سوريا
          </p>
          
          <div class="hero-actions">
            <a routerLink="/restaurants" class="cta-primary">
              <span class="cta-icon">🔍</span>
              تصفح المطاعم
            </a>
            <a routerLink="/auth-select" class="cta-secondary">
              <span class="cta-icon">👤</span>
              إنشاء حساب
            </a>
          </div>
          
          <div class="quick-stats">
            <div class="stat-item">
              <div class="stat-number">50+</div>
              <div class="stat-label">مطعم</div>
            </div>
            <div class="stat-divider">|</div>
            <div class="stat-item">
              <div class="stat-number">25+</div>
              <div class="stat-label">مدينة</div>
            </div>
            <div class="stat-divider">|</div>
            <div class="stat-item">
              <div class="stat-number">1000+</div>
              <div class="stat-label">طبق</div>
            </div>
          </div>
        </div>
        
        <!-- Floating food icons for visual appeal -->
        <div class="floating-icons">
          <div class="floating-icon" style="--delay: 0s; --duration: 3s;">🍔</div>
          <div class="floating-icon" style="--delay: 1s; --duration: 4s;">🌯</div>
          <div class="floating-icon" style="--delay: 2s; --duration: 3.5s;">🍕</div>
          <div class="floating-icon" style="--delay: 0.5s; --duration: 4.5s;">🥙</div>
          <div class="floating-icon" style="--delay: 1.5s; --duration: 3.2s;">🍰</div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features">
        <div class="container">
          <h2 class="section-title">لماذا صحتين؟</h2>
          
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">🚚</div>
              <h3>توصيل سريع</h3>
              <p>توصيل في أقل من 30 دقيقة لجميع أنحاء المدينة</p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">💰</div>
              <h3>دفع نقدي</h3>
              <p>ادفع عند الاستلام بالليرة السورية - لا حاجة لبطاقات</p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">⭐</div>
              <h3>مطاعم مميزة</h3>
              <p>أفضل المطاعم السورية المختارة بعناية</p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">🏢</div>
              <h3>تغطية واسعة</h3>
              <p>نخدم أكثر من 25 مدينة سورية</p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">📱</div>
              <h3>سهل الاستخدام</h3>
              <p>تطبيق مصمم خصيصاً للمستخدم العربي</p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">🔒</div>
              <h3>آمن وموثوق</h3>
              <p>معلوماتك محمية والخدمة موثوقة 100%</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Cities Section -->
      <section class="cities">
        <div class="container">
          <h2 class="section-title">المدن المتاحة</h2>
          <p class="section-subtitle">نقدم خدماتنا في أهم المدن السورية</p>
          
          <div class="cities-grid">
            <div class="city-card" *ngFor="let city of popularCities">
              <div class="city-flag">🏙️</div>
              <h4>{{ city.name }}</h4>
              <p>{{ city.restaurants }} مطعم</p>
            </div>
          </div>
          
          <a routerLink="/restaurants" class="view-all-btn">
            عرض جميع المدن
          </a>
        </div>
      </section>

      <!-- For Restaurants Section -->
      <section class="for-restaurants">
        <div class="container">
          <div class="restaurant-cta">
            <div class="restaurant-content">
              <h2>🏪 انضم كمطعم شريك</h2>
              <p>وصّل أطباقك لآلاف العملاء في جميع أنحاء سوريا</p>
              <ul class="benefits-list">
                <li>✅ زيادة المبيعات والأرباح</li>
                <li>✅ وصول لعملاء جدد</li>
                <li>✅ لوحة تحكم سهلة</li>
                <li>✅ دعم فني مستمر</li>
              </ul>
              <a routerLink="/restaurant-register" class="restaurant-join-btn">
                انضم الآن مجاناً
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-container {
      min-height: 100vh;
      background: #ffffff;
    }
    
    /* Hero Section */
    .hero {
      background: linear-gradient(135deg, #2d8a3e 0%, #4caf50 100%);
      min-height: 90vh;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      padding: 2rem 1rem;
    }
    .hero-content {
      text-align: center;
      color: white;
      z-index: 2;
      max-width: 600px;
    }
    .hero-logo {
      font-size: 4rem;
      margin-bottom: 1rem;
      animation: bounce 2s infinite;
    }
    .hero-title {
      font-size: 3rem;
      margin-bottom: 0.5rem;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
      font-weight: bold;
    }
    .hero-subtitle {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      opacity: 0.95;
    }
    .hero-description {
      font-size: 1.1rem;
      margin-bottom: 2rem;
      opacity: 0.9;
      line-height: 1.6;
    }
    .hero-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-bottom: 3rem;
      flex-wrap: wrap;
    }
    .cta-primary, .cta-secondary {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 2rem;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 600;
      font-size: 1.1rem;
      transition: all 0.3s ease;
      min-width: 160px;
      justify-content: center;
    }
    .cta-primary {
      background: #ffffff;
      color: #2d8a3e;
      box-shadow: 0 4px 15px rgba(255,255,255,0.3);
    }
    .cta-primary:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(255,255,255,0.4);
    }
    .cta-secondary {
      background: rgba(255,255,255,0.2);
      color: white;
      border: 2px solid rgba(255,255,255,0.5);
    }
    .cta-secondary:hover {
      background: rgba(255,255,255,0.3);
      transform: translateY(-3px);
    }
    .quick-stats {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin-top: 2rem;
    }
    .stat-item {
      text-align: center;
    }
    .stat-number {
      font-size: 1.5rem;
      font-weight: bold;
    }
    .stat-label {
      font-size: 0.9rem;
      opacity: 0.8;
    }
    .stat-divider {
      opacity: 0.5;
      font-size: 1.2rem;
    }
    
    /* Floating Icons Animation */
    .floating-icons {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
    .floating-icon {
      position: absolute;
      font-size: 2rem;
      opacity: 0.3;
      animation: float var(--duration, 3s) ease-in-out infinite;
      animation-delay: var(--delay, 0s);
    }
    .floating-icon:nth-child(1) { top: 20%; left: 10%; }
    .floating-icon:nth-child(2) { top: 30%; right: 15%; }
    .floating-icon:nth-child(3) { top: 60%; left: 20%; }
    .floating-icon:nth-child(4) { top: 70%; right: 10%; }
    .floating-icon:nth-child(5) { top: 40%; left: 50%; }
    
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-10px); }
      60% { transform: translateY(-5px); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(10deg); }
    }
    
    /* Container */
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    
    /* Features Section */
    .features {
      padding: 4rem 0;
      background: #f8f9fa;
    }
    .section-title {
      text-align: center;
      color: #2d8a3e;
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
    .section-subtitle {
      text-align: center;
      color: #666;
      font-size: 1.1rem;
      margin-bottom: 3rem;
    }
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
    }
    .feature-card {
      background: white;
      padding: 2rem;
      border-radius: 15px;
      text-align: center;
      box-shadow: 0 5px 20px rgba(45, 138, 62, 0.1);
      transition: transform 0.3s ease;
      border: 2px solid transparent;
    }
    .feature-card:hover {
      transform: translateY(-5px);
      border-color: #2d8a3e;
    }
    .feature-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    .feature-card h3 {
      color: #2d8a3e;
      margin-bottom: 1rem;
      font-size: 1.3rem;
    }
    .feature-card p {
      color: #666;
      line-height: 1.6;
    }
    
    /* Cities Section */
    .cities {
      padding: 4rem 0;
      background: white;
    }
    .cities-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }
    .city-card {
      background: linear-gradient(135deg, #e8f5e8, #ffffff);
      padding: 1.5rem;
      border-radius: 12px;
      text-align: center;
      border: 2px solid #e8f5e8;
      transition: all 0.3s ease;
    }
    .city-card:hover {
      border-color: #2d8a3e;
      transform: scale(1.02);
    }
    .city-flag {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
    .city-card h4 {
      color: #2d8a3e;
      margin-bottom: 0.3rem;
    }
    .city-card p {
      color: #666;
      font-size: 0.9rem;
    }
    .view-all-btn {
      display: block;
      width: fit-content;
      margin: 0 auto;
      background: #2d8a3e;
      color: white;
      padding: 1rem 2rem;
      border-radius: 10px;
      text-decoration: none;
      transition: background 0.3s ease;
    }
    .view-all-btn:hover {
      background: #1e5f2a;
    }
    
    /* For Restaurants Section */
    .for-restaurants {
      padding: 4rem 0;
      background: linear-gradient(135deg, #2d8a3e, #4caf50);
    }
    .restaurant-cta {
      background: rgba(255,255,255,0.1);
      border-radius: 20px;
      padding: 3rem;
      text-align: center;
      color: white;
      border: 2px solid rgba(255,255,255,0.2);
    }
    .restaurant-content h2 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    .restaurant-content p {
      font-size: 1.1rem;
      margin-bottom: 2rem;
      opacity: 0.9;
    }
    .benefits-list {
      list-style: none;
      padding: 0;
      margin: 2rem 0;
      text-align: right;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }
    .benefits-list li {
      padding: 0.5rem 0;
      font-size: 1rem;
    }
    .restaurant-join-btn {
      display: inline-block;
      background: white;
      color: #2d8a3e;
      padding: 1rem 2rem;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 600;
      font-size: 1.1rem;
      transition: all 0.3s ease;
    }
    .restaurant-join-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(255,255,255,0.3);
    }
    
    /* Mobile Optimizations */
    @media (max-width: 768px) {
      .hero {
        min-height: 80vh;
        padding: 1rem;
      }
      .hero-title {
        font-size: 2.5rem;
      }
      .hero-subtitle {
        font-size: 1.3rem;
      }
      .hero-actions {
        flex-direction: column;
        align-items: center;
      }
      .cta-primary, .cta-secondary {
        width: 100%;
        max-width: 280px;
      }
      .features-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
      .cities-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .restaurant-cta {
        padding: 2rem;
      }
      .section-title {
        font-size: 2rem;
      }
    }
    
    @media (max-width: 480px) {
      .hero-logo {
        font-size: 3rem;
      }
      .hero-title {
        font-size: 2rem;
      }
      .hero-subtitle {
        font-size: 1.1rem;
      }
      .quick-stats {
        flex-direction: column;
        gap: 0.5rem;
      }
      .stat-divider {
        display: none;
      }
      .cities-grid {
        grid-template-columns: 1fr;
      }
      .feature-card {
        padding: 1.5rem;
      }
    }
  `]
})
export class HomeComponent {
  popularCities = [
    { name: 'دمشق', restaurants: 15 },
    { name: 'حلب', restaurants: 12 },
    { name: 'حمص', restaurants: 8 },
    { name: 'حماة', restaurants: 6 },
    { name: 'اللاذقية', restaurants: 7 },
    { name: 'منبج', restaurants: 4 },
    { name: 'القامشلي', restaurants: 5 },
    { name: 'دير الزور', restaurants: 3 }
  ];
}