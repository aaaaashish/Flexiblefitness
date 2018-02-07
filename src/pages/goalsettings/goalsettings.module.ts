import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GoalsettingsPage } from './goalsettings';

@NgModule({
  declarations: [
    GoalsettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(GoalsettingsPage),
  ],
})
export class GoalsettingsPageModule {}
