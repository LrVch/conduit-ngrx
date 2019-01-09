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
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ProfileRoutingModule,
    EffectsModule.forFeature([ProfileEffects]),
    StoreModule.forFeature('profile', fromProfile.profileReducer),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  declarations: [ProfileComponent],
  providers: [ProfileGuard]
})
export class ProfileModule {}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    `${environment.i18nPrefix}/assets/i18n/`,
    '.json'
  );
}
