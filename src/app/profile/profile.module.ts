import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { SharedModule } from '@app/shared';
import { EffectsModule } from '@ngrx/effects';
import { ProfileEffects } from './profile.effects';
import { StoreModule } from '@ngrx/store';
import * as fromProfile from './profile.reducer';
import { ProfileGuard } from './profile-guard.service';

// console.log('profile');

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ProfileRoutingModule,
    EffectsModule.forFeature([ProfileEffects]),
    StoreModule.forFeature('profile', fromProfile.profileReducer)
  ],
  declarations: [ProfileComponent],
  providers: [ProfileGuard]
})
export class ProfileModule { }
