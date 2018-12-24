import { TestBed } from '@angular/core/testing';

import { DialogService } from './dialog.service';
import { MatDialog } from '@angular/material';
import { MaterialModule, ConfirmComponent } from 'src/app/shared';

describe('DialogService', () => {
    let service: DialogService;
    let matDialog: MatDialog;

    class MatDialogMock {
        open = jasmine.createSpy('open');
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MaterialModule],
            providers: [
                DialogService,
                { provide: MatDialog, useClass: MatDialogMock }
            ]
        });
        service = TestBed.get(DialogService);
        matDialog = TestBed.get(MatDialog);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('confirmation method should be executable', () => {
        const config = { data: { question: 'question' } };
        spyOn(service, 'confirmation').and.callThrough();
        service.confirmation(config);
        expect(service.confirmation).toHaveBeenCalled();
        expect(matDialog.open).toHaveBeenCalledWith(ConfirmComponent, {...config, width: '400px'});
    });
});
