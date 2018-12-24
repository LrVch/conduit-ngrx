import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material/material.module';
import { ListErrorComponent } from './components';
import { TagsComponent } from './components';
import { ArticlesListComponent } from './components';
import { ContentTabsComponent } from './components';
import { ArticleComponent } from './components';
import { FavoriteComponent } from './components';
import { PageNotFoundComponent } from './components';
import { UserInfoComponent } from './components';
import { FollowButtonComponent } from './components';
import { TagListComponent } from './components';
import { CommentsComponent } from './components';
import { CommentComponent } from './components';
import { BaseFromComponent } from './components';
import { AccentOnInvalidFromFieldDirective } from './directives';
import { PasswordStrengthComponent } from './components';
import { ConfirmComponent } from './components';
import { AvatarDirective, ShowAuthedDirective } from './directives';
import { CommentFormComponent } from './components';
import { ArticleUserComponent } from './components';
import { ArticleFullComponent } from './components';
import { MarkdownPipe } from './pipes';

const components = [
  ListErrorComponent,
  TagsComponent,
  ArticlesListComponent,
  ContentTabsComponent,
  ArticleComponent,
  FavoriteComponent,
  ShowAuthedDirective,
  PageNotFoundComponent,
  UserInfoComponent,
  FollowButtonComponent,
  TagListComponent,
  CommentsComponent,
  CommentComponent,
  BaseFromComponent,
  AccentOnInvalidFromFieldDirective,
  PasswordStrengthComponent,
  ConfirmComponent,
  AvatarDirective,
  CommentFormComponent,
  ArticleUserComponent,
  ArticleFullComponent,
  MarkdownPipe
];

const modules = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  HttpClientModule,
  RouterModule,
  MaterialModule
];


@NgModule({
  imports: modules,
  declarations: components,
  exports: [
    ...modules,
    ...components
  ],
  entryComponents: [ConfirmComponent],
})
export class SharedModule { }
