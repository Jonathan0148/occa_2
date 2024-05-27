import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RdetallePage } from './rdetalle.page';

const routes: Routes = [
  {
    path: '',
    component: RdetallePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RdetallePageRoutingModule {}
