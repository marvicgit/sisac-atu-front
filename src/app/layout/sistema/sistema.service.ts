import { Injectable } from '@angular/core';
import { Sistema } from '../../models/sistema';
import { Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SistemaService {
  url = `${environment.HOST_URL}/sisac/sistemas`;
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(private http: HttpClient) { }

  listar() {
    return this.http.get<Sistema[]>(this.url);
  }

  registrar(data: Sistema): Observable<Sistema> {
    return this.http.post<Sistema>(this.url, data).pipe(
      catchError(e => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Error al registrar sistema',
          text: e.error.mensaje,
          showConfirmButton: false
        });
        return throwError(e);
      })
    );
  }

  modificar(data: Sistema): Observable<Sistema> {
    return this.http.put<Sistema>(this.url, data).pipe(
      catchError(e => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Error al modificar sistema',
          text: e.error.mensaje,
          showConfirmButton: false
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
          title: 'Error al eliminar sistema',
          text: e.error.mensaje,
          showConfirmButton: false
        });
        return throwError(e);
      })
    );
  }
}