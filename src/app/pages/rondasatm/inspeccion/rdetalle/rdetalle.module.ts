import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RdetallePageRoutingModule } from './rdetalle-routing.module';

import { RdetallePage } from './rdetalle.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RdetallePageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [RdetallePage]
})
export class RdetallePageModule {}
