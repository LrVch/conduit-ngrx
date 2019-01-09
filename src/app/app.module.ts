import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs';

import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';

import { environment } from '@env/environment';

registerLocaleData(localeRu, 'ru');

/* NGRX */
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { reducers, metaReducers } from '@app/reducers';
import { StoreRouterConnectingModule } from '@ngrx/router-store';

/* Common */
import { AppComponent } from './app.component';
import { LayoutModule } from './layout/layout.module';
import { CoreModule } from './core/core.module';
import { SharedModule, HeaderComponent, FooterComponent } from './shared';
import { HomeModule } from './home/home.module';
import { ArticlesModule } from './articles/articles.module';
import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './auth/auth.module';
import { AppSettingsModule } from './appSettings/app-settings.module';

@NgModule({
  declarations: [AppComponent, HeaderComponent, FooterComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    SharedModule,
    CoreModule,
    AppSettingsModule,
    LayoutModule,
    AuthModule,
    ArticlesModule,
    HomeModule,

    EffectsModule.forRoot([]),
    StoreModule.forRoot(reducers, { metaReducers }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    StoreRouterConnectingModule.forRoot({
      stateKey: 'router'
    }),

    AppRoutingModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
