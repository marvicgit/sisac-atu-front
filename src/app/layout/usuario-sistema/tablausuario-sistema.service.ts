import { Injectable } from '@angular/core';
import { UsuarioSistemaDTO } from '../../models/usuarioSistemaDTO';
import { SortDirection } from 'src/app/shared/directives/sortable.directive';
import { BehaviorSubject, Subject, Observable, of } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { tap, switchMap } from 'rxjs/operators';

interface SearchResult {
  usuariosSistemas: UsuarioSistemaDTO[];
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
export class TablausuarioSistemaService {

  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _usuariosSistemas$ = new BehaviorSubject<UsuarioSistemaDTO[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  usuariosSistemas = new BehaviorSubject<UsuarioSistemaDTO[]>([]);

  private _state: State = {
    page: 1,
    pageSize: 4,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  }

  constructor(private pipe: DecimalPipe) {
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      switchMap(() => this._search()),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._usuariosSistemas$.next(result.usuariosSistemas);
      this._total$.next(result.total);
    });

    this._search$.next();
  }

  get usuariosSistemas$() { return this._usuariosSistemas$.asObservable(); }
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
    let usuariosSistemas = this.sort(this.usuariosSistemas.value, sortColumn, sortDirection);

    // 2. filter
    usuariosSistemas = usuariosSistemas.filter(rs => this.matches(rs, searchTerm));
    const total = usuariosSistemas.length;

    // 3. paginate
    usuariosSistemas = usuariosSistemas.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({ usuariosSistemas, total});
  }

  private matches(usuarioSistema: UsuarioSistemaDTO, term: string) {
    return usuarioSistema.usunom.toLowerCase().includes(term.toLowerCase())
      || usuarioSistema.usulogin.toLowerCase().includes(term.toLowerCase())
      || usuarioSistema.rolnom.toLowerCase().includes(term.toLowerCase())
      || usuarioSistema.sisnom.toLowerCase().includes(term.toLowerCase());
  }

  private sort(usuariosSistemas: UsuarioSistemaDTO[], column: string, direction: string): UsuarioSistemaDTO[] {
    if (direction === '') {
      return usuariosSistemas;
    } else {
      return [...usuariosSistemas].sort((a, b) => {
        const res = this.compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  private compare(v1, v2) {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }
}
