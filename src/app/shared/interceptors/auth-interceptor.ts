import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, retry } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { LoginService } from '../../login/login.service';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private service: LoginService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
      return next.handle(req).pipe(
        catchError(e => {
          console.log(e);
          if (e.status == '401') {
            if (this.service.isAuthenticated()) {
              this.service.logout();
            }
            Swal.fire('Acceso Denegado', 'Hola no estas autorizado para este recurso', 'warning');
          }

          if (e.status == '403') {
            Swal.fire('Acceso Denegado', 'Hola no tienes acceso a este recurso', 'warning');
          }
          return throwError(e);
      })
    );
  }
}