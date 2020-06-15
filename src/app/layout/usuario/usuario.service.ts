import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { ReporteDTO } from '../../models/reporteDTO';
import { map, catchError } from 'rxjs/operators';
import { UsuarioDTO } from 'src/app/models/usuarioDTO';
import { Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  url = `${environment.HOST_URL}/sisac/usuarios`;
  constructor(private http: HttpClient) { }

  listar() {
    return this.http.get<UsuarioDTO[]>(this.url);
  }

  ObtenerUsuarioDetalle() {
    return this.http.get<ReporteDTO[]>(`${this.url}/ObtenerUsuarioDetalle`);
  }

  buscarUsuarioLdap(usulog: string){
    return this.http.get<Usuario>(`${this.url}/BuscarUsuarioLdap/${usulog}`);
  }

  registrar(data: UsuarioDTO): Observable<UsuarioDTO> {
    return this.http.post<UsuarioDTO>(this.url, data).pipe(
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

  modificar(data: UsuarioDTO): Observable<UsuarioDTO> {
    return this.http.put<UsuarioDTO>(this.url, data).pipe(
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

  generarReporte() {
    return this.http.get(`${this.url}/generarReporte`, {
      responseType: 'blob'
    }).pipe(map((res: any) => {
          return new Blob([res.blob()], { type: 'application/vnd.ms-excel' });
      }));
  }

  subirFoto(archivo: File, id: string): Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('id', id);
    const req = new HttpRequest('POST', `${this.url}/upload`, formData, {
      reportProgress: true
    });

    return this.http.request(req);
  }

  // return this.http.get(this.baseUrl + "/file", { search: params, responseType: ResponseContentType.Blob }).map(
  //   (res) => {
  //       return new Blob([res.blob()], { type: 'application/vnd.ms-excel' });
  //   });
}
