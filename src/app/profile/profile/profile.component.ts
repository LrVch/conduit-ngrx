import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, of, Subject, combineLatest } from 'rxjs';
import {
  withLatestFrom,
  map,
  switchMap,
  take,
  filter,
  takeUntil,
  startWith,
  mergeAll,
  tap
} from 'rxjs/operators';
import { Profile, User, Article } from '@app/core';
import { AppState } from '@app/reducers';
import { Store, select } from '@ngrx/store';
import { selectUser } from '@app/auth/auth.selectors';
import {
  ProfileClear,
  ProfileToggleFollowingRequest
} from '@app/profile/profile.actions';
import {
  selectProfile,
  selectProfileUsername
} from '@app/profile/profile.selectors';
import {
  ResetConfig,
  SetAuthor,
  LoadArticlesRequest,
  ToggleArticleFavoriteRequest,
  SetLimit,
  SetOffset,
  SetFavorited,
  SetPageIndex,
  ArticlesDeleteArticleConfirmationRequest
} from '@app/articles/articles.actions';
import {
  selectArticlesItems,
  getArticlesLimit,
  selectArticlesCount,
  selectArticlesLoading,
  getArticlesAuthor,
  getArticlesPageIndex,
  selectArticlesReturnConfig
} from '@app/articles/articles.selectors';
import { ArticlesConfigState } from '@app/articles/articlesConfig.reducer';
import { Tab } from '@app/shared';
import { TranslateService } from '@ngx-translate/core';
import { selectAppSettingsStateLanguage } from '@app/appSettings/app-settings.selectors';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit, OnDestroy {
  isUser$: Observable<boolean>;
  profile$: Observable<Profile>;
  tags$: Observable<Array<string>>;
  limit$: Observable<number>;
  pageIndex$: Observable<number>;
  atricles$: Observable<Article[]>;
  type$: Observable<string>;
  tabs$: Observable<Tab[]>;
  locale$: Observable<string>;
  pageSizeOptions = [5, 10, 25, 100];
  articlesCount$: Observable<number>;
  loadingArticles$: Observable<boolean>;
  errorLoadingArticles$: Observable<boolean>;
  destroStream$ = new Subject<any>();
  canModify$: Observable<boolean>;

  constructor(
    private store: Store<AppState>,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.profile$ = this.store.pipe(select(selectProfile));
    this.isUser$ = this.profile$.pipe(
      withLatestFrom(this.store.pipe(select(selectUser))),
      filter(([profile, user]: [Profile, User]) => !!profile),
      switchMap(([profile, user]: [Profile, User]) => {
        return user ? of(profile.username === user.username) : of(false);
      })
    );

    this.tabs$ = this.translateService.onLangChange.pipe(
      startWith(
        this.translateService.get([
          'conduit.profile.tabAuthor',
          'conduit.profile.tabFavorited'
        ])
      ),
      switchMap(res =>
        this.translateService.get([
          'conduit.profile.tabAuthor',
          'conduit.profile.tabFavorited'
        ])
      ),
      map(result => {
        return [
          { title: result['conduit.profile.tabAuthor'], value: 'author' },
          { title: result['conduit.profile.tabFavorited'], value: 'favorited' }
        ];
      })
    );

    this.locale$ = this.store.pipe(select(selectAppSettingsStateLanguage));

    this.atricles$ = this.store.pipe(select(selectArticlesItems));
    this.limit$ = this.store.pipe(select(getArticlesLimit));
    this.pageIndex$ = this.store.pipe(select(getArticlesPageIndex));
    this.articlesCount$ = this.store.pipe(select(selectArticlesCount));
    this.loadingArticles$ = this.store.pipe(select(selectArticlesLoading));

    combineLatest(
      this.store.pipe(select(selectArticlesReturnConfig)),
      this.store.pipe(select(selectProfileUsername))
    )
      .pipe(
        filter(
          ([config, username]: [ArticlesConfigState, string]) => !!username
        ),
        takeUntil(this.destroStream$)
      )
      .subscribe(([config, username]: [ArticlesConfigState, string]) => {
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

    this.type$ = this.store.pipe(
      select(getArticlesAuthor),
      map(author => (author ? 'author' : 'favorited'))
    );

    this.canModify$ = combineLatest(this.isUser$, this.type$).pipe(
      map(([isUser, type]) => isUser && type === 'author')
    );
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
    this.store
      .pipe(
        select(selectProfile),
        map(profile => profile.username),
        take(1)
      )
      .subscribe(username => {
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

  onDeleteArticle(article: Article): void {
    this.store.dispatch(
      new ArticlesDeleteArticleConfirmationRequest({
        article,
        question: 'conduit.article.deleteQuestion'
      })
    );
  }
}
