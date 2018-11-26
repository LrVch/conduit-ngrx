import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditorComponent } from './editor/editor.component';
import { AuthGuard } from '../core';
import { EditorGuard } from './editor-guard.service';

const routes: Routes = [
  {
    path: '',
    component: EditorComponent,
    canActivate: [AuthGuard]
  },
  {
    path: ':slug',
    component: EditorComponent,
    canActivate: [AuthGuard, EditorGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditorRoutingModule {}
