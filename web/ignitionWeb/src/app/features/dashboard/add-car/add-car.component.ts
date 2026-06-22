import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CarService } from '../../../core/services/car.service';

@Component({
  selector: 'app-add-car',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-car.component.html',
  styleUrl: './add-car.component.scss'
})
export class AddCarComponent implements OnInit {
  private fb = inject(FormBuilder);
  private carService = inject(CarService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  profileMenuOpen = false;
  selectedFileNames: string = 'Nenhum arquivo selecionado';
  isEditMode = false;
  editingCarId: number | null = null;
  user: any = null;

  carForm = this.fb.group({
    brand: ['', Validators.required],
    model: ['', Validators.required],
    year: ['', [Validators.required, Validators.min(1900), Validators.max(2027)]],
    price: ['', [Validators.required, Validators.min(1)]],
    imageUrls: [[] as string[], Validators.required],
    engine: ['', Validators.required],
    horsepower: ['', Validators.required],
    km: ['', [Validators.required, Validators.min(0)]],
    zeroToHundred: ['', Validators.required]
  });

  ngOnInit(): void {
    this.user = this.getStoredUser();

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }

    this.isEditMode = true;
    this.editingCarId = Number(id);
    this.loadCarForEditing(this.editingCarId);
  }

  private loadCarForEditing(id: number) {
    this.carService.getCarById(id).subscribe({
      next: (car) => {
        if (!car.ownedByCurrentUser) {
          alert('Voce so pode editar anuncios criados por voce.');
          this.router.navigate(['/car', id]);
          return;
        }

        this.carForm.patchValue({
          brand: car.brand,
          model: car.model,
          year: car.year,
          price: car.price,
          imageUrls: car.imageUrls ?? [],
          engine: car.engine,
          horsepower: car.horsepower,
          km: car.km,
          zeroToHundred: car.zeroToHundred
        });

        this.selectedFileNames = car.imageUrls?.length
          ? `${car.imageUrls.length} imagem(ns) atuais`
          : 'Nenhum arquivo selecionado';
      },
      error: (err) => {
        console.error(err);
        alert('Nao foi possivel carregar o anuncio.');
        this.router.navigate(['/dashboard']);
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (!files || files.length === 0) {
      this.selectedFileNames = 'Nenhum arquivo selecionado';
      this.carForm.patchValue({ imageUrls: [] });
      this.carForm.get('imageUrls')?.markAsTouched();
      this.carForm.get('imageUrls')?.updateValueAndValidity();
      return;
    }

    this.selectedFileNames = files.length === 1
      ? files[0].name
      : `${files.length} arquivos selecionados`;

    const imageReads = Array.from(files).map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imageReads)
      .then((base64Images) => {
        this.carForm.patchValue({ imageUrls: base64Images });
        this.carForm.get('imageUrls')?.markAsDirty();
        this.carForm.get('imageUrls')?.updateValueAndValidity();
      })
      .catch((error) => {
        console.error(error);
        this.selectedFileNames = 'Erro ao carregar imagem';
        this.carForm.patchValue({ imageUrls: [] });
        this.carForm.get('imageUrls')?.updateValueAndValidity();
      });
  }

  onSubmit() {
    if (this.carForm.invalid) {
      return;
    }

    const request$ = this.isEditMode && this.editingCarId
      ? this.carService.updateCar(this.editingCarId, this.carForm.value)
      : this.carService.createCar(this.carForm.value);

    request$.subscribe({
      next: (car) => {
        alert(this.isEditMode ? 'Anuncio atualizado com sucesso!' : 'Maquina anunciada com sucesso!');
        this.router.navigate(['/car', car.id]);
      },
      error: (err) => {
        console.error(err);
        alert(this.isEditMode ? 'Erro ao atualizar o anuncio.' : 'Erro ao cadastrar o veiculo.');
      }
    });
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

  get userInitial(): string {
    const source = this.user?.name || this.user?.email || 'I';
    return source.trim().charAt(0).toUpperCase();
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
