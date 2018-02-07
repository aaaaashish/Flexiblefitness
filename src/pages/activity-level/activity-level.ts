import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { WeightGoalPage } from '../weight-goal/weight-goal';
import { ServicesProvider } from '../../providers/services/services';

@IonicPage()
@Component({
    selector: 'page-activity-level',
    templateUrl: 'activity-level.html',
})
export class ActivityLevelPage {
    activity : any = "1";
    constructor(public navCtrl: NavController, public navParams: NavParams, public globalSer: ServicesProvider) {
    }
    
    ionViewDidLoad() {
      console.log('ionViewDidLoad ActivityLevelPage');
    }

    backBtnFunc(){
        this.globalSer.userData.activityLevel = "";
        this.navCtrl.pop();
    }

    nextFunc(){
        console.log("activityLevel=> "+this.activity);
        this.globalSer.userData.activityLevel = this.activity;
        this.navCtrl.push(WeightGoalPage);
    }
}
