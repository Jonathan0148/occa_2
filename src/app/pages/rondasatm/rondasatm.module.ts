import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { RondasatmPageRoutingModule } from './rondasatm-routing.module';

import { RondasatmPage } from './rondasatm.page';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RondasatmPageRoutingModule,
      TranslateModule.forChild()
  ],
  declarations: [RondasatmPage]
})
export class RondasatmPageModule {}
