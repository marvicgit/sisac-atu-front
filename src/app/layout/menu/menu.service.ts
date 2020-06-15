import { Injectable } from '@angular/core';
import { Menu } from '../../models/menu';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MenuSistemaDTO } from 'src/app/models/menuSistemaDTO';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})

export class MenuService {
  url = `${environment.HOST_URL}/sisac/menus`;
  constructor(private http: HttpClient) { }

  listar() {
    return this.http.get<MenuSistemaDTO[]>(this.url);
  }

  registrar(data: MenuSistemaDTO): Observable<Menu> {
    return this.http.post<Menu>(this.url, data).pipe(
        catchError(e => {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Error al registrar menu',
                text: e.error.mensaje,
                showConfirmButton: false,
                timer: 1500
              });
            return throwError(e);
        })
    );
  }

  modificar(data: MenuSistemaDTO): Observable<Menu> {
    return this.http.put<Menu>(this.url, data).pipe(
        catchError(e => {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Error al modificar menu',
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
              title: 'Error al eliminar menu',
              text: e.error.mensaje,
              showConfirmButton: false,
              timer: 1500
            });
          return throwError(e);
      })
    );
  }
}
