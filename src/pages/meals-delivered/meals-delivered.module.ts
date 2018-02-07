import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MealsDeliveredPage } from './meals-delivered';

@NgModule({
  declarations: [
    MealsDeliveredPage,
  ],
  imports: [
    IonicPageModule.forChild(MealsDeliveredPage),
  ],
})
export class MealsDeliveredPageModule {}
