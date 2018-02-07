import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PersonalizedScreenPage } from './personalized-screen';

@NgModule({
  declarations: [
    PersonalizedScreenPage,
  ],
  imports: [
    IonicPageModule.forChild(PersonalizedScreenPage),
  ],
})
export class PersonalizedScreenPageModule {}
