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
  MatProgressSpinnerModule,
  MatDialogModule
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
  MatProgressSpinnerModule,
  MatDialogModule
];

@NgModule({
  imports: modules,
  exports: modules
})
export class MaterialModule { }