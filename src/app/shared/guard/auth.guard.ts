import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/login/login.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router,
                @Inject(PLATFORM_ID) private platformId: any,
                private service: LoginService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.service.isAuthenticated()) {
            console.log('paso guard autenticado');
            if (this.service.isTokenExpirado() && this.service.isRefreshExpirado()) {
                console.log('access y refresh expirado salir');
                this.service.logout();
                return false;
            }

            if (this.service.isTokenExpirado() && !this.service.isRefreshExpirado()) {
                console.log('paso guard token expirado salir');
                /*this.service.actualizarToken(this.service.refresh).subscribe((data: any) => {
                    console.log('paso guard token actualizado');
                    this.service.guardarToken(data.access_token, data.refresh_token);
                  }, (err: any) => console.log('erro actualizar token guard' + err)
                  );*/
                this.service.logout();
                return false;
            }
            return true;
         }
        console.log('paso guard no autenticado');
        this.router.navigate(['/login']);
        return false;
    }
}
