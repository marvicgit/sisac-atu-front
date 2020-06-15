import { Injectable } from '@angular/core';
import { MenuSistemaDTO } from 'src/app/models/menuSistemaDTO';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { DecimalPipe } from '@angular/common';
import { SortDirection } from 'src/app/shared/directives/sortable.directive';

interface SearchResult {
  menus: MenuSistemaDTO[];
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
export class TablaMenuService {

  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _menus$ = new BehaviorSubject<MenuSistemaDTO[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  menus = new BehaviorSubject<MenuSistemaDTO[]>([]);

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
      this._menus$.next(result.menus);
      this._total$.next(result.total);
    });

    this._search$.next();
  }

  get menus$() { return this._menus$.asObservable(); }
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
    let menus = this.sort(this.menus.value, sortColumn, sortDirection);

    // 2. filter
    menus = menus.filter(rs => this.matches(rs, searchTerm));
    const total = menus.length;

    // 3. paginate
    menus = menus.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({ menus, total});
  }

  private matches(menu: MenuSistemaDTO, term: string) {
    return menu.mennom.toLowerCase().includes(term.toLowerCase())
      || menu.mensig.toLowerCase().includes(term.toLowerCase())
      || menu.sisnom.toLowerCase().includes(term.toLowerCase())
      || menu.sissig.toLowerCase().includes(term.toLowerCase())
      || menu.menrut.toLowerCase().includes(term.toLowerCase());
  }

  private sort(menus: MenuSistemaDTO[], column: string, direction: string): MenuSistemaDTO[] {
    if (direction === '') {
      return menus;
    } else {
      return [...menus].sort((a, b) => {
        const res = this.compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  private compare(v1, v2) {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }
}
