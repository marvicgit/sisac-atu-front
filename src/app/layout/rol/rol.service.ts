import { Injectable } from '@angular/core';
import { Rol } from '../../models/rol';
import { Observable, of, throwError } from 'rxjs';
import { delay, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { RolDTO } from 'src/app/models/rolDTO';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  url = `${environment.HOST_URL}/sisac/roles`;
  constructor(private http: HttpClient) { }

  listar() {
    return this.http.get<RolDTO[]>(this.url);
  }

  registrar(data: RolDTO): Observable<RolDTO> {
    return this.http.post<RolDTO>(this.url, data).pipe(
      catchError(e => {
          Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: 'Error al registrar rol',
              text: e.error.mensaje,
              showConfirmButton: false
            });
          return throwError(e);
      })
    );
  }

  modificar(data: RolDTO): Observable<RolDTO> {
    return this.http.put<RolDTO>(this.url, data).pipe(
      catchError(e => {
          Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: 'Error al modificar rol',
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
              title: 'Error al eliminar rol',
              text: e.error.mensaje,
              showConfirmButton: false,
              timer: 1500
            });
          return throwError(e);
      })
    );
  }
}
