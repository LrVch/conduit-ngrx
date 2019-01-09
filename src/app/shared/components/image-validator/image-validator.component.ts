import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  AbstractControl,
  ValidationErrors,
  AsyncValidatorFn
} from '@angular/forms';
import { Observable, of, fromEvent, merge } from 'rxjs';
import { map, delay, tap, first } from 'rxjs/operators';

export interface ValidatorStatus {
  error: boolean;
  url: string | null;
}

@Component({
  selector: 'app-image-validator',
  templateUrl: './image-validator.component.html',
  styleUrls: ['./image-validator.component.scss']
})
export class ImageValidatorComponent {
  isUrl = false;
  _url: string;
  isError = false;
  loading = false;
  @Output() status = new EventEmitter<ValidatorStatus>();
  @Input('url') set url(url: string) {
    if (url) {
      this._url = url.trim();
      this.loading = true;
      this.isUrl = true;
    } else {
      this.status.emit({
        error: false,
        url: null
      });
      this.isUrl = false;
      this.isError = true;
    }
  }

  onError() {
    this.isError = true;
    this.loading = false;
    this.status.emit({
      error: true,
      url: this._url
    });
  }

  onLoad(image) {
    if ('naturalHeight' in image) {
      if (image.naturalHeight === 1 || image.naturalWidth === 1) {
        this.onError();
        return;
      }
    }
    this.status.emit({
      error: false,
      url: this._url
    });
    this.isError = false;
    this.loading = false;
  }
}

/*
  validator as promise
*/
// export function CheckImageUrl(): AsyncValidatorFn {
//   return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
//     return new Promise((res, rej) => {
//       if (!control.value) {
//         res(null);
//       }
//       const image = new Image();
//       image.src = control.value;
//       image.onload = function () {
//         if ('naturalHeight' in image) {
//           if (image.naturalHeight === 1 || image.naturalWidth === 1) {
//             res({ invalidImageUrl: true });
//             return;
//           }
//         }

//         res(null);
//       };
//       image.onerror = function () {
//         res({ invalidImageUrl: true });
//       };
//     });
//   };
// }

/*
  validator as observable
*/
// export function CheckImageUrl(): AsyncValidatorFn {
//   return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
//     if (!control.value) {
//       return of(null);
//     }

//     const image = new Image();
//     image.src = control.value;

//     return Observable.create((observer) => {
//       image.onload = function () {
//         console.log('load');

//         if ('naturalHeight' in image) {
//           if (image.naturalHeight === 1 || image.naturalWidth === 1) {
//             observer.next({ invalidImageUrl: true });
//             return;
//           }
//         }
//         observer.next(null);
//       };

//       image.onerror = function () {
//         console.log('error');
//         observer.next({ invalidImageUrl: true });
//       };
//     }).pipe(first());
//   };
// }

export function CheckImageUrl(): AsyncValidatorFn {
  return (
    control: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }

    const image = new Image();
    image.src = control.value;

    const load = fromEvent(image, 'load').pipe(
      map(event => {
        if ('naturalHeight' in image) {
          if (image.naturalHeight === 1 || image.naturalWidth === 1) {
            return { invalidImageUrl: true };
          }
        }
        return null;
      })
    );
    const error = fromEvent(image, 'error').pipe(
      map(() => ({ invalidImageUrl: true }))
    );

    return merge(error, load).pipe(first());
  };
}
