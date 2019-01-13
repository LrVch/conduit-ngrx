import { async, ComponentFixture } from '@angular/core/testing';
import { ConfigureFn, configureTests } from '../../../lib/testing';
import { ArticleComponent } from './article.component';
import {
  DebugElement,
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { By } from '@angular/platform-browser';
import { MaterialModule } from '../../material/material.module';
import { RouterLinkDirectiveStubDirective } from '@app/lib/testing/directive/router-link-directive-stub';
import { FavoriteComponent } from '../favorite/favorite.component';
import { TagListComponent } from '../tag-list/tag-list.component';
import { Article } from '@app/core';
import { getArticle } from '@app/lib/testing/mock-data.helpers';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-delete-btn',
  template: '<div id="delete" (click)="onDelete()"></div>'
})
class HostDeleteBtnComponent {
  @Input('isDeleting') isDeleting: boolean;
  @Input('showConfirm') showConfirm: boolean;
  @Output() delete = new EventEmitter();

  onDelete() {
    this.delete.emit();
  }
}

describe('ArticleComponent', () => {
  let component: ArticleComponent;
  let fixture: ComponentFixture<ArticleComponent>;
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
          ArticleComponent,
          RouterLinkDirectiveStubDirective,
          FavoriteComponent,
          TagListComponent,
          HostDeleteBtnComponent
        ],
        imports: [MaterialModule, TranslateModule.forRoot()]
      });
    };

    configureTests(configure).then(testBed => {
      fixture = testBed.createComponent(ArticleComponent);
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

  it('should show "article" @Input', () => {
    component.article = getArticle();
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();

    component.article = getArticle();
    component.article.favoritesCount = 10;
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();

    component.article = getArticle();
    component.article.tagList = ['1', '2', '3', '4'];
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

  it('should raise delete event when clicked (delete)', () => {
    let wasClicked = false;
    component.article = article;
    component.canModify = true;
    component.delete.subscribe(a => (wasClicked = true));

    fixture.detectChanges();

    const btn = de.query(By.css('#delete'));

    btn.triggerEventHandler('click', null);
    expect(wasClicked).toBeTruthy();
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
    expect(routerLinks[2].linkParams).toEqual(['/article', article.slug]);
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
