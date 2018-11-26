import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatToolbarModule,
  MatCardModule,
  MatChipsModule,
  MatProgressBarModule,
  MatPaginatorModule,
  MatTabsModule,
  MatIconModule,
  MatInputModule,
  MatProgressSpinnerModule
} from '@angular/material';

const modules = [
  MatButtonModule,
  MatCheckboxModule,
  MatToolbarModule,
  MatCardModule,
  MatChipsModule,
  MatProgressBarModule,
  MatPaginatorModule,
  MatTabsModule,
  MatIconModule,
  MatInputModule,
  MatProgressSpinnerModule
];

@NgModule({
  imports: [...modules],
  exports: [...modules]
})
export class MaterialModule { }
