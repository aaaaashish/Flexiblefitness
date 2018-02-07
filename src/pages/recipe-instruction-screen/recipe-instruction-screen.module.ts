import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RecipeInstructionScreenPage } from './recipe-instruction-screen';

@NgModule({
  declarations: [
    RecipeInstructionScreenPage,
  ],
  imports: [
    IonicPageModule.forChild(RecipeInstructionScreenPage),
  ],
})
export class RecipeInstructionScreenPageModule {}
