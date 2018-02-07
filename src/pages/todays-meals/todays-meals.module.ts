import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TodaysMealsPage } from './todays-meals';

@NgModule({
  declarations: [
    TodaysMealsPage,
  ],
  imports: [
    IonicPageModule.forChild(TodaysMealsPage),
  ],
})
export class TodaysMealsPageModule {}
