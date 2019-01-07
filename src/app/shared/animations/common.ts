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

export const expand = animation(
    [
        sequence([
            style({ opacity: 0, height: 0 }),
            animate('{{duration}} {{timing}}', style({ height: '*' })),
            animate('{{duration}} {{timing}}', style({ opacity: 1 })),
        ])
    ], {
        params: {
            duration: '300ms',
            timing: 'ease-out'
        }
    });

export const collapce = animation(
    [
        sequence([
            animate('{{duration}}', style({ opacity: 0 })),
            animate('{{duration}} {{timing}}', style({ height: 0 })),
        ])
    ], {
        params: {
            duration: '200ms',
            timing: 'ease-out'
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

export const commentAnimation = trigger('commentAnimation', [
    transition(':enter', [
        useAnimation(expand)
    ]),
    transition(':leave', [
        useAnimation(collapce)
    ]),
]);

export const swingChange = animation(
    [
        sequence([
            query(':enter', [
                style({ opacity: 0, position: 'absolute' }),
            ]),
            query(':leave', [
                style({ transform: '{{transform}}(0)' }),
                animate('{{duration}} {{timing}}',
                    style({ opacity: 0, transform: '{{transform}}(100%)' }))
            ]),
            query(':leave', [
                style({ position: 'absolute' }),
            ]),
            query(':enter', [
                style({ opacity: 0, transform: '{{transform}}({{direction}}100%)', position: 'static' }),
                animate('{{duration}} {{timing}}',
                    style({ opacity: 1, transform: '{{transform}}(0)' }))
            ]),
        ])
    ], {
        params: {
            duration: '150ms',
            timing: 'cubic-bezier(0.35, 0, 0.25, 1)',
            transform: 'translateY',
            direction: '-'
        }
    });

export const deleteButtonAnimation = trigger('deleteButtonAnimation', [
    transition('false <=> true', [
        useAnimation(swingChange)
    ]),
]);
