import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ServicesProvider } from '../../providers/services/services';
import { SubscriptionPlanScreenPage } from '../subscription-plan-screen/subscription-plan-screen';
import { AchieveWeightGoalPage } from '../achieve-weight-goal/achieve-weight-goal';

@IonicPage()
@Component({
    selector: 'page-weight-goal',
    templateUrl: 'weight-goal.html',
})
export class WeightGoalPage {
    weightGoal : any;
    constructor(public navCtrl: NavController, public navParams: NavParams, public globalSer: ServicesProvider) {
        if(this.globalSer.userData.valOfBodyFatPer!=""){
            if(this.globalSer.userData.gender=="1"){
                if(parseInt(this.globalSer.userData.valOfBodyFatPer)>12){
                    this.weightGoal = "1";
                }else if(parseInt(this.globalSer.userData.valOfBodyFatPer)<=12){
                    this.weightGoal = "2";
                }else{
                    this.weightGoal = "1";
                }
            }
            if(this.globalSer.userData.gender=="2"){
                if(parseInt(this.globalSer.userData.valOfBodyFatPer)>20){
                    this.weightGoal = "1";
                }else if(parseInt(this.globalSer.userData.valOfBodyFatPer)<=20){
                    this.weightGoal = "2";
                }else{
                    this.weightGoal = "1";
                }
            }
        }else
            this.weightGoal = "1";
    }
    
    ionViewDidLoad() {
      console.log('ionViewDidLoad WeightGoalPage');
    }

    backBtnFunc(){
        this.globalSer.userData.weightGoalValue = "";
        this.navCtrl.pop();
    }
    nextFunc(){
        console.log("weightGoalValue=> "+this.weightGoal);
        this.globalSer.userData.weightGoalValue = this.weightGoal;
        /*if(this.weightGoal == "1" || this.weightGoal == "2")
            this.navCtrl.push(AchieveWeightGoalPage);
        else
            this.navCtrl.push(SubscriptionPlanScreenPage);*/
        this.navCtrl.push(AchieveWeightGoalPage);
    }
}
