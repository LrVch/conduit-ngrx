import { async, ComponentFixture } from '@angular/core/testing';
import { ConfigureFn, configureTests } from '../../../lib/testing';
import { ArticleFullComponent } from './article-full.component';
import { DebugElement, Component, Input, Output, EventEmitter } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MaterialModule } from '../../material/material.module';
import { Article, Profile } from 'src/app/core';
import { getArticle } from 'src/app/lib/testing/mock-data.helpers';

@Component({
    selector: 'app-article-user',
    template: `
    <a id="follow" (click)="onFollowedToggle()"></a>
    <a id="favorite" (click)="onFavoriteToggle()"></a>
    <a id="delete" (click)="onDeleteToggle()"></a>
    `
})
class TestHostUserComponent {
    @Input('canModify') canModify: boolean;
    @Input('article') article: Article;
    @Input('isDeletingArticle') isDeletingArticle: boolean;
    @Output() folowing = new EventEmitter<Profile>();
    @Output() favorited = new EventEmitter<Article>();
    @Output() delete = new EventEmitter<any>();

    onFollowedToggle(): void {
        this.folowing.emit(this.article.author);
    }
    onFavoriteToggle(): void {
        this.favorited.emit(this.article);
    }
    onDeleteToggle(): void {
        this.delete.emit();
    }
    constructor() { }
}

@Component({
    selector: 'app-article-body',
    template: ``
})
class TestHostBodyComponent {
    @Input('body') body: string;
}

@Component({
    selector: 'app-list-error',
    template: ``
})
class TestHostErrorsComponent {
    @Input('errors') errors: any;
}

@Component({
    selector: 'app-tag-list',
    template: ``
})
class TestHostTagsComponent {
    @Input('tagList') tagList: any;
}

describe('ArticleFullComponent', () => {
    let component: ArticleFullComponent;
    let fixture: ComponentFixture<ArticleFullComponent>;
    let de: DebugElement;
    let el: HTMLElement;
    const initialArticle: Article = {
        author: {},
        tagList: []
    } as Article;

    const article: Article = getArticle();

    beforeEach(
        async(() => {
            const configure: ConfigureFn = testBed => {
                testBed.configureTestingModule({
                    declarations: [
                        ArticleFullComponent,
                        TestHostBodyComponent,
                        TestHostUserComponent,
                        TestHostErrorsComponent,
                        TestHostTagsComponent
                    ],
                    imports: [MaterialModule]
                });
            };

            configureTests(configure).then(testBed => {
                fixture = testBed.createComponent(ArticleFullComponent);
                component = fixture.componentInstance;
                component.article = initialArticle;
                de = fixture.debugElement;
                el = de.nativeElement;
                fixture.detectChanges();
            });
        })
    );

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

    it('should has "articleErrors" @Input', () => {
        expect(component.articleErrors).toEqual({});
    });

    it('should show "article" @Input', () => {
        component.article = getArticle();
        fixture.detectChanges();
        expect(fixture).toMatchSnapshot();
    });

    it('should raise favorited event and pass an selected article', () => {
        let selectedArticle;
        component.article = article;
        component.favorited.subscribe(a => selectedArticle = a);

        fixture.detectChanges();

        const favoriteDe = de.query(By.css('app-article-user')).query(By.css('#favorite'));

        favoriteDe.triggerEventHandler('click', null);
        expect(selectedArticle).toEqual(article);
    });

    it('should raise folowing event and pass an selected profile', () => {
        let selectedProfile;
        component.article = article;

        component.folowing.subscribe(a => selectedProfile = a);

        fixture.detectChanges();

        const followDe = de.query(By.css('app-article-user')).query(By.css('#follow'));

        followDe.triggerEventHandler('click', null);
        expect(selectedProfile).toEqual(article.author);
    });

    it('should raise delete event', () => {
        let deletedArticle;
        component.article = article;
        component.canModify = true;

        component.delete.subscribe(a => deletedArticle = a);

        fixture.detectChanges();

        const deleteDe = de.query(By.css('app-article-user')).query(By.css('#delete'));

        deleteDe.triggerEventHandler('click', null);

        expect(deletedArticle).toEqual(article);
    });
});

