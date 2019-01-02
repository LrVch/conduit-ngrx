import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import { NoAuthGuard } from './no-auth-guard.service';

const routes: Routes = [
  {
    path: 'login',
    component: AuthComponent,
    canActivate: [NoAuthGuard],
    data: { title: 'conduit.menu.login' }
  },
  {
    path: 'register',
    component: AuthComponent,
    canActivate: [NoAuthGuard],
    data: { title: 'conduit.menu.register' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
