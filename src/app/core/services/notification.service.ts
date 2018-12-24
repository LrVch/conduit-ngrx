import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    constructor(
        private readonly snackBar: MatSnackBar,
        private readonly zone: NgZone
    ) { }

    default({ message, action, configuration }: { message: string, action?: string, configuration?: MatSnackBarConfig }) {
        const config = {
            duration: 2000,
            panelClass: 'default-notification-overlay',
            ...configuration
        };
        return this.show(message, config, action);
    }

    info({ message, action, configuration }: { message: string, action?: string, configuration?: MatSnackBarConfig }) {
        const config = {
            duration: 2000,
            panelClass: 'info-notification-overlay',
            ...configuration
        };
        return this.show(message, config, action);
    }

    success({ message, action, configuration }: { message: string, action?: string, configuration?: MatSnackBarConfig }) {
        const config = {
            duration: 2000,
            panelClass: 'success-notification-overlay',
            ...configuration
        };
        return this.show(message, config, action);
    }

    warn({ message, action, configuration }: { message: string, action?: string, configuration?: MatSnackBarConfig }) {
        const config = {
            duration: 2500,
            panelClass: 'warning-notification-overlay',
            ...configuration
        };
        return this.show(message, config, action);
    }

    error({ message, action, configuration }: { message: string, action?: string, configuration?: MatSnackBarConfig }) {
        const config = {
            duration: 3000,
            panelClass: 'error-notification-overlay',
            ...configuration
        };
        return this.show(message, config, action);
    }

    private show(message: string, configuration: MatSnackBarConfig, action: string = null) {
        return this.snackBar.open(message, action, configuration);
    }
}
