import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DaysOfWorkPage } from './days-of-work';

@NgModule({
  declarations: [
    DaysOfWorkPage,
  ],
  imports: [
    IonicPageModule.forChild(DaysOfWorkPage),
  ],
})
export class DaysOfWorkPageModule {}
