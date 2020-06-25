import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { LoginService } from 'src/app/login/login.service';
import { switchMap } from 'rxjs/operators';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private refreshTokenInProgress = false;
  constructor(private service: LoginService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
      const token = this.service.token;
      const revokeToken = '/sisac/security/tokens/revoke';
      const oauthToken = '/oauth/token';

      if (req.url.search(oauthToken) !== -1) {
        return next.handle(req);
      }

      if (req.url.search(revokeToken) !== -1) {
        return next.handle(req);
      }

      const accessExpired = this.service.isTokenExpirado();
      const refreshExpired = this.service.isRefreshExpirado();

      if (accessExpired && refreshExpired) {
        console.log('acces y refresh vencidos');
        return next.handle(req);
      }

      if (accessExpired && !refreshExpired) {
        console.log('ingresa actualizar token');
        if (!this.refreshTokenInProgress) {
            this.refreshTokenInProgress = true;
            return this.service.actualizarToken(this.service.refresh).pipe(
                switchMap((authResponse: any) => {
                    console.log('token actualizado');
                    this.service.guardarToken(authResponse.access_token, authResponse.refresh_token);
                    this.refreshTokenInProgress = false;
                    return next.handle(this.injectToken(req));
                }),
            );
        } else {
            return next.handle(this.injectToken(req));
        }
      }

      if (!accessExpired) {
        return next.handle(this.injectToken(req));
      }
  }

  injectToken(request: HttpRequest<any>) {
    const token = this.service.token;
    return request.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`
        }
    });
  }
}
