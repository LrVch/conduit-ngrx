import { async, ComponentFixture } from '@angular/core/testing';

import { ConfigureFn, configureTests } from '@app/lib/testing';

import { DeleteBtnComponent } from './delete-btn.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MaterialModule } from '@app/shared/material/material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('DeleteBtnComponent', () => {
  let component: DeleteBtnComponent;
  let fixture: ComponentFixture<DeleteBtnComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  const event = {
    prevented: false,
    preventDefault() {
      this.prevented = true;
    }
  };

  beforeEach(async(() => {
    const configure: ConfigureFn = testBed => {
      testBed.configureTestingModule({
        declarations: [DeleteBtnComponent],
        imports: [MaterialModule, NoopAnimationsModule]
      });
    };

    configureTests(configure).then(testBed => {
      fixture = testBed.createComponent(DeleteBtnComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;
      el = de.nativeElement;
      fixture.detectChanges();
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should has "type" @Input equals to "y"', () => {
    expect(component.type).toBe('y');
  });

  it('should has "direction" @Input equals to "forward"', () => {
    expect(component.direction).toBe('forward');
  });

  it('should has "showConfirm" @Input"', () => {
    expect(component.showConfirm).toBe(true);
  });

  it('should has "isDeleting" @Input"', () => {
    expect(component.isDeleting).toBe(false);
  });

  it('should has "isOpenConfirm" @Input"', () => {
    expect(component.isOpenConfirm).toBe(false);
  });

  it('should compile showConfirm == true', () => {
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should compile showConfirm == false', () => {
    component.showConfirm = false;
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should show variants for showConfirm == true', () => {
    component.isOpenConfirm = true;
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should show delete_forever for showConfirm == true', () => {
    component.isOpenConfirm = false;
    component.isDeleting = true;
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should show delete_forever for showConfirm == false', () => {
    component.showConfirm = false;
    component.isDeleting = true;
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should raises delete event when clicked (onDelete) for showConfirm == true', () => {
    let raised = null;
    component.isOpenConfirm = true;
    component.delete.subscribe(_ => (raised = true));

    fixture.detectChanges();

    const button = de.query(By.css('[class*="color-success"]'));
    button.triggerEventHandler('click', event);

    expect(raised).toBe(true);
  });

  it('should raises delete event when clicked (onDelete) for showConfirm == false', () => {
    let raised = null;
    component.showConfirm = false;
    component.delete.subscribe(_ => (raised = true));

    fixture.detectChanges();

    const button = de.query(By.css('[color="primary"]'));
    button.triggerEventHandler('click', event);

    expect(raised).toBe(true);
  });
});
