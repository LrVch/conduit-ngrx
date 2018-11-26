import { NgModule } from '@angular/core';

import { AuthComponent } from './auth.component';
import { NoAuthGuard } from './no-auth-guard.service';
import { SharedModule } from '../shared';
import { AuthRoutingModule } from './auth-routing.module';
import { StoreModule } from '@ngrx/store';
import * as fromAuth from './auth.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './auth.effects';

@NgModule({
  imports: [
    SharedModule,
    AuthRoutingModule,
    StoreModule.forFeature('auth', fromAuth.authReducer),
    EffectsModule.forFeature([AuthEffects])
  ],
  declarations: [
    AuthComponent
  ],
  providers: [
    NoAuthGuard
  ]
})
export class AuthModule {}
