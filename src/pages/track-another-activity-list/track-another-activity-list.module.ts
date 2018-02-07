import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrackAnotherActivityListPage } from './track-another-activity-list';

@NgModule({
  declarations: [
    TrackAnotherActivityListPage,
  ],
  imports: [
    IonicPageModule.forChild(TrackAnotherActivityListPage),
  ],
})
export class TrackAnotherActivityListPageModule {}
