import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ReporteDTO } from 'src/app/models/reporteDTO';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  url = `${environment.HOST_URL}/sisac/reportes`;
  constructor(private http: HttpClient) { }

  listar() {
    return this.http.get<ReporteDTO[]>(this.url);
  }

  generarReporte() {
    return this.http.get(`${this.url}/download`, {responseType: 'blob'});
 }
}
