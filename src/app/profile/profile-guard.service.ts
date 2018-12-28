import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { Router } from '@angular/router';
import { tap, take, map, switchMap, catchError } from 'rxjs/operators';
import { ProfilesService } from '../core';
import { ProfileLoadSuccess } from './profile.actions';

@Injectable()
export class ProfileGuard implements CanActivate {
    NO_USER_NAME = 'No user name';
    constructor(
        private store: Store<AppState>,
        private router: Router,
        private profileService: ProfilesService
    ) {

    }
    canActivate(
        route: ActivatedRouteSnapshot
    ): Observable<boolean> {

        const username = route.params['username'];

        return this.store.pipe(
            take(1),
            switchMap(() => username ? this.profileService.get(username) : throwError(this.NO_USER_NAME)),
            map(profile => new ProfileLoadSuccess({ profile })),
            tap((action: ProfileLoadSuccess) => this.store.dispatch(action)),
            map(profile => !!profile),
            catchError((error) => {
                console.error(error);
                this.router.navigate(['/']);
                return of(false);
            })
        );
    }
}
