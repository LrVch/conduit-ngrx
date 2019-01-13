import { async, ComponentFixture } from '@angular/core/testing';
import { ConfigureFn, configureTests } from '@app/lib/testing';
import { AsideComponent } from './aside.component';
import { DebugElement, Component, Input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MaterialModule } from '@app/shared/material/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import 'hammerjs';

describe('AsideComponent', () => {
  let component: AsideComponent;
  let fixture: ComponentFixture<AsideComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    const configure: ConfigureFn = testBed => {
      testBed.configureTestingModule({
        declarations: [AsideComponent],
        imports: [
          FormsModule,
          NgxMaterialTimepickerModule.forRoot(),
          NoopAnimationsModule,
          MaterialModule,
          TranslateModule.forRoot()
        ]
      });
    };

    configureTests(configure).then(testBed => {
      fixture = testBed.createComponent(AsideComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;
      el = de.nativeElement;
      fixture.detectChanges();
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
