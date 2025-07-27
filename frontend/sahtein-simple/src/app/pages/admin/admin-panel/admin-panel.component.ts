// app/pages/admin/admin-panel/admin-panel.component.ts - VOLLSTÄNDIG
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface RestaurantApplication {
  id: number;
  username: string;
  restaurant: {
    name_ar: string;
    name_en: string;
    description_ar: string;
    description_en: string;
    category: string;
    city: string;
    address: string;
    phone: string;
    open_times: string;
  };
  owner: {
    name: string;
    email: string;
    phone: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  is_active: boolean;
}

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="admin-container">
      <div class="admin-header">
        <h1>🛡️ لوحة الإدارة</h1>
        <p>إدارة طلبات انضمام المطاعم</p>
      </div>

      <!-- Statistics -->
      <div class="stats-grid">
        <div class="stat-card pending">
          <div class="stat-icon">⏳</div>
          <div class="stat-content">
            <h3>{{ pendingCount }}</h3>
            <p>طلبات في الانتظار</p>
          </div>
        </div>
        <div class="stat-card approved">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <h3>{{ approvedCount }}</h3>
            <p>طلبات موافق عليها</p>
          </div>
        </div>
        <div class="stat-card rejected">
          <div class="stat-icon">❌</div>
          <div class="stat-content">
            <h3>{{ rejectedCount }}</h3>
            <p>طلبات مرفوضة</p>
          </div>
        </div>
        <div class="stat-card total">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <h3>{{ applications.length }}</h3>
            <p>إجمالي الطلبات</p>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters">
        <div class="filter-group">
          <label>تصفية حسب الحالة:</label>
          <select [(ngModel)]="selectedStatus" (change)="filterApplications()" class="filter-select">
            <option value="">جميع الطلبات</option>
            <option value="pending">في الانتظار</option>
            <option value="approved">موافق عليها</option>
            <option value="rejected">مرفوضة</option>
          </select>
        </div>
        <div class="filter-group">
          <label>البحث:</label>
          <input 
            type="text" 
            [(ngModel)]="searchTerm" 
            (input)="filterApplications()"
            placeholder="ابحث باسم المطعم أو المالك..."
            class="search-input"
          >
        </div>
        <button (click)="loadApplications()" class="refresh-btn">
          🔄 تحديث
        </button>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="loading">
        <div class="spinner"></div>
        <p>جارٍ تحميل الطلبات...</p>
      </div>

      <!-- Applications List -->
      <div *ngIf="!isLoading" class="applications-list">
        <div *ngIf="filteredApplications.length === 0" class="no-applications">
          <div class="empty-icon">📭</div>
          <h3>لا توجد طلبات</h3>
          <p>لم يتم العثور على طلبات تطابق المعايير المحددة</p>
        </div>

        <div *ngFor="let app of filteredApplications" class="application-card" [class]="app.status">
          <div class="card-header">
            <div class="restaurant-info">
              <h3>{{ app.restaurant.name_ar }}</h3>
              <span class="restaurant-name-en">{{ app.restaurant.name_en }}</span>
              <div class="meta-info">
                <span class="category">{{ app.restaurant.category }}</span>
                <span class="city">{{ app.restaurant.city }}</span>
                <span class="date">{{ formatDate(app.created_at) }}</span>
              </div>
            </div>
            <div class="status-badge" [class]="app.status">
              <span *ngIf="app.status === 'pending'">⏳ في الانتظار</span>
              <span *ngIf="app.status === 'approved'">✅ موافق عليه</span>
              <span *ngIf="app.status === 'rejected'">❌ مرفوض</span>
            </div>
          </div>

          <div class="card-content">
            <div class="info-grid">
              <!-- Restaurant Details -->
              <div class="info-section">
                <h4>معلومات المطعم</h4>
                <div class="info-item">
                  <span class="label">الوصف (عربي):</span>
                  <span class="value">{{ app.restaurant.description_ar }}</span>
                </div>
                <div class="info-item">
                  <span class="label">الوصف (إنجليزي):</span>
                  <span class="value">{{ app.restaurant.description_en }}</span>
                </div>
                <div class="info-item">
                  <span class="label">العنوان:</span>
                  <span class="value">{{ app.restaurant.address }}</span>
                </div>
                <div class="info-item">
                  <span class="label">الهاتف:</span>
                  <span class="value">{{ app.restaurant.phone }}</span>
                </div>
                <div class="info-item">
                  <span class="label">ساعات العمل:</span>
                  <span class="value">{{ app.restaurant.open_times }}</span>
                </div>
              </div>

              <!-- Owner Details -->
              <div class="info-section">
                <h4>معلومات المالك</h4>
                <div class="info-item">
                  <span class="label">الاسم:</span>
                  <span class="value">{{ app.owner.name }}</span>
                </div>
                <div class="info-item">
                  <span class="label">البريد الإلكتروني:</span>
                  <span class="value">{{ app.owner.email }}</span>
                </div>
                <div class="info-item">
                  <span class="label">الهاتف:</span>
                  <span class="value">{{ app.owner.phone }}</span>
                </div>
                <div class="info-item">
                  <span class="label">اسم المستخدم:</span>
                  <span class="value">{{ app.username }}</span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div *ngIf="app.status === 'pending'" class="actions">
              <button 
                (click)="approveApplication(app.id)" 
                class="approve-btn"
                [disabled]="processingIds.includes(app.id)"
              >
                <span *ngIf="!processingIds.includes(app.id)">✅ موافقة</span>
                <span *ngIf="processingIds.includes(app.id)">جارٍ المعالجة...</span>
              </button>
              <button 
                (click)="rejectApplication(app.id)" 
                class="reject-btn"
                [disabled]="processingIds.includes(app.id)"
              >
                <span *ngIf="!processingIds.includes(app.id)">❌ رفض</span>
                <span *ngIf="processingIds.includes(app.id)">جارٍ المعالجة...</span>
              </button>
            </div>

            <div *ngIf="app.status === 'approved'" class="approved-info">
              <div class="success-message">
                <strong>✅ تم قبول الطلب</strong>
                <p>يمكن للمطعم الآن تسجيل الدخول باستخدام: {{ app.username }}</p>
              </div>
            </div>

            <div *ngIf="app.status === 'rejected'" class="rejected-info">
              <div class="error-message">
                <strong>❌ تم رفض الطلب</strong>
                <p>يمكنك إعادة الموافقة إذا تم تقديم معلومات محدثة</p>
                <button 
                  (click)="approveApplication(app.id)" 
                  class="reapprove-btn"
                  [disabled]="processingIds.includes(app.id)"
                >
                  إعادة الموافقة
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Success/Error Messages -->
      <div *ngIf="showMessage" class="message" [class]="messageType">
        <div class="message-content">
          <span class="message-icon">
            {{ messageType === 'success' ? '✅' : '❌' }}
          </span>
          <span>{{ messageText }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      min-height: 100vh;
      background: #f8f9fa;
      padding: 2rem;
      direction: rtl;
    }

    .admin-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .admin-header h1 {
      color: #2d8a3e;
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }

    .admin-header p {
      color: #666;
      font-size: 1.1rem;
    }

    /* Statistics */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: transform 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
    }

    .stat-card.pending {
      border-left: 4px solid #ffa726;
    }

    .stat-card.approved {
      border-left: 4px solid #4caf50;
    }

    .stat-card.rejected {
      border-left: 4px solid #f44336;
    }

    .stat-card.total {
      border-left: 4px solid #2196f3;
    }

    .stat-icon {
      font-size: 2rem;
    }

    .stat-content h3 {
      margin: 0;
      font-size: 2rem;
      color: #333;
    }

    .stat-content p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }

    /* Filters */
    .filters {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
      display: flex;
      gap: 2rem;
      align-items: end;
      flex-wrap: wrap;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .filter-group label {
      font-weight: 600;
      color: #333;
    }

    .filter-select, .search-input {
      padding: 0.8rem;
      border: 2px solid #e8f5e8;
      border-radius: 8px;
      font-size: 1rem;
      min-width: 200px;
    }

    .filter-select:focus, .search-input:focus {
      outline: none;
      border-color: #2d8a3e;
    }

    .refresh-btn {
      background: #2d8a3e;
      color: white;
      border: none;
      padding: 0.8rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
      transition: background 0.3s ease;
    }

    .refresh-btn:hover {
      background: #1e5f2a;
    }

    /* Loading */
    .loading {
      text-align: center;
      padding: 4rem;
      color: #666;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #e8f5e8;
      border-top: 4px solid #2d8a3e;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Applications */
    .applications-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .no-applications {
      text-align: center;
      padding: 4rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .application-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      overflow: hidden;
      transition: transform 0.3s ease;
    }

    .application-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }

    .application-card.pending {
      border-right: 4px solid #ffa726;
    }

    .application-card.approved {
      border-right: 4px solid #4caf50;
    }

    .application-card.rejected {
      border-right: 4px solid #f44336;
    }

    .card-header {
      background: #f8f9fa;
      padding: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: start;
      border-bottom: 1px solid #eee;
    }

    .restaurant-info h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.3rem;
      color: #2d8a3e;
    }

    .restaurant-name-en {
      color: #666;
      font-size: 0.9rem;
      display: block;
      margin-bottom: 0.5rem;
    }

    .meta-info {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .meta-info span {
      background: #e8f5e8;
      color: #2d8a3e;
      padding: 0.3rem 0.8rem;
      border-radius: 15px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .status-badge {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 600;
    }

    .status-badge.pending {
      background: #fff3e0;
      color: #f57c00;
    }

    .status-badge.approved {
      background: #e8f5e8;
      color: #2e7d32;
    }

    .status-badge.rejected {
      background: #ffebee;
      color: #c62828;
    }

    .card-content {
      padding: 1.5rem;
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-bottom: 1.5rem;
    }

    .info-section h4 {
      color: #2d8a3e;
      margin-bottom: 1rem;
      font-size: 1.1rem;
      border-bottom: 2px solid #e8f5e8;
      padding-bottom: 0.5rem;
    }

    .info-item {
      display: flex;
      margin-bottom: 0.8rem;
      align-items: start;
    }

    .info-item .label {
      font-weight: 600;
      color: #555;
      min-width: 120px;
      margin-left: 1rem;
    }

    .info-item .value {
      color: #333;
      flex: 1;
      word-break: break-word;
    }

    /* Actions */
    .actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      padding-top: 1rem;
      border-top: 1px solid #eee;
    }

    .approve-btn, .reject-btn, .reapprove-btn {
      padding: 0.8rem 2rem;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      min-width: 120px;
    }

    .approve-btn {
      background: #4caf50;
      color: white;
    }

    .approve-btn:hover:not(:disabled) {
      background: #388e3c;
      transform: translateY(-1px);
    }

    .reject-btn {
      background: #f44336;
      color: white;
    }

    .reject-btn:hover:not(:disabled) {
      background: #d32f2f;
      transform: translateY(-1px);
    }

    .reapprove-btn {
      background: #2196f3;
      color: white;
      margin-top: 0.5rem;
    }

    .reapprove-btn:hover:not(:disabled) {
      background: #1976d2;
    }

    .approve-btn:disabled, .reject-btn:disabled, .reapprove-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .approved-info, .rejected-info {
      padding-top: 1rem;
      border-top: 1px solid #eee;
    }

    .success-message, .error-message {
      padding: 1rem;
      border-radius: 8px;
      text-align: center;
    }

    .success-message {
      background: #e8f5e8;
      color: #2e7d32;
      border: 1px solid #c8e6c9;
    }

    .error-message {
      background: #ffebee;
      color: #c62828;
      border: 1px solid #ffcdd2;
    }

    /* Messages */
    .message {
      position: fixed;
      top: 2rem;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1000;
      padding: 1rem 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      animation: slideDown 0.3s ease;
    }

    .message.success {
      background: #4caf50;
      color: white;
    }

    .message.error {
      background: #f44336;
      color: white;
    }

    .message-content {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateX(-50%) translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
      .admin-container {
        padding: 1rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .filters {
        flex-direction: column;
        align-items: stretch;
      }

      .filter-group {
        width: 100%;
      }

      .filter-select, .search-input {
        min-width: auto;
        width: 100%;
      }

      .info-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .actions {
        flex-direction: column;
      }

      .approve-btn, .reject-btn {
        width: 100%;
      }

      .card-header {
        flex-direction: column;
        gap: 1rem;
      }

      .meta-info {
        justify-content: center;
      }
    }
  `]
})
export class AdminPanelComponent implements OnInit {
  applications: RestaurantApplication[] = [];
  filteredApplications: RestaurantApplication[] = [];
  isLoading = true;
  selectedStatus = '';
  searchTerm = '';
  processingIds: number[] = [];
  
  showMessage = false;
  messageType: 'success' | 'error' = 'success';
  messageText = '';

  // Statistics
  get pendingCount() {
    return this.applications.filter(app => app.status === 'pending').length;
  }

  get approvedCount() {
    return this.applications.filter(app => app.status === 'approved').length;
  }

  get rejectedCount() {
    return this.applications.filter(app => app.status === 'rejected').length;
  }

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadApplications();
  }

// Ersetze die approve/reject Funktionen in admin-panel.component.ts

approveApplication(id: number) {
  this.processingIds.push(id);
  
  // ECHTE API statt Mock
  this.http.post(`http://localhost:5000/api/admin/restaurant-applications/${id}/approve`, {})
    .subscribe({
      next: (response: any) => {
        this.processingIds = this.processingIds.filter(pid => pid !== id);
        this.showNotification('success', 'تم قبول الطلب بنجاح');
        console.log('Application approved:', response);
        
        // Update local data
        const app = this.applications.find(a => a.id === id);
        if (app) {
          app.status = 'approved';
          app.is_active = true;
        }
        this.filterApplications();
      },
      error: (error) => {
        this.processingIds = this.processingIds.filter(pid => pid !== id);
        console.error('Error approving application:', error);
        this.showNotification('error', 'خطأ في الموافقة على الطلب');
      }
    });
}

rejectApplication(id: number) {
  this.processingIds.push(id);
  
  // ECHTE API statt Mock
  this.http.post(`http://localhost:5000/api/admin/restaurant-applications/${id}/reject`, {
    reason: 'رفض من قبل الإدارة'
  })
    .subscribe({
      next: (response: any) => {
        this.processingIds = this.processingIds.filter(pid => pid !== id);
        this.showNotification('success', 'تم رفض الطلب');
        console.log('Application rejected:', response);
        
        // Update local data
        const app = this.applications.find(a => a.id === id);
        if (app) {
          app.status = 'rejected';
          app.is_active = false;
        }
        this.filterApplications();
      },
      error: (error) => {
        this.processingIds = this.processingIds.filter(pid => pid !== id);
        console.error('Error rejecting application:', error);
        this.showNotification('error', 'خطأ في رفض الطلب');
      }
    });
}

  filterApplications() {
    let filtered = [...this.applications];

    if (this.selectedStatus) {
      filtered = filtered.filter(app => app.status === this.selectedStatus);
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(app => 
        app.restaurant.name_ar.toLowerCase().includes(term) ||
        app.restaurant.name_en.toLowerCase().includes(term) ||
        app.owner.name.toLowerCase().includes(term) ||
        app.owner.email.toLowerCase().includes(term)
      );
    }

    this.filteredApplications = filtered.sort((a, b) => {
      const statusPriority = { pending: 0, approved: 1, rejected: 2 };
      if (statusPriority[a.status] !== statusPriority[b.status]) {
        return statusPriority[a.status] - statusPriority[b.status];
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }

loadApplications() {
  this.isLoading = true;
  
  this.http.get<{applications: RestaurantApplication[]}>('http://localhost:5000/api/admin/restaurant-applications')
    .subscribe({
      next: (response) => {
        this.applications = response.applications || [];
        this.filterApplications();
        this.isLoading = false;
        console.log('Loaded applications:', this.applications);
      },
      error: (error) => {
        console.error('Error loading applications:', error);
        this.isLoading = false;
        this.showNotification('error', 'خطأ في تحميل الطلبات');
      }
    });
}





  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  showNotification(type: 'success' | 'error', message: string) {
    this.messageType = type;
    this.messageText = message;
    this.showMessage = true;
    
    setTimeout(() => {
      this.showMessage = false;
    }, 3000);
  }
}