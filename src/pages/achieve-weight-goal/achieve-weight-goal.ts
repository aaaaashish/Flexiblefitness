import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ServicesProvider } from '../../providers/services/services';
import { SubscriptionPlanScreenPage } from '../subscription-plan-screen/subscription-plan-screen';

@IonicPage()
@Component({
    selector: 'page-achieve-weight-goal',
    templateUrl: 'achieve-weight-goal.html',
})
export class AchieveWeightGoalPage {
    achWeightGoal : any = "1";
    constructor(public navCtrl: NavController, public navParams: NavParams, public globalSer: ServicesProvider) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad AchieveWeightGoalPage');
    }

    backBtnFunc(){
        this.globalSer.userData.achWeightGoalValue = "";
        this.navCtrl.pop();
    }

    nextFunc(){
        console.log("achWeightGoal -> "+this.achWeightGoal);
        this.globalSer.userData.achWeightGoalValue = this.achWeightGoal;
        this.navCtrl.push(SubscriptionPlanScreenPage);
    }
}
