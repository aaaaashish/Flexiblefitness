import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WeightGoalPage } from './weight-goal';

@NgModule({
  declarations: [
    WeightGoalPage,
  ],
  imports: [
    IonicPageModule.forChild(WeightGoalPage),
  ],
})
export class WeightGoalPageModule {}
