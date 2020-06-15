import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { LoginService } from '../../login/login.service';
import { PasswordValidation } from '../../shared';
import { Usuario } from 'src/app/models/usuario';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-cambiar-contrasena',
  templateUrl: './cambiar-contrasena.component.html',
  styleUrls: ['./cambiar-contrasena.component.scss']
})
export class CambiarContrasenaComponent implements OnInit {

  form: FormGroup;
  token: string;
  mensaje: string;
  error: string;
  rpta: number;
  tokenValido: boolean;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private loginService: LoginService) {
  }

  iniciarForm() {
    this.form = this.formBuilder.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]}, {
        validator: PasswordValidation.MatchPassword
      });
  }

  ngOnInit() {
    this.iniciarForm();
    //this.verificarTokenReset();
  }


  verificarTokenReset() {
    this.route.params.subscribe((params: Params) => {
      this.token = params['token'];
      this.loginService.verificarTokenReset(this.token).subscribe(data => {
        if (data === 1) {
          this.tokenValido = true;
        } else {
          this.tokenValido = false;
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        }
      });
    });
  }

  onSubmit() {
    const usuario: Usuario = new Usuario();
    usuario.usulogin = sessionStorage.getItem(environment.TOKE_USER)
    usuario.usupassword = this.form.value.confirmPassword;
    this.loginService.cambiarContraseña(usuario).subscribe(data => {
      if (data === 1) {
        this.loginService.logout();
      }
    }, (err => {
      this.rpta = 0;
    }));
  }
}
