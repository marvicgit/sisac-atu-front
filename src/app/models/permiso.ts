import { Menu } from './menu';
import { Rol } from './rol';
import { Funcionalidad } from './funcionalidad';
export class Permiso {
    public sissig: string;
    public usulog: string;
    public usucod: number;
    public menus: Menu[];
    public roles: Rol[];
    public funcionalidades: Funcionalidad[];
}