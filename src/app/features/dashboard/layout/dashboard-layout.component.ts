import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SidebarComponent } from '../../dashboard/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../dashboard/components/header/header.component';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,

  imports: [
    RouterOutlet,
    SidebarComponent,
    HeaderComponent
  ],

  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css'
})
export class DashboardLayoutComponent {}