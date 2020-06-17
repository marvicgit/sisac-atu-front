import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { LoginService } from 'src/app/login/login.service';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private service: LoginService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
      const token = this.service.token;
      const revokeToken = '/sisac/security/tokens/revoke';
      // Exclude interceptor for revoke token request:
      if (req.url.search(revokeToken) === -1 ) {
        if (token != null) {
          const authReq = req.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + token)
          });
          return next.handle(authReq);
        }
      }
      return next.handle(req);
  }
}