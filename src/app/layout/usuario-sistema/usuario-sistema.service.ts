import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UsuarioSistemaDTO } from '../../models/usuarioSistemaDTO';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class UsuarioSistemaService {

  url = `${environment.HOST_URL}/sisac/usuarios-sistema`;
  constructor(private http: HttpClient) { }

  listar() {
    return this.http.get<UsuarioSistemaDTO[]>(this.url);
  }

  registrar(data: UsuarioSistemaDTO): Observable<UsuarioSistemaDTO> {
    return this.http.post<UsuarioSistemaDTO>(this.url, data).pipe(
      catchError(e => {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Error al registrar usuario',
            text: e.error.mensaje,
            showConfirmButton: false
          });
          return throwError(e);
      })
    );
  }

  modificar(data: UsuarioSistemaDTO): Observable<UsuarioSistemaDTO> {
    return this.http.put<UsuarioSistemaDTO>(this.url, data).pipe(
      catchError(e => {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Error al modificar usuario',
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
            title: 'Error al eliminar usuario',
            text: e.error.mensaje,
            showConfirmButton: false
          });
          return throwError(e);
      })
    );
  }
}
