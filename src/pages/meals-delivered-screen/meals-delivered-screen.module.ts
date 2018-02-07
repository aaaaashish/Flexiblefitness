import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MealsDeliveredScreenPage } from './meals-delivered-screen';

@NgModule({
  declarations: [
    MealsDeliveredScreenPage,
  ],
  imports: [
    IonicPageModule.forChild(MealsDeliveredScreenPage),
  ],
})
export class MealsDeliveredScreenPageModule {}
