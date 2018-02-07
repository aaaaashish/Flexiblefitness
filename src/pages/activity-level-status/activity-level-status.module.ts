import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ActivityLevelStatusPage } from './activity-level-status';

@NgModule({
  declarations: [
    ActivityLevelStatusPage,
  ],
  imports: [
    IonicPageModule.forChild(ActivityLevelStatusPage),
  ],
})
export class ActivityLevelStatusPageModule {}
