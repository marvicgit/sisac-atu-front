import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import { LoginService } from './login.service';
import { environment } from 'src/environments/environment';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Permiso } from '../models/permiso';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {
    usuario: string;
    password: string;
    form: FormGroup;
    permisos: Permiso[] = [];
    token: string = '';
    loading: boolean;
    google = environment.GOOGLE_AUTH_URL;
    facebook = environment.FACEBOOK_AUTH_URL;
    github = environment.GITHUB_AUTH_URL;
    constructor(private formBuilder: FormBuilder,
                public router: Router,
                private service: LoginService
                ) {
                  this.loading = false;
                }

    ngOnInit() {
      if (this.service.isAuthenticated()) {
        this.router.navigate(['/home']);
      }
      this.iniciarForm();
    }

    iniciarForm() {
      this.form = this.formBuilder.group({
        email: new FormControl(null, Validators.required),
        password: new FormControl(null, Validators.required)
        //recaptchaReactive: new FormControl(null, Validators.required)
        });
    }

    onLoggedin() {
      if (this.form.valid) {
        this.loading = true;
        this.service.login(this.form.value).subscribe((data: any) => {
            this.service.guardarUsuario(data.access_token);
            this.service.guardarToken(data.access_token, data.refresh_token);
            this.router.navigate(['/home']);
          }, (err: any) => {
            this.loading = false;
            if (err.status == '400') {
              Swal.fire('Error Login', 'usuario o password incorrecto', 'error');
            }
          });
    }
  }
}

