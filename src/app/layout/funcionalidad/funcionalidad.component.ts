import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Funcionalidad } from '../../models/funcionalidad';
import { NgbModal, ModalDismissReasons, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FuncionalidadService } from './funcionalidad.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { SortableDirective, SortEvent } from 'src/app/shared/directives/sortable.directive';
import { TablaFuncionalidadService } from './tabla-funcionalidad.service';
import { DecimalPipe } from '@angular/common';
import { LoginService } from 'src/app/login/login.service';

@Component({
  selector: 'app-funcionalidad',
  templateUrl: './funcionalidad.component.html',
  styleUrls: ['./funcionalidad.component.scss'],
  providers: [TablaFuncionalidadService, DecimalPipe]
})
export class FuncionalidadComponent implements OnInit {
  form: FormGroup;
  funcionalidades: Funcionalidad[] = [];
  listaFunc: Funcionalidad[] = [];
  total = 0;
  page = 0;
  closeResult: string;
  idSistema = 1;
  funcionalidades$: Observable<Funcionalidad[]>;
  total$: Observable<number>;
  @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;

  constructor(private formBuilder: FormBuilder,
              private modalService: NgbModal,
              config: NgbModalConfig,
              public serviceTable: TablaFuncionalidadService,
              public loginService: LoginService,
              private service: FuncionalidadService) {
    config.backdrop = 'static';
    config.keyboard = false;
   }

  ngOnInit() {
    this.listar();
    this.iniciarForm();
  }

  listar() {
    this.service.listar().subscribe((data: Funcionalidad[]) => {
      this.serviceTable.funcionalidades.next(data);
      this.funcionalidades$ = this.serviceTable.funcionalidades$
      this.total$ = this.serviceTable.total$;
      this.serviceTable.searchTerm = '';
      this.funcionalidades = data;
      this.listaFunc = data;
      this.total = data.length;
    });
  }

  iniciarForm() {
    this.form = this.formBuilder.group({
      id: new FormControl(null),
      funnom: new FormControl('', Validators.required),
      fundes: new FormControl('', Validators.required),
      funsig: new FormControl('', Validators.required),
      estreg: new FormControl(1),
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
      if (this.form.get('id').value == null) {
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
        this.service.modificar(this.form.value).subscribe(() => {
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

  elimnar(data: Funcionalidad) {
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
        this.service.eliminar(data.id).subscribe(() => {
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

  open(content, data?: Funcionalidad) {
    if (data != null) {
      this.form.get('id').setValue(data.id);
      this.form.get('funnom').setValue(data.funnom);
      this.form.get('fundes').setValue(data.fundes);
      this.form.get('funsig').setValue(data.funsig);
      this.form.get('estreg').setValue(data.estreg);
  } else {
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
