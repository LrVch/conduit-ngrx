import { async, ComponentFixture } from '@angular/core/testing';

import { ConfigureFn, configureTests, getComment } from '../../lib/testing';

import { CommentComponent } from './comment.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MaterialModule } from '../material/material.module';
import { RouterLinkDirectiveStubDirective } from 'src/app/lib/testing/directive/router-link-directive-stub';

describe('CommentComponent', () => {
    let component: CommentComponent;
    let fixture: ComponentFixture<CommentComponent>;
    let de: DebugElement;
    let el: HTMLElement;
    let linkDes;
    let routerLinks;
    let comment;

    beforeEach(
        async(() => {
            comment = getComment();
            const configure: ConfigureFn = testBed => {
                testBed.configureTestingModule({
                    declarations: [CommentComponent, RouterLinkDirectiveStubDirective],
                    imports: [MaterialModule]
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
                routerLinks = linkDes.map(deel => deel.injector.get(RouterLinkDirectiveStubDirective));
            });
        })
    );

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // it('should has "tags" @Input', () => {
    //     expect(component.tags).toEqual([]);
    // });
});

