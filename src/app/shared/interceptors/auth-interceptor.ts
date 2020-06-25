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
      const revokeToken = '/sisac/security/tokens/revoke';
      const oauthToken = '/oauth/token';

      return next.handle(req).pipe(
        catchError(e => {
          console.log('paso interceptor auth' + e);
          if (e.status == '401') {
            if (this.service.isAuthenticated()) {
                console.log('paso interceptor auth si autenticado');
                /* this.service.actualizarToken(this.service.refresh).subscribe((data: any) => {
                  this.service.guardarToken(data.access_token, data.refresh_token);
                });*/
                //this.service.logout();
            }
            Swal.fire('Acceso Denegado', 'Hola no estas autorizado para este recurso', 'warning');
          }
          if (e.status == '403') {
            Swal.fire('Acceso Denegado', 'Hola no tienes acceso a este recurso', 'warning');
          }
          return throwError(e);
        })
      );
      return next.handle(req);
  }
}