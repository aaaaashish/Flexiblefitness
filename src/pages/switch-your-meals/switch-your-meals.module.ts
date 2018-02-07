import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SwitchYourMealsPage } from './switch-your-meals';

@NgModule({
  declarations: [
    SwitchYourMealsPage,
  ],
  imports: [
    IonicPageModule.forChild(SwitchYourMealsPage),
  ],
})
export class SwitchYourMealsPageModule {}
