import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import * as fromAppSettings from './app-settings.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AppSettingsEffects } from './app-settings.effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('appSettings', fromAppSettings.appSettingsReducer),
    EffectsModule.forFeature([AppSettingsEffects])
  ]
})
export class AppSettingsModule { }
