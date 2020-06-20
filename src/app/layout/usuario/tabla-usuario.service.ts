import { Injectable } from '@angular/core';
import { SortDirection } from 'src/app/shared/directives/sortable.directive';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { DecimalPipe } from '@angular/common';
import { Usuario } from 'src/app/models/usuario';

interface SearchResult {
  usuarios: Usuario[];
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
export class TablaUsuarioService {

  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _usuarios$ = new BehaviorSubject<Usuario[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  usuarios = new BehaviorSubject<Usuario[]>([]);

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
      this._usuarios$.next(result.usuarios);
      this._total$.next(result.total);
    });

    this._search$.next();
  }

  get usuarios$() { return this._usuarios$.asObservable(); }
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
    let usuarios = this.sort(this.usuarios.value, sortColumn, sortDirection);

    // 2. filter
    usuarios = usuarios.filter(rs => this.matches(rs, searchTerm));
    const total = usuarios.length;

    // 3. paginate
    usuarios = usuarios.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({ usuarios, total});
  }

  private matches(usuario: Usuario, term: string) {
    return usuario.usunom.toLowerCase().includes(term.toLowerCase())
      || usuario.usulogin.toLowerCase().includes(term.toLowerCase())
      || usuario.usucorreo.toLowerCase().includes(term.toLowerCase());
  }

  private sort(usuarios: Usuario[], column: string, direction: string): Usuario[] {
    if (direction === '') {
      return usuarios;
    } else {
      return [...usuarios].sort((a, b) => {
        const res = this.compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  private compare(v1, v2) {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }

}
