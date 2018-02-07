import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RecipeSelectionScreenPage } from './recipe-selection-screen';

@NgModule({
  declarations: [
    RecipeSelectionScreenPage,
  ],
  imports: [
    IonicPageModule.forChild(RecipeSelectionScreenPage),
  ],
})
export class RecipeSelectionScreenPageModule {}
