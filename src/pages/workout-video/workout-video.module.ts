import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WorkoutVideoPage } from './workout-video';

@NgModule({
  declarations: [
    WorkoutVideoPage,
  ],
  imports: [
    IonicPageModule.forChild(WorkoutVideoPage),
  ],
})
export class WorkoutVideoPageModule {}
