import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login/login.service';
import { ActivatedRoute } from '@angular/router';
import { routerTransition } from '../router.animations';

@Component({
  selector: 'app-olvide-contrasena',
  templateUrl: './olvide-contrasena.component.html',
  styleUrls: ['./olvide-contrasena.component.scss'],
  animations: [routerTransition()]
})
export class OlvideContrasenaComponent implements OnInit {
  usuario: string;
  mensaje: string;
  error: string;
  porcentaje: number = 0;

  constructor(private service: LoginService, public route: ActivatedRoute) { }

  ngOnInit() {
  }

  enviar() {
    this.porcentaje = 99;
    this.service.enviarCorreo(this.usuario).subscribe(data => {
      if (data === 1) {
        this.mensaje = 'Se enviaron las indicaciones al correo.',
        this.error = null,
        this.porcentaje = 100;
      } else {
        this.error = 'El usuario ingresado no existe';
        this.porcentaje = 0;
      }
    });
  }

}
