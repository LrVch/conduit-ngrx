import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core';
import { ProfileComponent } from './profile/profile.component';
import { ProfileGuard } from './profile-guard.service';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    canActivate: [ProfileGuard],
  },
  {
    path: ':username',
    component: ProfileComponent,
    canActivate: [ProfileGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule {}
