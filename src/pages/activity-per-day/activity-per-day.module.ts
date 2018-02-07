import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ActivityPerDayPage } from './activity-per-day';

@NgModule({
  declarations: [
    ActivityPerDayPage,
  ],
  imports: [
    IonicPageModule.forChild(ActivityPerDayPage),
  ],
})
export class ActivityPerDayPageModule {}
