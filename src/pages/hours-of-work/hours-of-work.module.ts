import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HoursOfWorkPage } from './hours-of-work';

@NgModule({
  declarations: [
    HoursOfWorkPage,
  ],
  imports: [
    IonicPageModule.forChild(HoursOfWorkPage),
  ],
})
export class HoursOfWorkPageModule {}
