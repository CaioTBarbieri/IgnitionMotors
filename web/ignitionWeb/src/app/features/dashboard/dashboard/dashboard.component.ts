import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CarService } from '../../../core/services/car.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  cars: any[] = [];
  filteredCars: any[] = [];
  profileMenuOpen = false;
  user: any = null;
  searchTerm = '';
  filtersOpen = true;
  filters = {
    brand: '',
    minYear: null as number | null,
    maxYear: null as number | null,
    minPrice: null as number | null,
    maxPrice: null as number | null,
    maxKm: null as number | null,
    minHorsepower: null as number | null,
    sortBy: 'recent'
  };
  
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
        this.applyFilters();
      },
      error: (err) => console.error('Erro ao buscar veículos', err)
    });
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
    this.applyFilters();
  }

  applyFilters() {
    const terms = this.normalizeSearchText(this.searchTerm).split(' ').filter(Boolean);

    const filtered = this.cars.filter((car) => {
      const searchableText = this.normalizeSearchText(`${car.brand ?? ''} ${car.model ?? ''}`);
      const matchesSearch = terms.length === 0 || terms.every((term) => searchableText.includes(term));
      const matchesBrand = !this.filters.brand || this.normalizeSearchText(car.brand ?? '') === this.normalizeSearchText(this.filters.brand);
      const matchesMinYear = this.filters.minYear === null || Number(car.year) >= this.filters.minYear;
      const matchesMaxYear = this.filters.maxYear === null || Number(car.year) <= this.filters.maxYear;
      const matchesMinPrice = this.filters.minPrice === null || Number(car.price) >= this.filters.minPrice;
      const matchesMaxPrice = this.filters.maxPrice === null || Number(car.price) <= this.filters.maxPrice;
      const matchesMaxKm = this.filters.maxKm === null || Number(car.km) <= this.filters.maxKm;
      const matchesMinHorsepower = this.filters.minHorsepower === null || Number(car.horsepower) >= this.filters.minHorsepower;

      return matchesSearch &&
        matchesBrand &&
        matchesMinYear &&
        matchesMaxYear &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesMaxKm &&
        matchesMinHorsepower;
    });

    this.filteredCars = this.sortCars(filtered);
  }

  clearFilters() {
    this.searchTerm = '';
    this.filters = {
      brand: '',
      minYear: null,
      maxYear: null,
      minPrice: null,
      maxPrice: null,
      maxKm: null,
      minHorsepower: null,
      sortBy: 'recent'
    };
    this.applyFilters();
  }

  get brands(): string[] {
    return Array.from(new Set(this.cars.map((car) => car.brand).filter(Boolean))).sort();
  }

  get activeFilterCount(): number {
    const activeValues = [
      this.searchTerm.trim(),
      this.filters.brand,
      this.filters.minYear,
      this.filters.maxYear,
      this.filters.minPrice,
      this.filters.maxPrice,
      this.filters.maxKm,
      this.filters.minHorsepower
    ];

    return activeValues.filter((value) => value !== null && value !== '').length;
  }

  get resultLabel(): string {
    const total = this.filteredCars.length;
    return total === 1 ? '1 veiculo encontrado' : `${total} veiculos encontrados`;
  }

  toggleFilters() {
    this.filtersOpen = !this.filtersOpen;
  }

  private sortCars(cars: any[]): any[] {
    const sorted = [...cars];

    switch (this.filters.sortBy) {
      case 'priceAsc':
        return sorted.sort((a, b) => Number(a.price) - Number(b.price));
      case 'priceDesc':
        return sorted.sort((a, b) => Number(b.price) - Number(a.price));
      case 'yearDesc':
        return sorted.sort((a, b) => Number(b.year) - Number(a.year));
      case 'kmAsc':
        return sorted.sort((a, b) => Number(a.km) - Number(b.km));
      case 'powerDesc':
        return sorted.sort((a, b) => Number(b.horsepower) - Number(a.horsepower));
      default:
        return sorted.sort((a, b) => Number(b.id) - Number(a.id));
    }
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
