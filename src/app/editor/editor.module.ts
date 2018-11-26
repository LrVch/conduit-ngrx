import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from './editor/editor.component';
import { SharedModule } from '../shared';
import { EditorRoutingModule } from './editor-routing.module';
import { EditorFormComponent } from './editor-form/editor-form.component';
import { StoreModule } from '@ngrx/store';
import * as fromEditor from './editor.reducer';
import { EffectsModule } from '@ngrx/effects';
import { EditorEffects } from './editor.effects';
import { EditorGuard } from './editor-guard.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    EditorRoutingModule,
    StoreModule.forFeature('editor', fromEditor.editorReducer),
    EffectsModule.forFeature([EditorEffects])
  ],
  declarations: [EditorComponent, EditorFormComponent],
  providers: [EditorGuard]
})
export class EditorModule { }
