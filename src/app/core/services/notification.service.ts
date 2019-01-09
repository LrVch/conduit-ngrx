import { Injectable, NgZone } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition
} from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  defaults = {
    horizontalPosition: 'end' as MatSnackBarHorizontalPosition
  };
  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly zone: NgZone
  ) {}

  default({
    message,
    action,
    configuration
  }: {
    message: string;
    action?: string;
    configuration?: MatSnackBarConfig;
  }) {
    const config = {
      ...this.defaults,
      duration: 2000,
      panelClass: 'default-notification-overlay',
      ...configuration
    };
    return this.show(message, config, action);
  }

  info({
    message,
    action,
    configuration
  }: {
    message: string;
    action?: string;
    configuration?: MatSnackBarConfig;
  }) {
    const config = {
      ...this.defaults,
      duration: 2000,
      panelClass: 'info-notification-overlay',
      ...configuration
    };
    return this.show(message, config, action);
  }

  success({
    message,
    action,
    configuration
  }: {
    message: string;
    action?: string;
    configuration?: MatSnackBarConfig;
  }) {
    const config = {
      ...this.defaults,
      duration: 2000,
      panelClass: 'success-notification-overlay',
      ...configuration
    };
    return this.show(message, config, action);
  }

  warn({
    message,
    action,
    configuration
  }: {
    message: string;
    action?: string;
    configuration?: MatSnackBarConfig;
  }) {
    const config = {
      ...this.defaults,
      duration: 2500,
      panelClass: 'warning-notification-overlay',
      ...configuration
    };
    return this.show(message, config, action);
  }

  error({
    message,
    action,
    configuration
  }: {
    message: string;
    action?: string;
    configuration?: MatSnackBarConfig;
  }) {
    const config = {
      ...this.defaults,
      duration: 3000,
      panelClass: 'error-notification-overlay',
      ...configuration
    };
    return this.show(message, config, action);
  }

  private show(
    message: string,
    configuration: MatSnackBarConfig,
    action: string = null
  ) {
    return this.snackBar.open(message, action, configuration);
  }
}
