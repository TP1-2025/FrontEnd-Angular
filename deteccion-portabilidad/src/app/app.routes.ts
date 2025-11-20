// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './features/home.component/home.component'; 
import { MenuComponent } from './features/menu.component/menu.component'; 
import { DashboardComponent } from './features/dashboard.component/dashboard.component'; 

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '**', redirectTo: '' },
];
