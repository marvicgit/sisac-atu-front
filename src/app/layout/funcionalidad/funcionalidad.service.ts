import { Injectable } from '@angular/core';
import { Funcionalidad } from '../../models/funcionalidad';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class FuncionalidadService {

  url = `${environment.HOST_URL}/sisac/funcionalidades`;

  constructor(private http: HttpClient) { }

  listar() {
    return this.http.get<Funcionalidad[]>(this.url);
  }

  registrar(data: Funcionalidad): Observable<Funcionalidad> {
    return this.http.post<Funcionalidad>(this.url, data).pipe(
        catchError(e => {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Error al registrar funcionalidad',
                text: e.error.mensaje,
                showConfirmButton: false
              });
            return throwError(e);
        })
      );
  }

  modificar(data: Funcionalidad): Observable<Funcionalidad> {
    return this.http.put<Funcionalidad>(this.url, data).pipe(
        catchError(e => {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Error al modificar funcionalidad',
                text: e.error.mensaje,
                showConfirmButton: false,
                timer: 1500
              });
            return throwError(e);
        })
      );
  }

  eliminar(id: number) {
    return this.http.delete(`${this.url}/${id}`).pipe(
        catchError(e => {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Error al eliminar funcionalidad',
                text: e.error.mensaje,
                showConfirmButton: false,
                timer: 1500
              });
            return throwError(e);
        })
      );
  }
}


