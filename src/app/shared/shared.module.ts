import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material/material.module';
import {
  ListErrorComponent,
  TagsComponent,
  ArticlesListComponent,
  ContentTabsComponent,
  ArticleComponent,
  FavoriteComponent,
  PageNotFoundComponent,
  UserInfoComponent,
  FollowButtonComponent,
  TagListComponent,
  CommentsComponent,
  CommentComponent,
  BaseFromComponent,
  PasswordStrengthComponent,
  ConfirmComponent,
  CommentFormComponent,
  ArticleUserComponent,
  ArticleFullComponent,
  ArticleBodyComponent
} from './components';

import { MarkdownPipe } from './pipes';
import { AvatarDirective, ShowAuthedDirective, AccentOnInvalidFromFieldDirective } from './directives';

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
  MarkdownPipe,
  ArticleBodyComponent
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
