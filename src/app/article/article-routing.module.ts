import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/core';
import { ArticleComponent } from './article/article.component';
import { ArticleGuard } from './article-guard.service';

const routes: Routes = [
  {
    path: '',
    component: ArticleComponent,
    canActivate: [ArticleGuard],
    data: { title: 'conduit.menu.article' }
  },
  {
    path: ':slug',
    component: ArticleComponent,
    canActivate: [ArticleGuard],
    data: { title: 'conduit.menu.article' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticleRoutingModule {}
