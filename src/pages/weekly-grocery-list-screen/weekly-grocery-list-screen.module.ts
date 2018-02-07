import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WeeklyGroceryListScreenPage } from './weekly-grocery-list-screen';

@NgModule({
  declarations: [
    WeeklyGroceryListScreenPage,
  ],
  imports: [
    IonicPageModule.forChild(WeeklyGroceryListScreenPage),
  ],
})
export class WeeklyGroceryListScreenPageModule {}
