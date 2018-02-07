import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SubscriptionPlanScreenPage } from './subscription-plan-screen';

@NgModule({
  declarations: [
    SubscriptionPlanScreenPage,
  ],
  imports: [
    IonicPageModule.forChild(SubscriptionPlanScreenPage),
  ],
})
export class SubscriptionPlanScreenPageModule {}
