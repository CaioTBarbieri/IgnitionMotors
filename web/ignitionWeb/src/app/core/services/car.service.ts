import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private http = inject(HttpClient);
  private apiUrl = 'https://ignitionmotors.onrender.com/cars';

  // Busca todos os carros para a vitrine
  getCars(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getMyCars(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mine`);
  }

  createCar(carData: any): Observable<any> {
    return this.http.post(this.apiUrl, carData);
  }

  updateCar(id: number, carData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, carData);
  }

  deleteCar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
 
  getCarById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
