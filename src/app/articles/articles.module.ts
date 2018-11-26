import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import * as fromArticles from './articles.reducer';
import * as fromArticlesConfig from './articlesConfig.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ArticlesEffects } from './articles.effects';
import { SharedModule } from '../shared';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('articles', fromArticles.articlesReducer),
    StoreModule.forFeature('articlesConfig', fromArticlesConfig.articlesConfigReducer),
    EffectsModule.forFeature([ArticlesEffects]),
    SharedModule
  ],
  declarations: []
})
export class ArticlesModule { }
