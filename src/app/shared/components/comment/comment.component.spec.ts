import { async, ComponentFixture } from '@angular/core/testing';

import { ConfigureFn, configureTests, getComment } from '@app/lib/testing';

import { CommentComponent } from './comment.component';
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
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

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

describe('CommentComponent', () => {
  let component: CommentComponent;
  let fixture: ComponentFixture<CommentComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let linkDes;
  let routerLinks;
  let comment;

  beforeEach(async(() => {
    comment = getComment();
    const configure: ConfigureFn = testBed => {
      testBed.configureTestingModule({
        declarations: [
          CommentComponent,
          RouterLinkDirectiveStubDirective,
          HostDeleteBtnComponent
        ],
        imports: [MaterialModule, NoopAnimationsModule]
      });
    };

    configureTests(configure).then(testBed => {
      fixture = testBed.createComponent(CommentComponent);
      component = fixture.componentInstance;
      component.comment = comment;
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

  it('should has "comment" @Input', () => {
    expect(component.comment).toEqual(comment);
  });

  it('should has "canModify" @Input', () => {
    expect(component.canModify).toEqual(false);
  });

  it('should show "comment" @Input', () => {
    (<any>expect(fixture)).toMatchSnapshot();
  });

  it('should show "isDeleting" loader via comment.isDeleting', () => {
    comment.isDeleting = true;

    fixture.detectChanges();
    (<any>expect(fixture)).toMatchSnapshot();
  });

  it('should show "canModify" @Input', () => {
    component.canModify = true;

    fixture.detectChanges();
    (<any>expect(fixture)).toMatchSnapshot();
  });

  it('should raises delete event when clicked (deleteComment)', () => {
    let raised = null;
    component.delete.subscribe(_ => (raised = true));

    fixture.detectChanges();

    const button = de.query(By.css('#delete'));
    button.triggerEventHandler('click', null);

    expect(raised).toBe(true);
  });

  it('shouldn\'t raises delete event when clicked (deleteComment) and "comment.isDeleting" equals to true', () => {
    let wasEmited = false;

    comment.isDeleting = true;
    component.delete.subscribe(_ => (wasEmited = true));

    fixture.detectChanges();
    const button = de.query(By.css('.comment__delete'));

    button.triggerEventHandler('click', null);

    expect(wasEmited).toBe(false);
  });

  it('can get RouterLinks from template', () => {
    expect(routerLinks.length).toBe(2);
    expect(routerLinks[0].linkParams).toEqual([
      '/profile',
      comment.author.username
    ]);
    expect(routerLinks[1].linkParams).toEqual([
      '/profile',
      comment.author.username
    ]);
  });

  it('can click Comment link in template', () => {
    const goToProfileDe = linkDes[0];
    const goToProfileLink = routerLinks[0];

    expect(goToProfileLink.navigatedTo).toBeNull();

    fixture.detectChanges();
    goToProfileDe.triggerEventHandler('click', null);

    expect(goToProfileLink.navigatedTo).toEqual([
      '/profile',
      comment.author.username
    ]);
  });
});
