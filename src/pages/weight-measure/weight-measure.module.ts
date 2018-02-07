import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WeightMeasurePage } from './weight-measure';

@NgModule({
  declarations: [
    WeightMeasurePage,
  ],
  imports: [
    IonicPageModule.forChild(WeightMeasurePage),
  ],
})
export class WeightMeasurePageModule {}
