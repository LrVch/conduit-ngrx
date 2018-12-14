import { async, ComponentFixture } from '@angular/core/testing';

import { ConfigureFn, configureTests, getUser } from '../../lib/testing';
import { AccentOnInvalidFromFieldDirective } from '../directives';
import { CommentFormComponent } from './comment-form.component';
import { DebugElement } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ScrollService, DomUtilService } from 'src/app/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

describe('CommentFormComponent', () => {
  let component: CommentFormComponent;
  let fixture: ComponentFixture<CommentFormComponent>;
  let de: DebugElement;
  let user;

  beforeEach(
    async(() => {
      user = getUser();
      const configure: ConfigureFn = testBed => {
        testBed.configureTestingModule({
          declarations: [CommentFormComponent, AccentOnInvalidFromFieldDirective],
          imports: [FormsModule, ReactiveFormsModule, MaterialModule, NoopAnimationsModule],
          providers: [ScrollService, DomUtilService]
        });
      };

      configureTests(configure).then(testBed => {
        fixture = testBed.createComponent(CommentFormComponent);
        component = fixture.componentInstance;
        component.user = user;
        de = fixture.debugElement;
        fixture.detectChanges();
      });
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create from with 1 control', () => {
    const form = component.form;

    expect(form.contains('comment')).toBeTruthy();
  });

  it('comment control should be required', () => {
    const form = component.form;
    const comment = form.get('comment');

    expect(comment.valid).toBeFalsy();
  });

  it('should has "submitting" props', () => {
    expect(component.submitting).toBe(false);
  });

  it('should has "user" @Input', () => {
    expect(component.user).toEqual(user);
  });

  it('should show "user" @Input', () => {
    (<any>expect(fixture)).toMatchSnapshot();
  });

  it('should show error message', () => {
    component.form.get('comment').setValue('');
    component.submit();
    fixture.detectChanges();
    (<any>expect(fixture)).toMatchSnapshot();
  });

  it('should show loader', () => {
    component.isSubmitting = true;
    fixture.detectChanges();
    (<any>expect(fixture)).toMatchSnapshot();
  });

  it('should disable button', () => {
    component.isSubmitting = true;
    fixture.detectChanges();
    (<any>expect(fixture)).toMatchSnapshot();
  });

  it('should disable form', () => {
    component.isSubmitting = true;

    expect(component.form.status).toBe('DISABLED');
  });

  it('should reset from', () => {
    const comment = component.form.get('comment');

    comment.setValue('value');

    expect(comment.value).toBe('value');

    component.reset = true;

    expect(comment.value).toBe(null);
    expect(component.form.status).toBe('INVALID');
  });

  it('should raise "submitComment" when form valid on submit event and pass comment', () => {
    let comment = '';
    const expectedValue = 'value';

    component.form.get('comment').setValue(expectedValue);

    component.submitComment.subscribe(c => comment = c);

    fixture.detectChanges();
    const formDe = de.query(By.css('form'));

    formDe.triggerEventHandler('ngSubmit', null);

    expect(comment).toBe(expectedValue);

  });

  it('shouldn\'t raise "submitComment" when form invalid', () => {
    let wasEmited = false;

    component.submitComment.subscribe(c => wasEmited = true);

    fixture.detectChanges();
    const formDe = de.query(By.css('form'));

    formDe.triggerEventHandler('ngSubmit', null);

    expect(wasEmited).toBe(false);
  });

  it('should invoke validateAllFormFields method when form invalid', () => {
    const spy = jest.spyOn(component, 'validateAllFormFields');

    fixture.detectChanges();
    const formDe = de.query(By.css('form'));
    formDe.triggerEventHandler('ngSubmit', null);

    expect(spy).toHaveBeenCalled();
  });
});
