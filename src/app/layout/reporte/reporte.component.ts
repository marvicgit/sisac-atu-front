import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { Sistema } from 'src/app/models/sistema';
import { SistemaService } from '../sistema/sistema.service';
import { RolService } from '../rol/rol.service';
import { Funcionalidad } from 'src/app/models/funcionalidad';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UsuarioService } from '../usuario/usuario.service';
import { ReporteDTO } from '../../models/reporteDTO';
import { Observable } from 'rxjs';
import { SortableDirective, SortEvent } from 'src/app/shared/directives/sortable.directive';
import { TablaReporteService } from './tabla-reporte.service';
import { DecimalPipe } from '@angular/common';
import { RolDTO } from 'src/app/models/rolDTO';
import { UsuarioDTO } from 'src/app/models/usuarioDTO';
import { ReporteService } from './reporte.service';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.scss'],
  providers: [TablaReporteService, DecimalPipe]
})
export class ReporteComponent implements OnInit {

  reporte: ReporteDTO[] = [];
  filtrarReporte: ReporteDTO[] = [];
  sistemas: Sistema[] = [];
  roles: RolDTO[] = [];
  funcionalidades: Funcionalidad[] = [];
  usuarios: UsuarioDTO[] = [];
  page = 0;
  total = 0;
  closeResult: string;
  seconds = true;
  activoInactivo: string[] = [ '1', '0' ];
  reportes$: Observable<ReporteDTO[]>;
  total$: Observable<number>;
  @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;
  constructor(private formBuilder: FormBuilder,
              private serviceSistema: SistemaService,
              private serviceRol: RolService,
              private service: ReporteService,
              public serviceTable: TablaReporteService,
              private serviceUsuario: UsuarioService) { }

  ngOnInit() {
    this.listar();
    this.listarSistemas();
    this.listarRoles();
    this.listarUsuarios();
  }

  listar() {
    this.service.listar().subscribe((data: ReporteDTO[]) => {
      this.serviceTable.reportes.next(data);
      this.reportes$ = this.serviceTable.reportes$
      this.total$ = this.serviceTable.total$;
      this.serviceTable.searchTerm = '';
      this.reporte = data;
      this.filtrarReporte = data;
      this.total = data.length;
    });
  }

  listarSistemas() {
    this.serviceSistema.listar().subscribe((data: Sistema[]) => {
      this.sistemas = data;
    });
  }

  listarRoles() {
    /*this.serviceRol.listar().subscribe((data: RolDTO[]) => {
      this.roles = data;
    });*/
  }

  listarUsuarios() {
    /*this.serviceUsuario.listar().subscribe((data: Usuario[]) => {
      this.usuarios = data;
    });*/
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

  buscar() {
   /* this.filtrarReporte = this.reporte;
    const usulog = this.form.get('usulog').value;
    const siscod = this.form.get('siscod').value;
    const rolcod = this.form.get('rolcod').value;
    console.log(usulog);
    console.log(siscod);
    console.log(rolcod);
    if (usulog && siscod && rolcod) {
      this.filtrarReporte = this.filtrarReporte.filter(x => x.login == usulog && x.siscod == siscod && x.rolcod === rolcod);
      this.total = this.filtrarReporte.length;
    } else if (usulog && siscod) {
      this.filtrarReporte = this.filtrarReporte.filter(x => x.usulog == usulog && x.siscod == siscod);
      this.total = this.filtrarReporte.length;
    } else if (usulog && rolcod) {
      this.filtrarReporte = this.filtrarReporte.filter(x => x.usulog == usulog && x.rolcod == rolcod);
      this.total = this.filtrarReporte.length;
    } else if (siscod && rolcod) {
      this.filtrarReporte = this.filtrarReporte.filter(x => x.siscod == siscod && x.rolcod == rolcod);
      this.total = this.filtrarReporte.length;
    } else if (usulog) {
      this.filtrarReporte = this.filtrarReporte.filter(x => x.usulog == usulog);
      this.total = this.filtrarReporte.length;
    } else if (siscod) {
      this.filtrarReporte = this.filtrarReporte.filter(x => x.siscod == siscod);
      this.total = this.filtrarReporte.length;
    } else if (rolcod) {
      this.filtrarReporte = this.filtrarReporte.filter(x => x.rolcod == rolcod);
      this.total = this.filtrarReporte.length;
    } else {
      this.filtrarReporte = this.reporte;
      this.total = this.filtrarReporte.length;
    }*/

  }

  descargarReporte() {
  /* const busqueda: HashBusquedaReporteDTO = new HashBusquedaReporteDTO();
    busqueda.usulog = this.form.get('usulog').value;
    busqueda.siscod = this.form.get('siscod').value;
    busqueda.rolcod = this.form.get('rolcod').value;*/
    this.service.generarReporte().subscribe(data => {

      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none');
      document.body.appendChild(a);
      a.href = url;
      a.download = 'archivo.pdf';
      a.click();
    });
  }

}
