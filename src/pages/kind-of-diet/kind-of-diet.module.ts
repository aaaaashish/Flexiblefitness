import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { KindOfDietPage } from './kind-of-diet';

@NgModule({
  declarations: [
    KindOfDietPage,
  ],
  imports: [
    IonicPageModule.forChild(KindOfDietPage),
  ],
})
export class KindOfDietPageModule {}
