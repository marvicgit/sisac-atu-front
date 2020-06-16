import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Usuario } from '../../models/usuario';
import { NgbModal, ModalDismissReasons, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { UsuarioService } from './usuario.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as _ from 'lodash';
import { TablaUsuarioService } from './tabla-usuario.service';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { SortableDirective, SortEvent } from 'src/app/shared/directives/sortable.directive';
import { RolService } from '../rol/rol.service';
import { RolDTO } from 'src/app/models/rolDTO';
import { Sistema } from 'src/app/models/sistema';
import { UsuarioDTO } from 'src/app/models/usuarioDTO';
import { LoginService } from 'src/app/login/login.service';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss'],
  providers: [TablaUsuarioService, DecimalPipe]
})
export class UsuarioComponent implements OnInit {
  form: FormGroup;
  selectedTabId = 'acceso';
  page = 0;
  total = 0;
  pageSize = 7;
  closeResult: string;
  usuarios: UsuarioDTO[] = [];
  listaUsuarios: UsuarioDTO[] = [];
  sistemas: Sistema[];
  roles: RolDTO[] = [];
  filtroRoles: RolDTO[] = [];
  fotoSeleccionada: File;
  usuarioFoto: Usuario;
  progreso = 0;

  usuarios$: Observable<UsuarioDTO[]>;
  total$: Observable<number>;
  @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;

  constructor(private formBuilder: FormBuilder,
              private modalService: NgbModal,
              config: NgbModalConfig,
              private service: UsuarioService,
              private serviceRol: RolService,
              public serviceTable: TablaUsuarioService,
              public loginService: LoginService,
              private router: Router) {
                config.backdrop = 'static';
                config.keyboard = false;
              }

  ngOnInit() {
    this.iniciarForm();
    this.listar();
    this.listarRoles();
  }

  iniciarForm() {
    this.form = this.formBuilder.group({
      usuid: new FormControl(null),
      usutipdoc: new FormControl('', Validators.required),
      usudni: new FormControl('', Validators.required),
      usunom: new FormControl('', Validators.required),
      usuapepat: new FormControl('', Validators.required),
      usuapemat: new FormControl('', Validators.required),
      ususexo:  new FormControl('1', Validators.required),
      usuarea:  new FormControl(null),
      usucargo:  new FormControl(null),
      usudireccion:  new FormControl(null),
      usucorreo: new FormControl(null, [Validators.required, Validators.email]),
      usulogin: new FormControl(null),
      usupassword: new FormControl(null),
      usuenable: new FormControl(null),
      usuimagen: new FormControl(null),
      usuteffijo: new FormControl(null),
      usutefmovil: new FormControl(null),
      rolesid: new FormControl(null),
      estreg: new FormControl(null),
      usureg: new FormControl(sessionStorage.getItem('username')),
      usumod: ''
      });
  }
  // unApellido(control: FormControl): {[s:string]: boolean} {
  //   if(control.value && this.form.get('usuapepat').value ){
  //     return {
  //       unApellido: true
  //     }
  //   }
  //   return null;
  // }

  listar() {
    this.service.listar().subscribe((data: UsuarioDTO[]) => {
      this.serviceTable.usuarios.next(data);
      this.usuarios$ = this.serviceTable.usuarios$
      this.total$ = this.serviceTable.total$;
      this.serviceTable.searchTerm = '';
      this.usuarios = data;
      this.listaUsuarios = data;
      this.total = data.length;
    });
  }

  listarRoles() {
    this.serviceRol.listar().subscribe((data: RolDTO[]) => {
      this.roles = data;
    });
  }

  onSort({column, direction}: SortEvent) {
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.serviceTable.sortColumn = column;
    this.serviceTable.sortDirection = direction;
  }


  buscarUsuarioLDAPAATE() {
    this.service.buscarUsuarioLDAPAATE(this.form.get('usulogin').value).subscribe(data => {
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Usuario encontrado, completar la información adicional',
        showConfirmButton: false,
        timer: 1500
      });

      this.form.get('usucorreo').setValue(data.usucorreo.toUpperCase());
      this.form.get('usunom').setValue(data.usunom.toUpperCase());
      this.form.get('usuapepat').setValue(data.usuapepat.toUpperCase());
      this.form.get('usuapemat').setValue(data.usuapemat.toUpperCase());
    });
  }

  open(content, data?: UsuarioDTO) {
    this.selectedTabId = 'acceso';
    if (data != null) {
      this.form.setValue(data);
    } else {
       this.form.reset();
    }
    this.modalService.open(content).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
        return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
        return 'by clicking on a backdrop';
    } else {
        return  `with: ${reason}`;
    }
  }

  elimnar(data: UsuarioDTO) {
    Swal.fire({
      title: '¿Estas seguro de eliminar?',
      text: 'No podras revertirlo!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminarlo!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.service.eliminar(data.usuid).subscribe(() => {
          Swal.fire(
            'Eliminado!',
            'El registro fue eliminado correctamente.',
            'success'
          );
          this.listar();
        });
      }
    });
  }

  generarReporte() {
    this.service.generarReporte().subscribe(data => {
      // let mediatype = 'application/vnd.ms-excel';
      // saveAs(data, 'usuarios.xlsx');
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none;')
      a.href = url;
      a.download = 'usuarios.xlsx';
      a.click();
    });
  }

  registrar() {
    if (this.form.valid) {
      if (this.form.get('usuid').value == null) {
        this.form.get('usureg').setValue('1');
        this.service.registrar(this.form.value).subscribe(data => {
          this.modalService.dismissAll();
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Registrado correctamente',
            showConfirmButton: false,
            timer: 1500
          });

          this.listar();
        });
      } else {
          this.form.get('usumod').setValue('1');
          this.service.modificar(this.form.value).subscribe(data =>{
            console.log(data);
            this.modalService.dismissAll();
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Actualizado correctamente',
              showConfirmButton: false,
              timer: 1500
            });
            this.listar();
          });
      }
    }
  }

  openUpload(content, data?: UsuarioDTO) {
    this.progreso = 0;
    this.usuarioFoto = new Usuario();
    this.usuarioFoto.id = data.usuid;
    this.usuarioFoto.usuimagen = data.usuimagen;
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  seleccionarFoto(event: any) {
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    if (this.fotoSeleccionada.type.indexOf('image') < 0) {
      this.fotoSeleccionada = null;
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Error imagen',
        text: 'El archivo debe ser del tipo imagen'
      });
    }
  }

  subirFoto() {
    if (!this.fotoSeleccionada) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Error upload',
        text: 'Debe seleccionar una imagen'
      });
    } else {
       this.service.subirFoto(this.fotoSeleccionada, this.usuarioFoto.id.toString()).subscribe((event: any) => {
         console.log(event);
         if (event.type === HttpEventType.UploadProgress) {
           this.progreso = Math.round((event.loaded / event.total) * 100);
         } else if ( event.type === HttpEventType.Response) {
            const response: any = event.body;
            this.usuarioFoto = response.usuario as Usuario;
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'La foto se ha subido completamente',
              text: 'La foto se ha subido conn exito: ' + response.mensaje
            });
            this.listar();
         }
      });
    }
  }
}
