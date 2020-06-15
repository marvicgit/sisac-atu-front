import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Rol } from '../../models/rol';
import { NgbModal, ModalDismissReasons, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { RolService } from './rol.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { TablaRolService } from './tabla-rol.service';
import { SortEvent, SortableDirective } from 'src/app/shared/directives/sortable.directive';
import { DecimalPipe } from '@angular/common';
import { SistemaService } from '../sistema/sistema.service';
import { Sistema } from 'src/app/models/sistema';
import { MenuService } from '../menu/menu.service';
import { MenuSistemaDTO } from 'src/app/models/menuSistemaDTO';
import { Funcionalidad } from 'src/app/models/funcionalidad';
import { FuncionalidadService } from '../funcionalidad/funcionalidad.service';
import { RolDTO } from 'src/app/models/rolDTO';
import { LoginService } from 'src/app/login/login.service';

@Component({
  selector: 'app-rol',
  templateUrl: './rol.component.html',
  styleUrls: ['./rol.component.scss'],
  providers: [TablaRolService, DecimalPipe]
})
export class RolComponent implements OnInit {
  form: FormGroup;
  roles: RolDTO[] = [];
  listaRoles: RolDTO[] = [];
  sistemas: Sistema[];
  menus: MenuSistemaDTO[] = [];
  filtroMenus: MenuSistemaDTO[] = [];
  funcionalidades: Funcionalidad[];
  total = 0;
  page = 0;
  pageSize = 7;
  closeResult: string;
  roles$: Observable<RolDTO[]>;
  total$: Observable<number>;
  @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;

  constructor(private formBuilder: FormBuilder,
              private modalService: NgbModal,
              private config: NgbModalConfig,
              public serviceTable: TablaRolService,
              private serviceSistema: SistemaService,
              private serviceMenu: MenuService,
              private serviceFuncionalidad: FuncionalidadService,
              public loginService: LoginService,
              private service: RolService) {
                this.config.backdrop = 'static';
                this.config.keyboard = false;
              }

  ngOnInit() {
    this.listar();
    this.listarSistema();
    this.listarMenu();
    this.iniciarForm();
    this.listarFuncionalidades();
  }

  listar() {
    this.service.listar().subscribe((data: RolDTO[]) => {
      this.serviceTable.roles.next(data);
      this.roles$ = this.serviceTable.roles$
      this.total$ = this.serviceTable.total$;
      this.serviceTable.searchTerm = '';
      this.roles = data;
      this.listaRoles = data;
      this.total = data.length;
    });
  }

  listarSistema() {
    this.serviceSistema.listar().subscribe(data => {
      this.sistemas = data;
    });
  }

  changeSistema() {
    const id: number = this.form.get('sisid').value;
    this.filtroMenus = this.menus.filter(l => {
      return l.sisid == id;
    });
  }

  listarMenu() {
    this.serviceMenu.listar().subscribe( data => {
      this.menus = data;
    });
  }

  listarFuncionalidades() {
    this.serviceFuncionalidad.listar().subscribe(data => {
      this.funcionalidades = data;
    });
  }

  iniciarForm() {
    this.form = this.formBuilder.group({
      rolid: new FormControl(null),
      rolnom: new FormControl('', Validators.required),
      rolsig: new FormControl('', Validators.required),
      roldes: new FormControl('', Validators.required),
      sisid: new FormControl('', Validators.required),
      menusid: new FormControl('', Validators.required),
      funcionalidadesid: new FormControl(''),
      usureg: new FormControl(sessionStorage.getItem('username')),
      usumod: new FormControl('')
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

  registrar() {
    if (this.form.valid) {
      if (this.form.get('rolid').value == null) {
        this.service.registrar(this.form.value).subscribe(() => {
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
        this.service.modificar(this.form.value).subscribe(data => {
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

  elimnar(data: RolDTO) {
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
        this.service.eliminar(data.rolid).subscribe(() => {
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

  open(content, data?: RolDTO) {
    if (data != null) {
      this.form.setValue(data);
      this.changeSistema();
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

}
