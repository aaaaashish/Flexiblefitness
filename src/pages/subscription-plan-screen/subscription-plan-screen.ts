import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { WorkoutReminderScreenPage } from '../workout-reminder-screen/workout-reminder-screen';
import { ProScreenPage } from '../pro-screen/pro-screen';
import { PersonalizedScreenPage } from '../personalized-screen/personalized-screen';
import { ServicesProvider } from '../../providers/services/services';
import { AddPaymentPage } from '../add-payment/add-payment';

@IonicPage()
@Component({
    selector: 'page-subscription-plan-screen',
    templateUrl: 'subscription-plan-screen.html',
})
export class SubscriptionPlanScreenPage {
    proPlanVal: any = "2";
    persPlanVal: any = "3";
    constructor(public navCtrl: NavController, public navParams: NavParams, public globalSer: ServicesProvider) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SubscriptionPlanScreenPage');
    }

    continue(type){
        if(type==1){
            this.globalSer.userData.subscriptionPlan = "Basic";
            this.globalSer.userData.subscriptionPlanID = "1";
            this.navCtrl.push(WorkoutReminderScreenPage);
        }
        if(type==2){
            this.globalSer.userData.subscriptionPlan = "Pro";
            this.globalSer.userData.subscriptionPlanID = this.proPlanVal;
            this.navCtrl.push(AddPaymentPage);
        }
        if(type==3){
            this.globalSer.userData.subscriptionPlan = "Personalized";
            this.globalSer.userData.subscriptionPlanID = this.persPlanVal;
            this.navCtrl.push(AddPaymentPage);
        }
    }
    
    backBtnFunc(){
        this.globalSer.userData.subscriptionPlan = "";
        this.globalSer.userData.subscriptionPlanID = "";
        this.navCtrl.pop();
    }

}
