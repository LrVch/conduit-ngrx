import { Component, OnInit, AfterViewChecked, ViewChild } from '@angular/core';
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
  ToggleArticleFavoriteRequest
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
  selectArticlesLoading
} from '../articles/articles.selectors';
import { Article } from '../core';
import { selectAuthLoggedIn } from '../auth/auth.selectors';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewChecked {
  constructor(
    private store: Store<AppState>,
    private router: Router
  ) { }

  isAuthenticated$: Observable<boolean>;
  loadingTags$: Observable<boolean>;
  errorLoadingTags$: Observable<boolean>;
  tags$: Observable<Array<string>>;
  limit$: Observable<number>;
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
    this.store.dispatch(new ResetConfig());
    this.store.pipe(select(selectAuthLoggedIn), first()).subscribe(isLoggegId => {
      this.isLoggegId = isLoggegId;
      if (isLoggegId) {
        this.store.dispatch(new SetTypeOfFeed({ type: 'feed' }));
      } else {
        this.store.dispatch(new SetTypeOfFeed({ type: 'all' }));
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
    if (type === 'feed' && !this.isLoggegId) {
      this.router.navigateByUrl('/login');
      return;
    }

    this.store.dispatch(new ResetConfig());
    this.store.dispatch(new SetTypeOfFeed({ type }));
    this.store.dispatch(new LoadArticlesRequest());
  }

  onPageChange(page): void {
    const { pageIndex, pageSize } = page;
    const limit = pageSize;
    const offset = limit * pageIndex;
    this.store.dispatch(new SetLimit({ limit }));
    this.store.dispatch(new SetOffset({ offset }));
    this.store.dispatch(new LoadArticlesRequest());
  }

  onFavorited(article: Article): void {
    this.store.dispatch(new ToggleArticleFavoriteRequest({ article }));
  }
}
