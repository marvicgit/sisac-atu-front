import { Sistema } from './sistema';
export class Menu {
    public estreg: string = '';
    public id: number = 0;
    public usureg: string = '';
    public fecreg: string = '';
    public usumod: string = '';
    public menord: number = 0;
    public fecmod: string = '';
    public menpadflg: string = '';
    public menrut: string = '';
    public mennom: string = '';
    public mensig: string = '';
    public menest: string = '';
    public menico: string = '';
    public sistema: Sistema = new Sistema();
    public padre: Menu = null;
}

