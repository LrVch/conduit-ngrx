import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '../reducers';
import {
  LoadTagsRequest,
  LoadArticlesRequest,
  SetTypeOfFeed,
  ResetConfig,
  SetTag,
  SetLimit,
  SetOffset,
  ToggleArticleFavoriteRequest,
  SetPageIndex,
  ClearReturnArticlesConfig
} from '../articles/articles.actions';
import {
  selectArticlesTags,
  selectArticlesTagsLoading,
  selectArticlesTagsFailLoading,
  getArticlesLimit,
  selectArticlesItems,
  getArticlesCurrentTag,
  getArticlesFiltersType,
  selectArticlesCount,
  selectArticlesLoading,
  getArticlesPageIndex,
  selectArticlesReturnConfig
} from '../articles/articles.selectors';
import { Article } from '../core';
import { selectAuthLoggedIn } from '../auth/auth.selectors';
import { first, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LogoutAction } from '../auth/auth.actions';
import { ArticlesConfigState } from '../articles/articlesConfig.reducer';

@Component({
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, AfterViewChecked {
  constructor(
    private store: Store<AppState>
  ) { }

  isAuthenticated$: Observable<boolean>;
  loadingTags$: Observable<boolean>;
  errorLoadingTags$: Observable<boolean>;
  tags$: Observable<Array<string>>;
  limit$: Observable<number>;
  pageIndex$: Observable<number>;
  atricles$: Observable<Article[]>;
  currentTag$: Observable<string>;
  type$: Observable<string>;
  tabs = [{ title: 'Global Feed', value: 'all' }, { title: 'Your Feed', value: 'feed' }];
  pageSizeOptions = [5, 10, 25, 100];
  isLoggegId: boolean;
  articlesCount$: Observable<number>;
  loadingArticles$: Observable<boolean>;
  errorLoadingArticles$: Observable<boolean>;

  ngOnInit() {
    combineLatest(
      this.store.pipe(select(selectArticlesReturnConfig)),
      this.store.pipe(select(selectAuthLoggedIn)),
    ).pipe(first()).subscribe(([config, isLoggegIn]: [ArticlesConfigState, boolean]) => {
      this.store.dispatch(new ClearReturnArticlesConfig());
      this.store.dispatch(new ResetConfig());

      if (config && isLoggegIn) {
        const { tag, offset, limit } = config.filters;
        this.store.dispatch(new SetTypeOfFeed({ type: config.type }));
        this.store.dispatch(new SetLimit({ limit }));
        this.store.dispatch(new SetOffset({ offset }));
        this.store.dispatch(new SetPageIndex({ pageIndex: offset / limit }));
        this.store.dispatch(new SetTag({ tag }));
      } else {
        if (isLoggegIn) {
          this.store.dispatch(new SetTypeOfFeed({ type: 'feed' }));
        }
      }
    });

    this.store.dispatch(new LoadTagsRequest);
    this.store.dispatch(new LoadArticlesRequest());

    this.tags$ = this.store.pipe(select(selectArticlesTags));
    this.currentTag$ = this.store.pipe(select(getArticlesCurrentTag));
    this.loadingTags$ = this.store.pipe(select(selectArticlesTagsLoading));
    this.errorLoadingTags$ = this.store.pipe(select(selectArticlesTagsFailLoading));

    this.type$ = combineLatest(this.store.pipe(select(getArticlesFiltersType)), this.currentTag$, (type, tag) => {
      return tag ? '' : type;
    });

    this.atricles$ = this.store.pipe(select(selectArticlesItems));
    this.limit$ = this.store.pipe(select(getArticlesLimit));
    this.pageIndex$ = this.store.pipe(select(getArticlesPageIndex));
    this.articlesCount$ = this.store.pipe(select(selectArticlesCount));
    this.loadingArticles$ = this.store.pipe(select(selectArticlesLoading));
  }

  ngAfterViewChecked() {
    // console.log('HomeComponent');
  }

  onSelectedTag(tag: string): void {
    this.store.dispatch(new ResetConfig());
    this.store.dispatch(new SetTag({ tag }));
    this.store.dispatch(new LoadArticlesRequest());
  }

  onSelectedType(type: string): void {
    this.store.pipe(select(selectAuthLoggedIn)).pipe(first()).subscribe(isLoggegId => {
      this.store.dispatch(new ResetConfig());
      this.store.dispatch(new SetTypeOfFeed({ type }));
      if (type === 'feed' && !isLoggegId) {
        this.store.dispatch(new LogoutAction());
        return;
      }
      this.store.dispatch(new LoadArticlesRequest());
    });
  }

  onPageChange(page): void {
    const { pageIndex, pageSize } = page;
    const limit = pageSize;
    const offset = limit * pageIndex;
    this.store.dispatch(new SetLimit({ limit }));
    this.store.dispatch(new SetPageIndex({ pageIndex }));
    this.store.dispatch(new SetOffset({ offset }));
    this.store.dispatch(new LoadArticlesRequest());
  }

  onFavorited(article: Article): void {
    this.store.dispatch(new ToggleArticleFavoriteRequest({ article }));
  }
}
