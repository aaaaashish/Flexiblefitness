import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PhysicalActivityPage } from './physical-activity';

@NgModule({
  declarations: [
    PhysicalActivityPage,
  ],
  imports: [
    IonicPageModule.forChild(PhysicalActivityPage),
  ],
})
export class PhysicalActivityPageModule {}
