import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CarService } from '../../core/services/car.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  private router = inject(Router);
  private carService = inject(CarService);
  private authService = inject(AuthService);

  profileMenuOpen = false;
  myCars: any[] = [];
  user: any = null;
  loadingCars = true;
  loadingUser = true;

  ngOnInit(): void {
    this.user = this.getStoredUser();
    this.loadUser();
    this.loadMyCars();
  }

  get userInitial(): string {
    const source = this.user?.name || this.user?.email || 'I';
    return source.trim().charAt(0).toUpperCase();
  }

  get profileTitle(): string {
    return this.user?.name || this.user?.email || 'Perfil';
  }

  get profileSubtitle(): string {
    if (this.user?.email) {
      return this.user.email;
    }

    return this.loadingUser ? 'Buscando informacoes da conta.' : 'Nao foi possivel carregar os dados da conta.';
  }

  loadUser() {
    this.loadingUser = true;
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.setUser(user);
        this.loadingUser = false;
      },
      error: (err) => {
        console.error(err);
        this.setUser(this.user || this.getTokenUser());
        this.loadingUser = false;
      }
    });
  }

  loadMyCars() {
    this.loadingCars = true;
    this.carService.getMyCars().subscribe({
      next: (cars) => {
        this.myCars = cars;
        this.applySellerFallback(cars);
        this.loadingCars = false;
      },
      error: (err) => {
        console.error(err);
        this.loadingCars = false;
      }
    });
  }

  private setUser(user: any) {
    if (!user) {
      return;
    }

    this.user = user;
    localStorage.setItem('auth_user', JSON.stringify(user));
  }

  private getStoredUser(): any {
    const rawUser = localStorage.getItem('auth_user');
    if (!rawUser) {
      return this.getTokenUser();
    }

    try {
      return JSON.parse(rawUser);
    } catch {
      return this.getTokenUser();
    }
  }

  private getTokenUser(): any {
    const token = localStorage.getItem('jwt_token');
    const email = this.getEmailFromToken(token);

    return email ? { email } : null;
  }

  private getEmailFromToken(token: string | null): string | null {
    if (!token) {
      return null;
    }

    try {
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      return decodedPayload.sub ?? null;
    } catch {
      return null;
    }
  }

  private applySellerFallback(cars: any[]) {
    if (this.user?.name || cars.length === 0) {
      return;
    }

    const sellerName = cars.find((car) => car.sellerName)?.sellerName;
    if (sellerName) {
      this.setUser({
        ...this.user,
        name: sellerName
      });
    }
  }

  toggleProfileMenu() {
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  closeProfileMenu() {
    this.profileMenuOpen = false;
  }

  @HostListener('document:click')
  closeProfileMenuOnOutsideClick() {
    this.closeProfileMenu();
  }

  logout() {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('auth_user');
    this.router.navigate(['/login']);
  }
}
