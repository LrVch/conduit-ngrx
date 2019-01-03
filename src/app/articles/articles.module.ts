import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import * as fromArticles from './articles.reducer';
import * as fromArticlesConfig from './articlesConfig.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ArticlesEffects } from './articles.effects';
import { SharedModule } from '@app/shared';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('articles', fromArticles.articlesReducer),
    StoreModule.forFeature('articlesConfig', fromArticlesConfig.articlesConfigReducer),
    EffectsModule.forFeature([ArticlesEffects]),
    SharedModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  declarations: []
})
export class ArticlesModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    `${environment.i18nPrefix}/assets/i18n/`,
    '.json'
  );
}
