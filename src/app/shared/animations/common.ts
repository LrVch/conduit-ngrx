import {
  animate,
  query,
  style,
  transition,
  trigger,
  stagger,
  sequence,
  animation,
  group,
  useAnimation,
  state,
  animateChild
} from '@angular/animations';
import {
  AnimationsService,
  RouteAnimationChangeType
} from '@app/core/services/animations.service';

export const scaleOut = animation(
  [
    style({ opacity: 0, width: 0, 'min-width': 0, transform: 'scale(0,1)' }),
    group([
      animate('{{timeShort}}', style({ width: '*' })),
      animate('{{timeLong}}', style({ opacity: 1, transform: 'scale(1,1)' }))
    ])
  ],
  {
    params: {
      timeShort: '100ms ease-out',
      timeLong: '200ms ease-out'
    }
  }
);

export const scaleIn = animation(
  [
    style({ 'min-width': 0 }),
    group([
      animate('{{timeShort}}', style({ opacity: 0, transform: 'scale(0,1)' })),
      animate('{{timeLong}}', style({ width: 0 }))
    ])
  ],
  {
    params: {
      timeShort: '100ms ease-out',
      timeLong: '200ms ease-out'
    }
  }
);

export const expand = animation(
  [
    sequence([
      style({ opacity: 0, height: 0 }),
      animate('{{duration}} {{timing}}', style({ height: '*' })),
      animate('{{duration}} {{timing}}', style({ opacity: 1 }))
    ])
  ],
  {
    params: {
      duration: '300ms',
      timing: 'ease-out'
    }
  }
);

export const collapce = animation(
  [
    sequence([
      animate('{{duration}}', style({ opacity: 0 })),
      animate('{{duration}} {{timing}}', style({ height: 0 }))
    ])
  ],
  {
    params: {
      duration: '200ms',
      timing: 'ease-out'
    }
  }
);

export const avatarInOut = trigger('avatarInOut', [
  transition(':enter', [useAnimation(scaleOut)]),
  transition(':leave', [useAnimation(scaleIn)])
]);

export const commentAnimation = trigger('commentAnimation', [
  transition(':enter', [useAnimation(expand)]),
  transition(':leave', [useAnimation(collapce)])
]);

export const swingChange = animation(
  [
    sequence([
      query(':enter', [style({ opacity: 0, position: 'absolute' })]),
      query(':leave', [
        style({ transform: '{{transform}}(0)' }),
        animate(
          '{{duration}} {{timing}}',
          style({ opacity: 0, transform: '{{transform}}(100%)' })
        )
      ]),
      query(':leave', [style({ position: 'absolute' })]),
      query(':enter', [
        style({
          opacity: 0,
          transform: '{{transform}}({{direction}}100%)',
          position: 'static'
        }),
        animate(
          '{{duration}} {{timing}}',
          style({ opacity: 1, transform: '{{transform}}(0)' })
        )
      ])
    ])
  ],
  {
    params: {
      duration: '150ms',
      timing: 'cubic-bezier(0.35, 0, 0.25, 1)',
      transform: 'translateY',
      direction: '-'
    }
  }
);

export const deleteButtonAnimation = trigger('deleteButtonAnimation', [
  transition('false <=> true', [useAnimation(swingChange)])
]);

export const slidePageAnimation = animation(
  [
    style({ position: 'relative', overflow: 'hidden' }),
    query(':enter > *', [style({ opacity: 0, position: 'absolute' })], {
      optional: true
    }),
    query(':leave', animateChild(), {
      optional: true
    }),
    sequence([
      query(
        ':leave > *',
        [
          style({
            transform: 'translateX(0)',
            opacity: 1,
            position: 'relative'
          }),
          animate(
            '{{duration}} {{timing}}',
            style({ transform: 'translateX({{distanse}})', opacity: 0 })
          )
        ],
        {
          optional: true
        }
      ),
      query(':leave > *', style({ position: 'absolute' }), {
        optional: true
      }),
      query(
        ':enter > *',
        [
          style({
            position: 'relative',
            transform: 'translateX(-{{distanse}})'
          }),
          animate(
            '{{duration}} {{delay}} {{timing}}',
            style({ transform: 'translateX(0)', opacity: 1 })
          )
        ],
        {
          optional: true
        }
      )
    ]),
    query(':enter', animateChild(), {
      optional: true
    })
  ],
  {
    params: {
      distanse: '30px',
      duration: '300ms',
      delay: '300ms',
      timing: 'ease-out'
    }
  }
);

export const fadePageAnimation = animation(
  [
    style({ position: 'relative', overflow: 'hidden' }),
    query(':enter > *', [style({ opacity: 0, position: 'absolute' })], {
      optional: true
    }),
    query(':leave', animateChild(), {
      optional: true
    }),
    sequence([
      query(
        ':leave > *',
        [
          style({ opacity: 1, position: 'relative' }),
          animate('{{duration}} {{timing}}', style({ opacity: 0 }))
        ],
        {
          optional: true
        }
      ),
      query(':leave > *', style({ position: 'absolute' }), {
        optional: true
      }),
      query(
        ':enter > *',
        [
          style({ position: 'relative' }),
          animate('{{duration}} {{timing}}', style({ opacity: 1 }))
        ],
        {
          optional: true
        }
      )
    ]),
    query(':enter', animateChild(), {
      optional: true
    })
  ],
  {
    params: {
      distanse: '30px',
      duration: '300ms',
      timing: 'ease-out'
    }
  }
);

export function staticPages(fromState: string, toState: string) {
  return (
    toState === 'SettingsComponent' ||
    toState === 'EditorComponent' ||
    toState === 'login' ||
    toState === 'register'
  );
}

export function slideAnimation(fromState, toState) {
  if (!AnimationsService.isRouteAnimationsEnabled()) {
    return false;
  }

  if (!AnimationsService.isRouteAnimationsChangeType('SLIDE')) {
    return false;
  }

  return staticPages(fromState, toState);
}

export function fadeAnimation(fromState, toState) {
  if (!AnimationsService.isRouteAnimationsEnabled()) {
    return false;
  }

  if (!AnimationsService.isRouteAnimationsChangeType('FADE')) {
    return false;
  }

  return staticPages(fromState, toState);
}

export function typeAnimation(type: RouteAnimationChangeType, pages) {
  return state;
}

export const routeAnimation = trigger('routeAnimation', [
  transition(slideAnimation, [useAnimation(slidePageAnimation)]),
  transition(fadeAnimation, [useAnimation(fadePageAnimation)])
]);
