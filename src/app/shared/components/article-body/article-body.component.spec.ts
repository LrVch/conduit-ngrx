import { async, ComponentFixture } from '@angular/core/testing';
import { ConfigureFn, configureTests } from '@app/lib/testing';
import { ArticleBodyComponent } from './article-body.component';
import { MarkdownPipe } from '@app/shared/pipes';

describe('ArticleBodyComponent', () => {
  let component: ArticleBodyComponent;
  let fixture: ComponentFixture<ArticleBodyComponent>;

  beforeEach(async(() => {
    const configure: ConfigureFn = testBed => {
      testBed.configureTestingModule({
        declarations: [ArticleBodyComponent, MarkdownPipe]
      });
    };

    configureTests(configure).then(testBed => {
      fixture = testBed.createComponent(ArticleBodyComponent);
      component = fixture.componentInstance;
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should has "body" @Input', () => {
    expect(component.body).toBe('');
  });

  it('should compile', () => {
    component.body = 'body';
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });
});
