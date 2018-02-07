import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FreeUserNutritionPage } from './free-user-nutrition';

@NgModule({
  declarations: [
    FreeUserNutritionPage,
  ],
  imports: [
    IonicPageModule.forChild(FreeUserNutritionPage),
  ],
})
export class FreeUserNutritionPageModule {}
