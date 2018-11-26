import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import * as fromLayout from './layout.reducer';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('layout', fromLayout.layoutReducer)
  ],
  declarations: []
})
export class LayoutModule { }
