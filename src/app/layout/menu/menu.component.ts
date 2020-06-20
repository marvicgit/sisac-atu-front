import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { MenuService } from './menu.service';
import { Sistema } from '../../models/sistema';
import { SistemaService } from '../sistema/sistema.service';
import Swal from 'sweetalert2';
import { TablaMenuService } from './tabla-menu.service';
import { Observable } from 'rxjs';
import { SortableDirective, SortEvent } from 'src/app/shared/directives/sortable.directive';
import { DecimalPipe } from '@angular/common';
import { MenuSistemaDTO } from 'src/app/models/menuSistemaDTO';
import { LoginService } from 'src/app/login/login.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  providers: [TablaMenuService, DecimalPipe]
})
export class MenuComponent implements OnInit {

  form: FormGroup;
  gridMenus: MenuSistemaDTO[] = [];
  sistemas: Sistema[];
  total = 0;
  menus: MenuSistemaDTO[] = [];
  listaMenus: MenuSistemaDTO[] = [];
  page = 0;
  pageSize = 7;
  closeResult: string;

  menus$: Observable<MenuSistemaDTO[]>;
  total$: Observable<number>;
  @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;

  constructor(private formBuilder: FormBuilder,
              private modalService: NgbModal,
              config: NgbModalConfig,
              private service: MenuService,
              public loginService: LoginService,
              public serviceTable: TablaMenuService,
              private serviceSistema: SistemaService) {
    config.backdrop = 'static';
    config.keyboard = false;
   }

  ngOnInit() {
    this.listarSistema();
    this.gridMenu();
    this.iniciarForm();
  }

  iniciarForm() {
    this.form = this.formBuilder.group({
        menid: new FormControl(null),
        mennom: new FormControl(null, [Validators.required]),
        menord: new FormControl(null, [Validators.required]),
        menico: new FormControl(null),
        menrut: new FormControl(null),
        menpadid: new FormControl(''),
        menpadnom: new FormControl(null),
        mensig: new FormControl(null, [Validators.required]),
        estreg: new FormControl(1),
        sisid: new FormControl('', Validators.required),
        sisnom: new FormControl(null),
        sissig: new FormControl(null),
        usureg: new FormControl(sessionStorage.getItem('username')),
        usumod: null
    });
  }
  listarSistema() {
    this.serviceSistema.listar().subscribe(data => {
      this.sistemas = data;
    });
  }

  gridMenu() {
    this.service.listar().subscribe( data => {
      this.serviceTable.menus.next(data);
      this.gridMenus = data;
      this.menus = data;
      this.menus$ = this.serviceTable.menus$
      this.total$ = this.serviceTable.total$;
      this.serviceTable.searchTerm = '';
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
      if (this.form.get('menid').value == null) {
        this.service.registrar(this.form.value).subscribe(() => {
          this.modalService.dismissAll();
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Registrado correctamente',
            showConfirmButton: false,
            timer: 1500
          });
          this.form.reset();
          this.gridMenu();
        });
      } else {
        this.form.get('usumod').setValue(sessionStorage.getItem('username'));
        this.service.modificar(this.form.value).subscribe(() => {
          this.modalService.dismissAll();
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Actualizado correctamente',
            showConfirmButton: false,
            timer: 1500
          });
          this.form.reset();
          this.gridMenu();
        });
      }
    } else {
      Object.values(this.form.controls).forEach(c => {
        c.markAsTouched();
      });
    }
  }

  changeSistema() {
    const id: number = this.form.get('sisid').value;
    this.menus = this.gridMenus.filter(l => {
      return l.sisid == id;
    });
  }

  elimnar(data: MenuSistemaDTO) {
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
        this.service.eliminar(data.menid).subscribe(() => {
          Swal.fire(
            'Eliminado!',
            'El registro fue eliminado correctamente.',
            'success'
          );
          this.gridMenu();
        });
      }
    });
  }

  open(content, data?: MenuSistemaDTO) {
    if (data != null) {
        this.form.setValue(data);
        this.changeSistema();
    } else {
        this.form.reset();
        this.iniciarForm();
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
