import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs';


/* Common */
import { AppComponent } from './app.component';
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


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
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
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
