// app/app.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, NavbarComponent],
  template: `
    <div class="app-container" [class.rtl]="isRTL">
      <app-navbar></app-navbar>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background: #ffffff;
    }
    .app-container.rtl {
      direction: rtl;
    }
    .main-content {
      padding-top: 80px;
      background: #ffffff;
    }
  `]
})
export class AppComponent {
  isRTL = true; // Default to Arabic RTL
}