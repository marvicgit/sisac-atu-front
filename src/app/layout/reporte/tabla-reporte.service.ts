import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { DecimalPipe } from '@angular/common';
import { SortDirection } from 'src/app/shared/directives/sortable.directive';
import { ReporteDTO } from 'src/app/models/reporteDTO';

interface SearchResult {
  reportes: ReporteDTO[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: string;
  sortDirection: SortDirection;
}

@Injectable({
  providedIn: 'root'
})
export class TablaReporteService {

  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _reportes$ = new BehaviorSubject<ReporteDTO[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  reportes = new BehaviorSubject<ReporteDTO[]>([]);

  private _state: State = {
    page: 1,
    pageSize: 4,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  constructor(private pipe: DecimalPipe) {
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      switchMap(() => this._search()),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._reportes$.next(result.reportes);
      this._total$.next(result.total);
    });

    this._search$.next();
  }

  get reportes$() { return this._reportes$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }

  set page(page: number) { this._set({page}); }
  set pageSize(pageSize: number) { this._set({pageSize}); }
  set searchTerm(searchTerm: string) { this._set({searchTerm}); }
  set sortColumn(sortColumn: string) { this._set({sortColumn}); }
  set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;

    // 1. sort
    let reportes = this.sort(this.reportes.value, sortColumn, sortDirection);

    // 2. filter
    reportes = reportes.filter(rs => this.matches(rs, searchTerm));
    const total = reportes.length;

    // 3. paginate
    reportes = reportes.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({ reportes, total});
  }

  private matches(reporte: ReporteDTO, term: string) {
    return reporte.usunom.toLowerCase().includes(term.toLowerCase())
      || reporte.usuapepat.toLowerCase().includes(term.toLowerCase())
      || reporte.usulog.toLowerCase().includes(term.toLowerCase())
      || reporte.sisnom.toLowerCase().includes(term.toLowerCase())
      || reporte.rolnom.toLowerCase().includes(term.toLowerCase())
      || reporte.usuarea.toLowerCase().includes(term.toLowerCase());
  }

  private sort(reportes: ReporteDTO[], column: string, direction: string): ReporteDTO[] {
    if (direction === '') {
      return reportes;
    } else {
      return [...reportes].sort((a, b) => {
        const res = this.compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  private compare(v1, v2) {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }
}
