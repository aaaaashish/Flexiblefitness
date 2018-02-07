import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WorkoutListPage } from './workout-list';

@NgModule({
  declarations: [
    WorkoutListPage,
  ],
  imports: [
    IonicPageModule.forChild(WorkoutListPage),
  ],
})
export class WorkoutListPageModule {}
