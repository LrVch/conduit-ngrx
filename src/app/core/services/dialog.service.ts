import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ConfirmComponent } from 'src/app/shared';

@Injectable({
    providedIn: 'root'
})
export class DialogService {
    constructor(
        private dialog: MatDialog
    ) { }

    confirmation(configuration?: MatDialogConfig, component = ConfirmComponent) {
        const config = {
            width: '400px',
            ...configuration
        };
        return this.open(component, config);
    }

    private open(component, configuration: MatDialogConfig) {
        return this.dialog.open(component, configuration);
    }
}
