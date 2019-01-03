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
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    EditorRoutingModule,
    StoreModule.forFeature('editor', fromEditor.editorReducer),
    EffectsModule.forFeature([EditorEffects]),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  declarations: [EditorComponent, EditorFormComponent],
  providers: [EditorGuard]
})
export class EditorModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    `${environment.i18nPrefix}/assets/i18n/`,
    '.json'
  );
}
