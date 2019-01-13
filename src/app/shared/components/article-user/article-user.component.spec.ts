import { async, ComponentFixture } from '@angular/core/testing';
import { ConfigureFn, configureTests } from '@app/lib/testing';
import { ArticleUserComponent } from './article-user.component';
import {
  DebugElement,
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { By } from '@angular/platform-browser';
import { MaterialModule } from '@app/shared/material/material.module';
import { RouterLinkDirectiveStubDirective } from '@app/lib/testing/directive/router-link-directive-stub';
import { Article, Profile } from '@app/core';
import { getArticle, getProfile } from '@app/lib/testing/mock-data.helpers';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-follow-button',
  template: `
    <a (click)="onFollowedToggle()"><ng-content></ng-content></a>
  `
})
class FollowComponent {
  @Input('isLoading') isLoading: boolean;
  @Input('followed') favorited: boolean;
  @Output() followedToggle = new EventEmitter<Article>();

  onFollowedToggle(): void {
    this.followedToggle.emit();
  }
  constructor() {}
}

@Component({
  selector: 'app-favorite',
  template: `
    <a (click)="onFavoritedToggle()"><ng-content></ng-content></a>
  `
})
class FavoriteComponent {
  @Input('isLoading') isLoading: boolean;
  @Input('favorited') favorited: boolean;
  @Output() favoritedToggle = new EventEmitter<Article>();

  onFavoritedToggle(): void {
    this.favoritedToggle.emit();
  }
  constructor() {}
}

describe('ArticleUserComponent', () => {
  let component: ArticleUserComponent;
  let fixture: ComponentFixture<ArticleUserComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  const initialArticle: Article = {
    author: {},
    tagList: []
  } as Article;
  let linkDes;
  let routerLinks;
  let event;

  const article: Article = getArticle();

  beforeEach(async(() => {
    event = {
      preventDefault() {}
    };
    const configure: ConfigureFn = testBed => {
      testBed.configureTestingModule({
        declarations: [
          ArticleUserComponent,
          RouterLinkDirectiveStubDirective,
          FavoriteComponent,
          FollowComponent
        ],
        imports: [MaterialModule, TranslateModule.forRoot()]
      });
    };

    configureTests(configure).then(testBed => {
      fixture = testBed.createComponent(ArticleUserComponent);
      component = fixture.componentInstance;
      component.article = initialArticle;
      de = fixture.debugElement;
      el = de.nativeElement;
      fixture.detectChanges();
      linkDes = de.queryAll(By.directive(RouterLinkDirectiveStubDirective));
      routerLinks = linkDes.map(deel =>
        deel.injector.get(RouterLinkDirectiveStubDirective)
      );
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should has "article" @Input', () => {
    expect(component.article).toEqual(initialArticle);
  });

  it('should has "canModify" @Input', () => {
    expect(component.canModify).toEqual(false);
  });

  it('should has "isDeletingArticle" @Input', () => {
    expect(component.canModify).toEqual(false);
  });

  it('should show "article" @Input', () => {
    component.article = getArticle();
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();

    component.article = getArticle();
    component.article.favoritesCount = 10;
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should show "canModify" @Input', () => {
    component.article = getArticle();
    component.canModify = true;
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should show "isDeletingArticle" @Input', () => {
    component.article = getArticle();
    component.isDeletingArticle = true;
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should raise favorited event when clicked (favoritedToggle) and pass an selected article', () => {
    let selectedArticle;
    component.article = article;
    component.favorited.subscribe(a => (selectedArticle = a));

    fixture.detectChanges();

    const favoriteDe = de.query(By.css('app-favorite')).query(By.css('a'));

    favoriteDe.triggerEventHandler('click', event);
    expect(selectedArticle).toEqual(article);
  });

  it('should raise folowing event when clicked (followedToggle) and pass an selected profile', () => {
    let selectedProfile;
    component.article = article;

    component.folowing.subscribe(a => (selectedProfile = a));

    fixture.detectChanges();

    const followDe = de.query(By.css('app-follow-button')).query(By.css('a'));

    followDe.triggerEventHandler('click', event);
    expect(selectedProfile).toEqual(article.author);
  });

  it('should delete folowing event when clicked (onDeleteArticle) and pass an selected profile', () => {
    let deletedArticle;
    component.article = article;
    component.canModify = true;

    component.delete.subscribe(a => (deletedArticle = a));

    fixture.detectChanges();

    const deleteDe = de.query(By.css('[color="warn"]'));

    deleteDe.triggerEventHandler('click', event);

    expect(deletedArticle).toEqual(article);
  });

  it('can get RouterLinks from template', () => {
    component.article = article;
    fixture.detectChanges();

    expect(routerLinks.length).toBe(3, 'should have 3 routerLinks');
    expect(routerLinks[0].linkParams).toEqual([
      '/profile',
      article.author.username
    ]);
    expect(routerLinks[1].linkParams).toEqual([
      '/profile',
      article.author.username
    ]);
    expect(routerLinks[2].linkParams).toEqual(['/editor', article.slug]);
  });

  it('can click Articles link in template', () => {
    component.article = article;
    const goToProfileDe = linkDes[0];
    const goToProfileLink = routerLinks[0];

    expect(goToProfileLink.navigatedTo).toBeNull();

    fixture.detectChanges();
    goToProfileDe.triggerEventHandler('click', null);

    expect(goToProfileLink.navigatedTo).toEqual([
      '/profile',
      article.author.username
    ]);
  });
});
