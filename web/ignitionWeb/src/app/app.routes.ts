import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { DashboardComponent } from './features/dashboard/dashboard/dashboard.component';
import { AddCarComponent } from './features/dashboard/add-car/add-car.component';
import { authGuard } from './core/guards/auth.guard';
import { CarDetailComponent } from './features/dashboard/car-detail/car-detail.component';
import { ProfileComponent } from './features/profile/profile.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'add-car', component: AddCarComponent, canActivate: [authGuard] },
  { path: 'edit-car/:id', component: AddCarComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'car/:id', component: CarDetailComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
