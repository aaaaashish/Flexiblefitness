import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NutritionUpdatePage } from './nutrition-update';

@NgModule({
  declarations: [
    NutritionUpdatePage,
  ],
  imports: [
    IonicPageModule.forChild(NutritionUpdatePage),
  ],
})
export class NutritionUpdatePageModule {}
