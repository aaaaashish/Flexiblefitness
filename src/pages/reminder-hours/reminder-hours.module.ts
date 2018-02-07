import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReminderHoursPage } from './reminder-hours';

@NgModule({
  declarations: [
    ReminderHoursPage,
  ],
  imports: [
    IonicPageModule.forChild(ReminderHoursPage),
  ],
})
export class ReminderHoursPageModule {}
