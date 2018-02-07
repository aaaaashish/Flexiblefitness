import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SimpleMeasurementPage } from './simple-measurement';

@NgModule({
  declarations: [
    SimpleMeasurementPage,
  ],
  imports: [
    IonicPageModule.forChild(SimpleMeasurementPage),
  ],
})
export class SimpleMeasurementPageModule {}
