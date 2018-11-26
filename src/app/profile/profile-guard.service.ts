import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '../reducers';
import { Router } from '@angular/router';
import { tap, take, map, filter, switchMap, catchError } from 'rxjs/operators';
import { selectProfile } from './profile.selectors';
import { ProfilesService } from '../core';
import { ProfileLoadSuccess } from './profile.actions';

@Injectable()
export class ProfileGuard implements CanActivate {
    constructor(
        private store: Store<AppState>,
        private router: Router,
        private profileService: ProfilesService
    ) {

    }
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> {

        const username = route.params['username'];

        return this.store.pipe(
            select(selectProfile),
            take(1),
            switchMap(() => username ? this.profileService.get(username) : throwError('No user name')),
            map(profile => new ProfileLoadSuccess({ profile })),
            tap((action: ProfileLoadSuccess) => this.store.dispatch(action)),
            map(profile => !!profile),
            catchError(() => {
                this.router.navigate(['/']);
                return of(false);
            })
        );
    }
}
