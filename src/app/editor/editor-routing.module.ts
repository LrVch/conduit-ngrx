import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditorComponent } from './editor/editor.component';
import { AuthGuard } from '../core';
import { EditorGuard } from './editor-guard.service';
import { CanDeactivateGuard } from '../core/services/can-deactivate.guard';

const routes: Routes = [
  {
    path: '',
    component: EditorComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard],
    data: { title: 'conduit.menu.newarticle',  animation: 'EditorComponent'}
  },
  {
    path: ':slug',
    component: EditorComponent,
    canActivate: [AuthGuard, EditorGuard],
    canDeactivate: [CanDeactivateGuard],
    data: { title: 'conduit.menu.editarticle', animation: 'EditorComponent' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditorRoutingModule {}
