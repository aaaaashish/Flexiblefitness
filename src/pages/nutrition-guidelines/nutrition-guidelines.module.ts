import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NutritionGuidelinesPage } from './nutrition-guidelines';

@NgModule({
  declarations: [
    NutritionGuidelinesPage,
  ],
  imports: [
    IonicPageModule.forChild(NutritionGuidelinesPage),
  ],
})
export class NutritionGuidelinesPageModule {}
