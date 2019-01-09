import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material/material.module';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
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
  ArticleBodyComponent,
  PaginatorComponent,
  AsideComponent,
  DummyArticleItemComponent,
  DummyTagsComponent,
  DeleteBtnComponent,
  ImageValidatorComponent
} from './components';
import { TranslateModule } from '@ngx-translate/core';

import { MarkdownPipe } from './pipes';
import {
  AvatarDirective,
  ShowAuthedDirective,
  AccentOnInvalidFromFieldDirective
} from './directives';
import { MatPaginatorIntl } from '@angular/material';

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
  ArticleBodyComponent,
  PaginatorComponent,
  AsideComponent,
  DummyArticleItemComponent,
  DummyTagsComponent,
  DeleteBtnComponent,
  ImageValidatorComponent
];

const modules = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  HttpClientModule,
  RouterModule,
  MaterialModule,
  TranslateModule,
  NgxMaterialTimepickerModule
];

@NgModule({
  imports: modules,
  declarations: components,
  exports: [...modules, ...components],
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorComponent }],
  entryComponents: [ConfirmComponent]
})
export class SharedModule {}
