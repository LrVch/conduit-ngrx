import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleComponent } from './article/article.component';
import { SharedModule } from '../shared';
import { ArticleRoutingModule } from './article-routing.module';
import { EffectsModule } from '@ngrx/effects';
import { ArticleEffects } from './article.effects';
import { StoreModule } from '@ngrx/store';
import * as fromArticle from './article.reducer';
import { ArticleGuard } from './article-guard.service';
import { ArticleFullComponent } from './article-full/article-full.component';
import { MarkdownPipe } from './markdown.pipe';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ArticleRoutingModule,
    EffectsModule.forFeature([ArticleEffects]),
    StoreModule.forFeature('article', fromArticle.articleReducer)
  ],
  declarations: [ArticleComponent, ArticleFullComponent, MarkdownPipe],
  providers: [ArticleGuard]
})
export class ArticleModule { }
