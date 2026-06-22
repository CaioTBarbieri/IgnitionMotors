import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CarService } from '../../../core/services/car.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  cars: any[] = [];
  filteredCars: any[] = [];
  profileMenuOpen = false;
  user: any = null;
  
  private carService = inject(CarService);
  private router = inject(Router);

  ngOnInit(): void {
    this.user = this.getStoredUser();
    this.loadCars();
  }

  get userInitial(): string {
    const source = this.user?.name || this.user?.email || 'I';
    return source.trim().charAt(0).toUpperCase();
  }

  loadCars() {
    this.carService.getCars().subscribe({
      next: (data) => {
        this.cars = data;
        this.filteredCars = data; // Inicia com todos os carros
      },
      error: (err) => console.error('Erro ao buscar veículos', err)
    });
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    const terms = this.normalizeSearchText(input.value).split(' ').filter(Boolean);

    if (terms.length === 0) {
      this.filteredCars = this.cars;
      return;
    }

    this.filteredCars = this.cars.filter((car) => {
      const searchableText = this.normalizeSearchText(`${car.brand ?? ''} ${car.model ?? ''}`);

      return terms.every((term) => searchableText.includes(term));
    });
  }

  private normalizeSearchText(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
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

  private getStoredUser(): any {
    const rawUser = localStorage.getItem('auth_user');
    if (rawUser) {
      try {
        return JSON.parse(rawUser);
      } catch {
        return this.getTokenUser();
      }
    }

    return this.getTokenUser();
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
}
