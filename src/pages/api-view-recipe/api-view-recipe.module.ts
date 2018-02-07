import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ApiViewRecipePage } from './api-view-recipe';

@NgModule({
  declarations: [
    ApiViewRecipePage,
  ],
  imports: [
    IonicPageModule.forChild(ApiViewRecipePage),
  ],
})
export class ApiViewRecipePageModule {}
