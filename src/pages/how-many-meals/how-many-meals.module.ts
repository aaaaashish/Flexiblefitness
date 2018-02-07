import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HowManyMealsPage } from './how-many-meals';

@NgModule({
  declarations: [
    HowManyMealsPage,
  ],
  imports: [
    IonicPageModule.forChild(HowManyMealsPage),
  ],
})
export class HowManyMealsPageModule {}
