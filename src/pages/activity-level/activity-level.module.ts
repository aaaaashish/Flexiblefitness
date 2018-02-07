import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ActivityLevelPage } from './activity-level';

@NgModule({
  declarations: [
    ActivityLevelPage,
  ],
  imports: [
    IonicPageModule.forChild(ActivityLevelPage),
  ],
})
export class ActivityLevelPageModule {}
