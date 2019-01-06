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
    state
} from '@angular/animations';

export const scaleOut = animation(
    [
        style({ opacity: 0, width: 0, 'min-width': 0, transform: 'scale(0,1)' }),
        group([
            animate('{{timeShort}}', style({ width: '*' })),
            animate('{{timeLong}}', style({ opacity: 1, transform: 'scale(1,1)' })),
        ])
    ], {
        params: {
            timeShort: '100ms ease-out',
            timeLong: '200ms ease-out'
        }
    });

export const scaleIn = animation(
    [
        style({ 'min-width': 0 }),
        group([
            animate('{{timeShort}}', style({ opacity: 0, transform: 'scale(0,1)' })),
            animate('{{timeLong}}', style({ width: 0, })),
        ])
    ], {
        params: {
            timeShort: '100ms ease-out',
            timeLong: '200ms ease-out'
        }
    });

export const avatarInOut = trigger('avatarInOut', [
    transition(':enter', [
        useAnimation(scaleOut)
    ]),
    transition(':leave', [
        useAnimation(scaleIn)
    ])
]);

export const articleListItemAnimation = trigger('articleListItemAnimation', [
    transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 })),
    ]),
    transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 })),
    ]),
]);

export const articleListAnimation = trigger('articleListAnimation', [
    transition('false => true', [
        query('app-article', [
            style({ opacity: 0 }),
            // stagger(10, [
            animate('300ms cubic-bezier(0.35, 0, 0.25, 1)',
                style({ opacity: 1 }))
            // ])
        ])

    ]),
    transition('true => false', [
        query('app-article', [
            style({ opacity: 1 }),
            // stagger(30, [
            animate('500ms cubic-bezier(0.35, 0, 0.25, 1)',
                style({ opacity: 0, }))
            // ])
        ])

    ])
]);

export const commentAnimation = trigger('commentAnimation', [
    transition(':enter', [
        sequence([
            style({ opacity: 0, height: 0 }),
            animate('300ms ease-out', style({ height: '*' })),
            animate('200ms ease-out', style({ opacity: 1 })),
        ])
    ]),
    transition(':leave', [
        sequence([
            animate(200, style({ opacity: 0 })),
            animate('100ms ease-in', style({ height: 0 })),
        ])
    ]),
]);
