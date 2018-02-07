import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WorkoutReminderScreenPage } from './workout-reminder-screen';

@NgModule({
  declarations: [
    WorkoutReminderScreenPage,
  ],
  imports: [
    IonicPageModule.forChild(WorkoutReminderScreenPage),
  ],
})
export class WorkoutReminderScreenPageModule {}
