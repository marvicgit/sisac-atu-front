import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Sistema } from 'src/app/models/sistema';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioSistemaDTO } from 'src/app/models/usuarioSistemaDTO';
import { Observable } from 'rxjs';
import { SortableDirective, SortEvent } from 'src/app/shared/directives/sortable.directive';
import { NgbModal, NgbModalConfig, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { UsuarioService } from '../usuario/usuario.service';
import { SistemaService } from '../sistema/sistema.service';
import { TablausuarioSistemaService } from './tablausuario-sistema.service';
import { LoginService } from 'src/app/login/login.service';
import { UsuarioSistemaService } from './usuario-sistema.service';
import { RolSistemaService } from '../rol-sistema/rol-sistema.service';
import { RolDTO } from '../../models/rolDTO';
import Swal from 'sweetalert2';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-usuario-sistema',
  templateUrl: './usuario-sistema.component.html',
  styleUrls: ['./usuario-sistema.component.scss'],
  providers: [TablausuarioSistemaService, DecimalPipe]
})
export class UsuarioSistemaComponent implements OnInit {

  form: FormGroup;
  usuarioSistemas: UsuarioSistemaDTO[] = [];
  filtroUsuarioSistemas: UsuarioSistemaDTO[] = [];
  sistemas: Sistema[] = [];
  usuarios: Usuario[] = [];
  roles: RolDTO[] = [];
  rolesFiltrados: RolDTO[] = [];
  page = 0;
  total = 0;
  pageSize = 7;
  searchValue: string;
  closeResult: string;
  seconds = true;
  activoInactivo: string[] = [ '1', '0' ];

  usuarioSistemas$: Observable<UsuarioSistemaDTO[]>;
  total$: Observable<number>;
  @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;
  constructor(private formBuilder: FormBuilder,
              private modalService: NgbModal,
              config: NgbModalConfig,
              private service: UsuarioSistemaService,
              private serviceUsuario: UsuarioService,
              private serviceSistema: SistemaService,
              private serviceRolSistema: RolSistemaService,
              public serviceTable: TablausuarioSistemaService,
              public loginService: LoginService
    ) { 
      config.backdrop = 'static';
      config.keyboard = false;
    }

  ngOnInit(): void {
    this.iniciarForm();
    this.listarSistema();
    this.listarUsuario();
    this.listar();
    this.listarSistemaRol();
  }

  iniciarForm() {
    this.form = this.formBuilder.group({
        ususisid: new FormControl(null),
        usunom: new FormControl(''),
      usuapepat: new FormControl(''),
      usuapemat: new FormControl(''),
      usulogin: new FormControl(''),
        usuid: new FormControl('', Validators.required),
        sisid: new FormControl(null, Validators.required),
        sisnom: new FormControl(''),
        rolid: new FormControl(null, Validators.required),
        rolnom: new FormControl(''),
        estreg: new FormControl(1),
        usureg: sessionStorage.getItem('username'),
        usumod: ''
      });
  }

  listar() {
    this.service.listar().subscribe((data: UsuarioSistemaDTO[]) => {
      this.serviceTable.usuariosSistemas.next(data);
      this.usuarioSistemas$ = this.serviceTable.usuariosSistemas$
      this.total$ = this.serviceTable.total$;
      this.serviceTable.searchTerm = '';
      this.usuarioSistemas = data;
      this.filtroUsuarioSistemas =  data;
      this.total = data.length;
    });
  }

  onSort({column, direction}: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.serviceTable.sortColumn = column;
    this.serviceTable.sortDirection = direction;
  }

  listarUsuario() {
    this.serviceUsuario.listar().subscribe(data => {
      this.usuarios = data;
    });
  }

  listarSistema() {
    this.serviceSistema.listar().subscribe(data => {
      this.sistemas = data;
    });
  }

  changeSistema() {
    const id: number = this.form.get('sisid').value;
    this.rolesFiltrados = this.roles.filter(x => x.sisid === id);
  }

  listarSistemaRol() {
    this.serviceRolSistema.listar().subscribe( data => {
      this.roles = data;
    });
  }

  registrar() {
    if (this.form.valid) {
      if (this.form.get('ususisid').value == null) {
        this.form.get('usureg').setValue(sessionStorage.getItem('username'));
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
          this.form.get('usumod').setValue(sessionStorage.getItem('username'));
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
    } else {
      Object.values(this.form.controls).forEach(c => {
        c.markAsTouched();
      });
    }
  }

  elimnar(data: UsuarioSistemaDTO) {
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
        this.service.eliminar(data.ususisid).subscribe(() => {
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

  open(content, data?: UsuarioSistemaDTO) {
     if (data) {
         this.form.setValue(data);
         this.changeSistema();
     } else {
         this.form.reset();
         this.iniciarForm();
     }
     this.modalService.open(content).result.then((result) => {
        this.form.reset();
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
          this.form.reset();
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

}
