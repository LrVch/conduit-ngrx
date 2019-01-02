import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/core';
import { ProfileComponent } from './profile/profile.component';
import { ProfileGuard } from './profile-guard.service';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    canActivate: [ProfileGuard],
    data: { title: 'conduit.menu.profile' }
  },
  {
    path: ':username',
    component: ProfileComponent,
    canActivate: [ProfileGuard],
    data: { title: 'conduit.menu.profile' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule {}
