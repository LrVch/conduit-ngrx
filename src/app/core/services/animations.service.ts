import { Injectable } from '@angular/core';

@Injectable()
export class AnimationsService {
  private static routeAnimationEnabled: RouteAnimationEnabled = true;
  private static routeAnimationChangeType: RouteAnimationChangeType = 'SLIDE';

  static get getRouteAnimationChangeType() {
    return AnimationsService.routeAnimationChangeType;
  }

  static isRouteAnimationsEnabled() {
    return AnimationsService.routeAnimationEnabled;
  }

  static isRouteAnimationsChangeType(type: RouteAnimationChangeType) {
    return AnimationsService.routeAnimationChangeType === type;
  }

  toggleRouteAnimation(enable: boolean) {
    AnimationsService.routeAnimationEnabled = enable;
  }

  updateRouteAnimationChangeType(pageChangeType: RouteAnimationChangeType) {
    AnimationsService.routeAnimationChangeType = pageChangeType;
  }
}

export type RouteAnimationEnabled = true | false;
export type RouteAnimationChangeType = 'SLIDE' | 'FADE';
