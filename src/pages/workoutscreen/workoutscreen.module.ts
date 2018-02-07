import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WorkoutscreenPage } from './workoutscreen';

@NgModule({
  declarations: [
    WorkoutscreenPage,
  ],
  imports: [
    IonicPageModule.forChild(WorkoutscreenPage),
  ],
})
export class WorkoutscreenPageModule {}
