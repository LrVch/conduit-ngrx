import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { PageNotFoundComponent } from './shared';
import { AuthGuard } from './core';
const routes: Routes = [
  {
    path: 'settings',
    loadChildren: './settings/settings.module#SettingsModule',
    canLoad: [AuthGuard],
  },
  {
    path: 'profile',
    loadChildren: './profile/profile.module#ProfileModule',
  },
  {
    path: 'editor',
    loadChildren: './editor/editor.module#EditorModule',
    canLoad: [AuthGuard],
  },
  {
    path: 'article',
    loadChildren: './article/article.module#ArticleModule',
  },
  {
    path: '**',
    component: PageNotFoundComponent,
    data: { title: 'conduit.menu.notfound' }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled'
    // preload all modules; optionally we could
    // implement a custom preloading strategy for just some
    // of the modules (PRs welcome 😉)
    // preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
