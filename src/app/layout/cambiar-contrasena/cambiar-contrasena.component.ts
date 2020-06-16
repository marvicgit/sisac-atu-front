import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { LoginService } from '../../login/login.service';
import { PasswordValidation } from '../../shared';
import { Usuario } from 'src/app/models/usuario';
import { environment } from 'src/environments/environment';
import { UsuarioService } from '../usuario/usuario.service';


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
              private loginService: LoginService,
              private usuarioService: UsuarioService) {
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
  }

  onSubmit() {
    const usuario = {
      id: this.loginService.usuario.id,
      password: this.form.value.confirmPassword
    }
    this.usuarioService.cambiarContraseña(usuario).subscribe(data => {
        this.loginService.logout();
    }, (err => {
      console.log('Error al cambiar passord' + err);
    }));
  }
}
