import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core';
import { ArticleComponent } from './article/article.component';
import { ArticleGuard } from './article-guard.service';

const routes: Routes = [
  {
    path: '',
    component: ArticleComponent,
    canActivate: [ArticleGuard]
  },
  {
    path: ':slug',
    component: ArticleComponent,
    canActivate: [ArticleGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticleRoutingModule {}
