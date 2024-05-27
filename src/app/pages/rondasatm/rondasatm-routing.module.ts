import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RondasatmPage } from './rondasatm.page';

const routes: Routes = [
  {
    path: '',
    component: RondasatmPage
  },
  {
    path: 'inspeccion',
    loadChildren: () => import('./inspeccion/inspeccion.module').then( m => m.InspeccionPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RondasatmPageRoutingModule {}
