import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { CustomSerializer } from './shared';

/* NGRX */
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

/* Common */
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { LayoutModule } from './layout/layout.module';
import { CoreModule, } from './core/core.module';
import {
  SharedModule,
  HeaderComponent,
  FooterComponent
} from './shared';
import { HomeModule } from './home/home.module';
import { ArticlesModule } from './articles/articles.module';
import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './auth/auth.module';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    LayoutModule,
    AuthModule,
    HomeModule,
    ArticlesModule,
    AppRoutingModule,
    EffectsModule.forRoot([]),
    StoreModule.forRoot(reducers, { metaReducers }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    StoreRouterConnectingModule.forRoot({
      stateKey: 'router'
    }),
  ],
  providers: [
    { provide: RouterStateSerializer, useClass: CustomSerializer }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
