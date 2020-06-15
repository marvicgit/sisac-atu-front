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
            if (this.isTokenExpirado()) {
                this.service.logout();
                this.router.navigate(['/login']);
                return false;
            }
            return true;
         }
        this.router.navigate(['/login']);
        return false;
    }

    isTokenExpirado(): boolean {
        const token = this.service.token;
        const payload = this.service.obtenerDatosToken(token);
        const now = new Date().getTime() / 1000;
        if (payload.exp < now) {
            return true;
        }
        return false;
    }
}
