import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, of, Subject, combineLatest } from 'rxjs';
import { withLatestFrom, map, switchMap, take, filter, takeUntil, first } from 'rxjs/operators';
import { Profile, User, Article } from 'src/app/core';
import { AppState } from 'src/app/reducers';
import { Store, select } from '@ngrx/store';
import { selectUser } from 'src/app/auth/auth.selectors';
import { ProfileClear, ProfileToggleFollowingRequest } from '../profile.actions';
import { selectProfile, selectProfileUsername } from '../profile.selectors';
import {
  ResetConfig,
  SetAuthor,
  LoadArticlesRequest,
  ToggleArticleFavoriteRequest,
  SetLimit, SetOffset,
  SetFavorited,
  SetPageIndex
} from 'src/app/articles/articles.actions';
import {
  selectArticlesItems,
  getArticlesLimit,
  selectArticlesCount,
  selectArticlesLoading,
  getArticlesAuthor,
  getArticlesPageIndex,
  selectArticlesReturnConfig
} from 'src/app/articles/articles.selectors';
import { ArticlesConfigState } from 'src/app/articles/articlesConfig.reducer';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  isUser$: Observable<boolean>;
  profile$: Observable<Profile>;
  tags$: Observable<Array<string>>;
  limit$: Observable<number>;
  pageIndex$: Observable<number>;
  atricles$: Observable<Article[]>;
  type$: Observable<string>;
  tabs = [{ title: 'By Author', value: 'author' }, { title: 'Favorited Posts', value: 'favorited' }];
  pageSizeOptions = [5, 10, 25, 100];
  articlesCount$: Observable<number>;
  loadingArticles$: Observable<boolean>;
  errorLoadingArticles$: Observable<boolean>;
  destroStream$ = new Subject<any>();

  constructor(
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.profile$ = this.store.pipe(select(selectProfile));
    this.isUser$ = this.profile$.pipe(
      withLatestFrom(this.store.pipe(select(selectUser))),
      switchMap(([profile, user]: [Profile, User]) => {
        return user ? of(profile.username === user.username) : of(false);
      }),
    );

    this.atricles$ = this.store.pipe(select(selectArticlesItems));
    this.limit$ = this.store.pipe(select(getArticlesLimit));
    this.pageIndex$ = this.store.pipe(select(getArticlesPageIndex));
    this.articlesCount$ = this.store.pipe(select(selectArticlesCount));
    this.loadingArticles$ = this.store.pipe(select(selectArticlesLoading));

    combineLatest(
      this.store.pipe(select(selectArticlesReturnConfig)),
      this.store.pipe(select(selectProfileUsername))
    ).pipe(
      first(),
      filter(username => !!username),
    ).subscribe(([config, username]: [ArticlesConfigState, string]) => {
      this.store.dispatch(new ResetConfig());
      if (config) {
        const { author, favorited, limit, offset } = config.filters;
        this.store.dispatch(new SetAuthor({ author }));
        this.store.dispatch(new SetFavorited({ favorited }));
        this.store.dispatch(new SetLimit({ limit }));
        this.store.dispatch(new SetOffset({ offset }));
        this.store.dispatch(new SetPageIndex({ pageIndex: offset / limit }));
      } else {
        this.store.dispatch(new SetAuthor({ author: username }));
      }
      this.store.dispatch(new LoadArticlesRequest());
    });

    this.type$ = this.store.pipe(select(getArticlesAuthor),
      map(author => author ? 'author' : 'favorited'));
  }

  ngOnDestroy() {
    this.store.dispatch(new ProfileClear());
    this.destroStream$.next();
    this.destroStream$.complete();
  }

  onFolowing(profile: Profile): void {
    this.store.dispatch(new ProfileToggleFollowingRequest({ profile }));
  }

  onSelectedType(type: string): void {
    this.store.dispatch(new ResetConfig());
    this.store.pipe(
      select(selectProfile),
      map(profile => profile.username),
      take(1)
    ).subscribe(username => {
      if (type === 'author') {
        this.store.dispatch(new SetAuthor({ author: username }));
      } else {
        this.store.dispatch(new SetFavorited({ favorited: username }));
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
