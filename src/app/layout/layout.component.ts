import { Component, OnInit } from '@angular/core';
// @ts-ignore
import * as defaultTheme from '../../../node_modules/@ng-select/ng-select/themes/default.theme.css';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  username: string;
  collapedSideBar: boolean;
  theme = 'Default theme';
  title = 'personal';
  private style: HTMLStyleElement;
  constructor() { }

  ngOnInit(): void {
  }

  receiveCollapsed($event): void {
    this.collapedSideBar = $event;
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngAfterViewInit(): void {
    setTimeout(() => {
        this.style = document.createElement('style');
        this.style.type = 'text/css';
        this.style.innerHTML = defaultTheme;
        document.getElementsByTagName('head')[0].appendChild(this.style);
    }, 100);
  }

}
