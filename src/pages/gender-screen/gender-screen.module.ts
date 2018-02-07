import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GenderScreenPage } from './gender-screen';

@NgModule({
  declarations: [
    GenderScreenPage,
  ],
  imports: [
    IonicPageModule.forChild(GenderScreenPage),
  ],
})
export class GenderScreenPageModule {}
