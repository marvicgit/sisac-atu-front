import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario';
import { Login } from '../models/login/login';
import { Permiso } from '../models/permiso';
import { throwError, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  url = `${environment.HOST_URL}/oauth`;

  premisos: Permiso;
  private _usuario: Usuario;
  private _token: string;
  private _refresh: string;
  constructor(private http: HttpClient,
              private router: Router,
              @Inject(PLATFORM_ID) private platformId: any) {

  }

  public get usuario(): Usuario {
    if (this._usuario != null) {
      return this._usuario;
    } else if (this._usuario == null && sessionStorage.getItem('usuario') != null) {
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
      return this._usuario;
    }
    return new Usuario();
  }

  public get token(): string {
    if (this._token != null) {
      return this._token;
    } else if (this._token == null && sessionStorage.getItem('token') != null) {
      this._token = sessionStorage.getItem('token');
      return this._token;
    }
    return null;
  }

  public get refresh(): string {
    if (this._refresh != null) {
      return this._refresh;
    } else if (this._refresh == null && sessionStorage.getItem('refresh') != null) {
      this._refresh = sessionStorage.getItem('refresh');
      return this._refresh;
    }
    return null;
  }


  login(login: Login) {
    const credenciales = btoa(environment.TOKEN_AUTH_USERNAME + ':' + environment.TOKEN_AUTH_PASSWORD);

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Authorization': 'Basic ' + credenciales
    });

    const params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', login.email);
    params.set('password', login.password);
    params.set('captcha', login.captcha);
    return this.http.post(`${this.url}/token`, params.toString(), { headers: httpHeaders });
  }

  guardarUsuario(accessToken: string) {
    const payload = this.obtenerDatosToken(accessToken);
    this._usuario = new Usuario();
    this._usuario.id = payload.id;
    this._usuario.usulogin = payload.user_name;
    this._usuario.usunom = payload.nombre;
    this._usuario.usuapepat = payload.apellido_paterno;
    this._usuario.usuapemat = payload.apellido_materno;
    this._usuario.usucorreo = payload.correo;
    this._usuario.roles = payload.authorities;
    sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
    sessionStorage.setItem('username', this._usuario.usulogin);
  }

  obtenerDatosToken(accessToken: string): any {
    if (accessToken != null) {
      return JSON.parse(atob(accessToken.split('.')[1]));
    }
    return null;
  }

  guardarToken(accessToken: string, refreshToken: string) {
    this._token = accessToken;
    this._refresh = refreshToken;
    sessionStorage.setItem('token', this._token);
    sessionStorage.setItem('refresh', this._refresh);
  }

  isAuthenticated(): boolean {
    const payload = this.obtenerDatosToken(this.token);
    if (payload != null && payload.user_name && payload.user_name.length > 0) {
      return true;
    }
    return false;
  }

  logout() {
    console.log('inicar revocar token');
    this.http.get(`${environment.HOST_URL}/sisac/security/tokens/revoke/${this.token}`).subscribe(() => {
      this._token = null;
      this._usuario = null;
      sessionStorage.clear();
      console.log('token revocado con exito');
      this.router.navigate(['/login']);
    }, error => {
      console.log('Error al revocar token:' + JSON.stringify(error));
      this._token = null;
      this._usuario = null;
      sessionStorage.clear();
      this.router.navigate(['/login']);
    });
  }

  hasRole(role: string): boolean {
    if (this.usuario.roles.includes(role)) {
      return true;
    }
    return false;
  }

  actualizarToken(refreshToken: string){
    const credenciales = btoa(environment.TOKEN_AUTH_USERNAME + ':' + environment.TOKEN_AUTH_PASSWORD);

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + credenciales
    });

    const params = new URLSearchParams();
    params.set('grant_type', 'refresh_token');
    params.set('refresh_token', refreshToken);
    return this.http.post(`${this.url}/token`, params.toString(), { headers: httpHeaders });

  }

  isTokenExpirado(): boolean {
    const payload = this.obtenerDatosToken(this.token);
    const now = new Date().getTime() / 1000;
    if (payload.exp < now) {
        console.log('acces expirado'  + now );
        return true;
    }
    return false;
  }

  isRefreshExpirado(): boolean {
    const payload = this.obtenerDatosToken(this.refresh);
    const now = new Date().getTime() / 1000;
    if (payload.exp < now) {
        console.log('refresh expirado'  + now );
        return true;
    }
    console.log('refresh no expirado'  + now );
    return false;
  }

  verificarTokenReset(token: string) {
    return this.http.get<number>(`${environment.HOST_URL}/sisac/login/restablecer/verificar/${token}`);
  }

  restablecer(token: string, clave: string) {
    return this.http.post<number>(`${environment.HOST_URL}/sisac/login/restablecer/${token}`, clave, {
      headers: new HttpHeaders().set('Content-Type', 'text/plain')
    });
  }

  listarPermisos(data: any) {
    return this.http.post<Permiso>(`${environment.HOST_URL}/sisac/usuarios/permisos`, data)
    .pipe(
      map((resp: any) => {
        sessionStorage.setItem(environment.PERMISOS, JSON.stringify(resp));
        this.premisos = resp;
        return true;
      }), catchError(err => {
        Swal.fire('Error en el login', err.error.mensaje, 'error');
        return throwError(err);
      }));
  }
}
