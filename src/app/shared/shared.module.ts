import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material/material.module';
import { ListErrorComponent } from './list-error/list-error.component';
import { TagsComponent } from './tags/tags.component';
import { ArticlesListComponent } from './articles-list/articles-list.component';
import { ContentTabsComponent } from './content-tabs/content-tabs.component';
import { ArticleComponent } from './article/article.component';
import { FavoriteComponent } from './favorite/favorite.component';
import { ShowAuthedDirective } from './show-authed.directive';
import { PageNotFoundComponent } from './layout/page-not-found/page-not-found.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { FollowButtonComponent } from './follow-button/follow-button.component';
import { TagListComponent } from './tag-list/tag-list.component';
import { CommentsComponent } from './comments/comments.component';
import { CommentComponent } from './comment/comment.component';
import { BaseFromComponent } from './base-from/base-from.component';
import { AccentOnInvalidFromFieldDirective } from './directives';
import { PasswordStrengthComponent } from './password-strength/password-strength.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { AvatarDirective } from './directives';
import { CommentFormComponent } from './comment-form/comment-form.component';

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
  CommentFormComponent
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
