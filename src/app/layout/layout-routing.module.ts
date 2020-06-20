import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { AuthGuard } from '../shared';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
        //{ path: '', redirectTo: 'home', pathMatch: 'prefix' },
        { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule), canActivate: [AuthGuard] },
        { path: 'sistema', loadChildren: () => import('./sistema/sistema.module').then(m => m.SistemaModule), canActivate: [AuthGuard] },
        { path: 'menu', loadChildren: () => import('./menu/menu.module').then(m => m.MenuModule), canActivate: [AuthGuard] },
        { path: 'funcionalidad', loadChildren: () => import('./funcionalidad/funcionalidad.module').then(m => m.FuncionalidadModule), canActivate: [AuthGuard]  },
        { path: 'rol', loadChildren: () => import('./rol/rol.module').then(m => m.RolModule), canActivate: [AuthGuard]  },
        { path: 'rol-sistema', loadChildren: () => import('./rol-sistema/rol-sistema.module').then(m => m.RolSistemaModule), canActivate: [AuthGuard]  },
        { path: 'reporte', loadChildren: () => import('./reporte/reporte.module').then(m => m.ReporteModule), canActivate: [AuthGuard]  },
        { path: 'usuario', loadChildren: () => import('./usuario/usuario.module').then(m => m.UsuarioModule), canActivate: [AuthGuard]  },
        { path: 'usuario-sistema', loadChildren: () => import('./usuario-sistema/usuario-sistema.module').then(m => m.UsuarioSistemaModule), canActivate: [AuthGuard]  },
        { path: 'cambiar-contrasena', loadChildren: () => import('./cambiar-contrasena/cambiar-contrasena.module').then(m => m.CambiarContrasenaModule), canActivate: [AuthGuard] }
    ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
