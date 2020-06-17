import { Injectable } from '@angular/core';
import { Rol } from 'src/app/models/rol';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { DecimalPipe } from '@angular/common';
import { SortDirection } from 'src/app/shared/directives/sortable.directive';
import { RolDTO } from 'src/app/models/rolDTO';

interface SearchResult {
  roles: RolDTO[];
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
export class TablaRolService {

  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _roles$ = new BehaviorSubject<RolDTO[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  roles = new BehaviorSubject<RolDTO[]>([]);

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
      this._roles$.next(result.roles);
      this._total$.next(result.total);
    });

    this._search$.next();
  }

  get roles$() { return this._roles$.asObservable(); }
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
    let roles = this.sort(this.roles.value, sortColumn, sortDirection);

    // 2. filter
    roles = roles.filter(rs => this.matches(rs, searchTerm));
    const total = roles.length;

    // 3. paginate
    roles = roles.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({ roles, total});
  }

  private matches(rol: RolDTO, term: string) {
    return rol.rolnom.toLowerCase().includes(term.toLowerCase())
      || rol.rolsig.toLowerCase().includes(term.toLowerCase())
      || rol.rolnom.toLowerCase().includes(term.toLowerCase())
      || rol.sisnom.toLowerCase().includes(term.toLowerCase());
  }

  private sort(roles: RolDTO[], column: string, direction: string): RolDTO[] {
    if (direction === '') {
      return roles;
    } else {
      return [...roles].sort((a, b) => {
        const res = this.compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  private compare(v1, v2) {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }
}
