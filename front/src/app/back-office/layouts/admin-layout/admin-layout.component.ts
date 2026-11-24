import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';  // Import Sidebar
import { TopbarComponent } from '../topbar/topbar.component';    // Import Topbar
import { LayoutsModule } from '../layouts.module';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [ LayoutsModule,RouterModule],  // Include the components in imports
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent {}
