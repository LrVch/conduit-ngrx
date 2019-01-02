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
  MatDialogModule,
  MatSnackBarModule,
  MatSelectModule,
  MatOptionModule,
  MatSidenavModule
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
  MatDialogModule,
  MatSnackBarModule,
  MatSelectModule,
  MatOptionModule,
  MatSidenavModule
];

@NgModule({
  imports: modules,
  exports: modules
})
export class MaterialModule { }
