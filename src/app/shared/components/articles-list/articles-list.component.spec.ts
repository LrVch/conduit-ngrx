import { async, ComponentFixture } from '@angular/core/testing';

import { ConfigureFn, configureTests } from '@app/lib/testing';

import { ArticlesListComponent } from './articles-list.component';
import { DebugElement, Component, Input, Output, EventEmitter } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MaterialModule } from '@app/shared/material/material.module';
import { Article } from '@app/core';
import { getArticles } from '@app/lib/testing/mock-data.helpers';

@Component({
    selector: 'app-article',
    template: `
    {{ article.title }}
    <a (click)="onFavoriveToggle()"></a>
    `
})
class ArticleComponent {
    @Input('article') article: Article = {} as Article;
    @Output() favorited = new EventEmitter<Article>();

    onFavoriveToggle(): void {
        this.favorited.emit(this.article);
    }
    constructor() { }
}

describe('ArticlesListComponent', () => {
    let component: ArticlesListComponent;
    let fixture: ComponentFixture<ArticlesListComponent>;
    let de: DebugElement;
    let el: HTMLElement;
    const event = {
        stopPropagation() { }
    };
    let articles: Article[];

    beforeEach(
        async(() => {
            articles = getArticles(3);
            const configure: ConfigureFn = testBed => {
                testBed.configureTestingModule({
                    declarations: [ArticlesListComponent, ArticleComponent],
                    imports: [MaterialModule]
                });
            };

            configureTests(configure).then(testBed => {
                fixture = testBed.createComponent(ArticlesListComponent);
                component = fixture.componentInstance;
                component.articlesList = articles;
                de = fixture.debugElement;
                el = de.nativeElement;
                fixture.detectChanges();
            });
        })
    );

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should has "isLoading" @Input', () => {
        expect(component.isLoading).toBe(false);
    });

    it('should has "isErrorLoading" @Input', () => {
        expect(component.isErrorLoading).toBe(false);
    });

    it('should has "articlesList" @Input', () => {
        expect(component.articlesList).toEqual(articles);
    });

    it('should show "articlesList" @Input', () => {
        component.articlesList = getArticles(3);
        fixture.detectChanges();
        expect(fixture).toMatchSnapshot();

        component.articlesList = getArticles(2);
        fixture.detectChanges();
        expect(fixture).toMatchSnapshot();

        component.articlesList = getArticles(1);
        fixture.detectChanges();
        expect(fixture).toMatchSnapshot();

        component.articlesList = [];
        fixture.detectChanges();
        expect(fixture).toMatchSnapshot();
    });

    it('should show message "No articles are here... yet"', () => {
        component.articlesList = [];
        fixture.detectChanges();
        expect(fixture).toMatchSnapshot();

        component.isLoading = false;
        fixture.detectChanges();
        expect(fixture).toMatchSnapshot();

    });

    it('should show loader', () => {
        component.isLoading = true;
        fixture.detectChanges();
        expect(fixture).toMatchSnapshot();
    });

    it('should raise favorited event when clicked (selecteTag) and select first article', () => {
        let selectedArticle: Article;
        const arts = getArticles(3);
        arts[0].title = 'selected title';
        component.articlesList = arts;
        component.favorited.subscribe((a: Article) => selectedArticle = a);

        fixture.detectChanges();

        const firstTag = de.query(By.css('app-article')).query(By.css('a'));

        firstTag.triggerEventHandler('click', event);
        expect(selectedArticle).toBe(arts[0]);
    });
});

