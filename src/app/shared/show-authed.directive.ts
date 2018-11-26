import {
    Directive,
    Input,
    OnInit,
    TemplateRef,
    ViewContainerRef
} from '@angular/core';

import { AppState } from '../reducers';
import { Store, select } from '@ngrx/store';
import { selectAuthLoggedIn } from '../auth/auth.selectors';

@Directive({ selector: '[appShowAuthed]' })
export class ShowAuthedDirective implements OnInit {
    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private store: Store<AppState>
    ) { }

    condition: boolean;

    ngOnInit() {
        this.store.pipe(select(selectAuthLoggedIn)).subscribe(
            (isAuthenticated) => {
                if (isAuthenticated && this.condition || !isAuthenticated && !this.condition) {
                    this.viewContainer.createEmbeddedView(this.templateRef);
                } else {
                    this.viewContainer.clear();
                }
            }
        );
    }

    @Input() set appShowAuthed(condition: boolean) {
        this.condition = condition;
    }

}
