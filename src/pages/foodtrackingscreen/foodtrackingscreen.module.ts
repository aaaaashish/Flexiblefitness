import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FoodtrackingscreenPage } from './foodtrackingscreen';

@NgModule({
  declarations: [
    FoodtrackingscreenPage,
  ],
  imports: [
    IonicPageModule.forChild(FoodtrackingscreenPage),
  ],
})
export class FoodtrackingscreenPageModule {}
