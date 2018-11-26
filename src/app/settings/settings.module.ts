import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings/settings.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsFormComponent } from './settings-form/settings-form.component';
import { SharedModule } from '../shared';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SettingsRoutingModule
  ],
  declarations: [SettingsComponent, SettingsFormComponent]
})
export class SettingsModule { }
