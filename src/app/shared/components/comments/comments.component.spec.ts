import { async, ComponentFixture } from '@angular/core/testing';
import { ConfigureFn, configureTests } from '@app/lib/testing';
import { CommentsComponent } from './comments.component';
import {
  DebugElement,
  Input,
  EventEmitter,
  Output,
  Component
} from '@angular/core';
import { By } from '@angular/platform-browser';
import { MaterialModule } from '@app/shared/material/material.module';
import { User } from '@app/core';
import { getUser, getComments } from '@app/lib/testing/mock-data.helpers';
import { ShowAuthedDirective } from '@app/shared/directives';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import * as Actions from '@app/auth/auth.actions';
import * as fromRoot from '@app/reducers';
import * as fromAuth from '@app/auth/auth.reducer';

@Component({
  selector: 'app-comment-form',
  template: `
    <div *appShowAuthed="true" (click)="submit()">a</div>
  `
})
class CommentFormComponent {
  @Input('user') user: User = {} as User;
  @Input('isSubmitting') isSubmitting = false;
  @Input('reset') reset = false;
  @Output() submitComment = new EventEmitter<string>();

  submit(): void {
    this.submitComment.emit('comment');
  }
}

@Component({
  selector: 'app-comment',
  template: `
    <div (click)="deleteComment()"></div>
  `
})
class CommentComponent {
  @Input('comment') comment: Comment = {} as Comment;
  @Input('canModify') canModify = false;
  @Input('locale') locale: string;
  @Output() delete = new EventEmitter<boolean>();

  deleteComment(): void {
    this.delete.emit(true);
  }
}

describe('CommentsComponent', () => {
  let component: CommentsComponent;
  let fixture: ComponentFixture<CommentsComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let user;
  let comments;
  let store: Store<fromAuth.AuthState>;

  beforeEach(async(() => {
    user = getUser();
    comments = getComments(3);
    const configure: ConfigureFn = testBed => {
      testBed.configureTestingModule({
        declarations: [
          CommentsComponent,
          CommentFormComponent,
          CommentComponent,
          ShowAuthedDirective
        ],
        imports: [
          MaterialModule,
          StoreModule.forRoot({
            ...fromRoot.reducers,
            feature: combineReducers(fromAuth.authReducer)
          })
        ]
      });
    };

    configureTests(configure).then(testBed => {
      fixture = testBed.createComponent(CommentsComponent);
      component = fixture.componentInstance;
      component.comments = comments;
      component.user = user;
      de = fixture.debugElement;
      el = de.nativeElement;
      store = testBed.get(Store);
      fixture.detectChanges();
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should has "comments" @Input', () => {
    expect(component.comments).toEqual(comments);
  });

  it('should has "user" @Input', () => {
    expect(component.user).toEqual(user);
  });

  it('should has "loading" @Input', () => {
    expect(component.loading).toBe(false);
  });

  it('should has "isSubmitting" @Input', () => {
    expect(component.isSubmitting).toBe(false);
  });

  it('should has "reset" @Input', () => {
    expect(component.reset).toBe(false);
  });

  it('should compile', () => {
    (<any>expect(fixture)).toMatchSnapshot();
  });

  it('should show "loading" @Input', () => {
    component.loading = true;

    fixture.detectChanges();
    (<any>expect(fixture)).toMatchSnapshot();
  });

  it("should hide form for isn't logged in user", () => {
    component.loading = true;

    fixture.detectChanges();
    (<any>expect(fixture)).toMatchSnapshot();
  });

  it('should raise submitComment event when form (submitComment) and pass a coment body', () => {
    let comment = '';
    component.submitComment.subscribe(c => (comment = c));

    store.dispatch(new Actions.LoggedLocalStorageRequest());

    fixture.detectChanges();

    const submitDe = de.query(By.css('app-comment-form')).query(By.css('div'));

    submitDe.triggerEventHandler('click', null);
    expect(comment).toBe('comment');
  });

  it('should raise deleteComment event when click (delete) on comment and pass a comment', () => {
    let comment = null;
    component.delete.subscribe(c => (comment = c));

    fixture.detectChanges();

    const deleteDe = de.query(By.css('app-comment')).query(By.css('div'));
    deleteDe.triggerEventHandler('click', null);

    expect(comment).toEqual(comments[0]);
  });
});
