import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { DecimalPipe } from '@angular/common';
import { SortDirection } from 'src/app/shared/directives/sortable.directive';
import { Funcionalidad } from 'src/app/models/funcionalidad';

interface SearchResult {
  funcionalidades: Funcionalidad[];
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
export class TablaFuncionalidadService {

  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _funcionalidades$ = new BehaviorSubject<Funcionalidad[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  funcionalidades = new BehaviorSubject<Funcionalidad[]>([]);

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
      this._funcionalidades$.next(result.funcionalidades);
      this._total$.next(result.total);
    });

    this._search$.next();
  }

  get funcionalidades$() { return this._funcionalidades$.asObservable(); }
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
    let funcionalidades = this.sort(this.funcionalidades.value, sortColumn, sortDirection);

    // 2. filter
    funcionalidades = funcionalidades.filter(rs => this.matches(rs, searchTerm));
    const total = funcionalidades.length;

    // 3. paginate
    funcionalidades = funcionalidades.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({ funcionalidades, total});
  }

  private matches(funcionalidad: Funcionalidad, term: string) {
    return funcionalidad.funnom.toLowerCase().includes(term.toLowerCase())
      || funcionalidad.funsig.toLowerCase().includes(term.toLowerCase())
      || funcionalidad.funnom.toLowerCase().includes(term.toLowerCase());
  }

  private sort(funcionalidades: Funcionalidad[], column: string, direction: string): Funcionalidad[] {
    if (direction === '') {
      return funcionalidades;
    } else {
      return [...funcionalidades].sort((a, b) => {
        const res = this.compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  private compare(v1, v2) {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }

}
