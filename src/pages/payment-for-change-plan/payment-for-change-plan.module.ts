import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentForChangePlanPage } from './payment-for-change-plan';

@NgModule({
  declarations: [
    PaymentForChangePlanPage,
  ],
  imports: [
    IonicPageModule.forChild(PaymentForChangePlanPage),
  ],
})
export class PaymentForChangePlanPageModule {}
