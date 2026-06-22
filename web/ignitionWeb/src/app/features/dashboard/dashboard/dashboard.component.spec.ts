import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should find a car when searching by brand and model together', () => {
    component.cars = [
      { brand: 'BMW', model: 'M4 Competition' },
      { brand: 'Porsche', model: '911 GT3' }
    ];

    component.onSearch({
      target: { value: 'BMW M4' }
    } as unknown as Event);

    expect(component.filteredCars).toEqual([
      { brand: 'BMW', model: 'M4 Competition' }
    ]);
  });

  it('should find a car when search terms are typed in a different order', () => {
    component.cars = [
      { brand: 'BMW', model: 'M4 Competition' },
      { brand: 'Porsche', model: '911 GT3' }
    ];

    component.onSearch({
      target: { value: 'M4 BMW' }
    } as unknown as Event);

    expect(component.filteredCars).toEqual([
      { brand: 'BMW', model: 'M4 Competition' }
    ]);
  });
});
