import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AgeMeasurementPage } from './age-measurement';

@NgModule({
  declarations: [
    AgeMeasurementPage,
  ],
  imports: [
    IonicPageModule.forChild(AgeMeasurementPage),
  ],
})
export class AgeMeasurementPageModule {}
