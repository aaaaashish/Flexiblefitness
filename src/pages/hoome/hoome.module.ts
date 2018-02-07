import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HoomePage } from './hoome';

@NgModule({
  declarations: [
    HoomePage,
  ],
  imports: [
    IonicPageModule.forChild(HoomePage),
  ],
})
export class HoomePageModule {}
