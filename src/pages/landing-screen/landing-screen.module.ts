import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LandingScreenPage } from './landing-screen';

@NgModule({
  declarations: [
    LandingScreenPage,
  ],
  imports: [
    IonicPageModule.forChild(LandingScreenPage),
  ],
})
export class LandingScreenPageModule {}
