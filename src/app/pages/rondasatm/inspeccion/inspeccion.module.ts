import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InspeccionPageRoutingModule } from './inspeccion-routing.module';

import { InspeccionPage } from './inspeccion.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    InspeccionPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [InspeccionPage]
})
export class InspeccionPageModule {}
