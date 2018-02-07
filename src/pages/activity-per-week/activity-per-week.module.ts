import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ActivityPerWeekPage } from './activity-per-week';

@NgModule({
  declarations: [
    ActivityPerWeekPage,
  ],
  imports: [
    IonicPageModule.forChild(ActivityPerWeekPage),
  ],
})
export class ActivityPerWeekPageModule {}
