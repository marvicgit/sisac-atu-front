import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { Sistema } from '../../models/sistema';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { NgbModal, ModalDismissReasons, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { SistemaService } from './sistema.service';
import Swal from 'sweetalert2';
import { TablaSistemaService } from './tabla-sistema.service';
import { Observable } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { SortableDirective, SortEvent } from 'src/app/shared/directives/sortable.directive';
import { LoginService } from 'src/app/login/login.service';

@Component({
  selector: 'app-sistema',
  templateUrl: './sistema.component.html',
  styleUrls: ['./sistema.component.scss'],
  providers: [TablaSistemaService, DecimalPipe]
})
export class SistemaComponent implements OnInit {
  form: FormGroup;
  sistemas: Sistema[] = [];
  listaSistemas: Sistema[] = [];
  page = 0;
  total = 0;
  pageSize = 7;
  closeResult: string;
  activoInactivo: string[] = [ '1', '0'];

  sistemas$: Observable<Sistema[]>;
  total$: Observable<number>;
  @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;
  constructor(private formBuilder: FormBuilder,
              private modalService: NgbModal,
              config: NgbModalConfig,
              public serviceTable: TablaSistemaService,
              public loginService: LoginService,
              private service: SistemaService) {
    config.backdrop = 'static';
    config.keyboard = false;
   }
  ngOnInit() {
    this.iniciarForm();
    this.listar();
  }

  iniciarForm() {
    this.form = this.formBuilder.group({
        id: new FormControl(null),
        sisnom: new FormControl('', [Validators.required, Validators.maxLength(50)]),
        sisdes: new FormControl('', [Validators.required, Validators.maxLength(100)]),
        sissig: new FormControl('', [Validators.required, Validators.maxLength(15)]),
        estreg: new FormControl(1),
        usureg: new FormControl(sessionStorage.getItem('username')),
        fecmod: '',
        fecreg: '',
        usumod: ''
      });
  }

  listar() {
    this.service.listar().subscribe((data: Sistema[]) => {
      this.serviceTable.sistemas.next(data);
      this.sistemas$ = this.serviceTable.sistemas$
      this.total$ = this.serviceTable.total$;
      this.serviceTable.searchTerm = '';

      this.sistemas = data;
      this.listaSistemas = data;
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

  applyFilter(searchValue: string = null) {
    this.listaSistemas = this.sistemas;
    if (searchValue) {
      this.listaSistemas = this.listaSistemas.filter(x => (x.sisnom.toLocaleLowerCase().indexOf(searchValue.toLocaleLowerCase()) > -1) ||
                                   x.sissig.toLocaleLowerCase().indexOf(searchValue.toLocaleLowerCase()) > -1);
      this.total = this.listaSistemas.length;
    }
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

  elimnar(data: Sistema) {
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

    open(content, sistema?: Sistema) {
        if (sistema != null) {
            this.form.setValue(sistema);
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


