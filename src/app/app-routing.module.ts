import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './shared';
import { SelectivePreloadingStrategyService } from './selective-preloading-strategy.service';

const routes: Routes = [
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
  { path: '', loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule), canActivate: [AuthGuard] },
  { path: 'oauth2', loadChildren: () => import('./oauth2/oauth2.module').then(m => m.Oauth2Module) },
  { path: 'olvide-contrasena', loadChildren: () => import('./olvide-contrasena/olvide-contrasena.module').then(m => m.OlvideContrasenaModule) },
  // { path: 'recuperar/:token', loadChildren: () => import('./recuperar/recuperar.module').then(m => m.RecuperarModule) },
  { path: '**', redirectTo: 'not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    enableTracing: false,
    preloadingStrategy: SelectivePreloadingStrategyService,
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
