import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import { NoAuthGuard } from './no-auth-guard.service';

const routes: Routes = [
  {
    path: 'login',
    component: AuthComponent,
    canActivate: [NoAuthGuard],
    data: { title: 'conduit.menu.login', animation: 'AuthComponent' }
  },
  {
    path: 'register',
    component: AuthComponent,
    canActivate: [NoAuthGuard],
    data: { title: 'conduit.menu.register', animation: 'AuthComponent' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
