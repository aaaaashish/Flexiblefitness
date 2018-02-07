import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FitnessGoalPage } from './fitness-goal';

@NgModule({
  declarations: [
    FitnessGoalPage,
  ],
  imports: [
    IonicPageModule.forChild(FitnessGoalPage),
  ],
})
export class FitnessGoalPageModule {}
