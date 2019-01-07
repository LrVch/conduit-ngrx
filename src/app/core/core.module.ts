import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpTokenInterceptor } from './interceptors/http.token.interceptor';
import { RouterStateSerializer } from '@ngrx/router-store';
import { CustomSerializer } from '@app/core/utils';
import { environment } from '@env/environment';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';

import {
  ApiService,
  ArticlesService,
  AuthGuard,
  CommentsService,
  ProfilesService,
  TagsService,
  UserService,
  CustomEventManager,
  ScrollService,
  DomUtilService,
  LocalStorageService
} from './services';
import { EventManager } from '@angular/platform-browser';
import { TitleService } from './services/title.service';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgxMaterialTimepickerModule.forRoot()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
    ApiService,
    ArticlesService,
    AuthGuard,
    CommentsService,
    ProfilesService,
    TagsService,
    UserService,
    ScrollService,
    DomUtilService,
    TitleService,
    LocalStorageService,
    { provide: EventManager, useClass: CustomEventManager },
    { provide: RouterStateSerializer, useClass: CustomSerializer },
  ],
  declarations: [],
  exports: [TranslateModule]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    `${environment.i18nPrefix}/assets/i18n/`,
    '.json'
  );
}
