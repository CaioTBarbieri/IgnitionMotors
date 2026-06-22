import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CarService } from '../../../core/services/car.service';

@Component({
  selector: 'app-car-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './car-detail.component.html',
  styleUrl: './car-detail.component.scss'
})
export class CarDetailComponent implements OnInit {
  car: any;
  currentIndex: number = 0;

  private route = inject(ActivatedRoute);
  private carService = inject(CarService);
  private router = inject(Router);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carService.getCarById(Number(id)).subscribe({
        next: (data) => this.car = data,
        error: (err) => console.error(err)
      });
    }
  }

  // Avança uma foto
  nextImage() {
    this.currentIndex = (this.currentIndex === this.car.imageUrls.length - 1) ? 0 : this.currentIndex + 1;
  }

  // Volta uma foto
  prevImage() {
    this.currentIndex = (this.currentIndex === 0) ? this.car.imageUrls.length - 1 : this.currentIndex - 1;
  }

  // Muda direto para a foto clicada na bolinha
  setIndex(index: number) {
    this.currentIndex = index;
  }

  deleteCar() {
    if (!this.car?.id || !confirm('Deseja excluir este anuncio?')) {
      return;
    }

    this.carService.deleteCar(this.car.id).subscribe({
      next: () => {
        alert('Anuncio excluido com sucesso!');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error(err);
        alert('Nao foi possivel excluir este anuncio.');
      }
    });
  }
}
