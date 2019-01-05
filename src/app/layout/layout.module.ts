import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import * as fromLayout from './layout.reducer';
import { EffectsModule } from '@ngrx/effects';
import { LayoutEffects } from './layout.effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('layout', fromLayout.layoutReducer),
    EffectsModule.forFeature([LayoutEffects])
  ],
  declarations: []
})
export class LayoutModule { }
