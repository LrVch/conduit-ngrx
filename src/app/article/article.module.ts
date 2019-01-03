import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleComponent } from './article/article.component';
import { SharedModule } from '@app/shared';
import { ArticleRoutingModule } from './article-routing.module';
import { EffectsModule } from '@ngrx/effects';
import { ArticleEffects } from './article.effects';
import { StoreModule } from '@ngrx/store';
import * as fromArticle from './article.reducer';
import { ArticleGuard } from './article-guard.service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment.prod';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ArticleRoutingModule,
    EffectsModule.forFeature([ArticleEffects]),
    StoreModule.forFeature('article', fromArticle.articleReducer),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  declarations: [ArticleComponent],
  providers: [ArticleGuard]
})
export class ArticleModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    `${environment.i18nPrefix}/assets/i18n/examples/`,
    '.json'
  );
}
