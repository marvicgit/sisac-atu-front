import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { LoginService } from '../../../login/login.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    public pushRightClass: string;
    username: string;
    constructor(public router: Router,
                private service: LoginService ) {
                    this.username = this.service.usuario.usunom + ' ' + this.service.usuario.usuapepat;
                    this.router.events.subscribe(val => {
                        if (
                            val instanceof NavigationEnd &&
                            window.innerWidth <= 992 &&
                            this.isToggled()
                        ) {
                            this.toggleSidebar();
                        }
                    });
    }

    ngOnInit() {
        this.pushRightClass = 'push-right';
    }

    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    rltAndLtr() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle('rtl');
    }

    onLoggedout() {
        console.log('salir');
        this.service.logout();
    }

    irCambiarClave(){
        const tk = JSON.parse(sessionStorage.getItem(environment.TOKEN_NAME));
        const token = tk != null ? tk.access_token : '';
        this.router.navigate(['/cambiar-contrasena/' + token]);
    }
}
