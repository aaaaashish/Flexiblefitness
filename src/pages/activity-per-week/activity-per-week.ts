import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { WeightGoalPage } from '../weight-goal/weight-goal';
import { ServicesProvider } from '../../providers/services/services';
import { ActivityPerDayPage } from '../activity-per-day/activity-per-day';

@IonicPage()
@Component({
    selector: 'page-activity-per-week',
    templateUrl: 'activity-per-week.html',
})
export class ActivityPerWeekPage {
    user = {totalExe:1}
    constructor(public navCtrl: NavController, public navParams: NavParams, public globalSer: ServicesProvider) {
    }
    ionViewDidLoad() {
      console.log('ionViewDidLoad ActivityPerWeekPage');
    }
    min : number = 1;
    max : number = 7;
    step : number = 1;

    backBtnFunc(){
        this.globalSer.userData.daysPerWeekActValue = "";
        this.navCtrl.pop();
    }
    nextFunc(){
        console.log("daysPerWeekActValue=> "+this.user.totalExe.toString());
        this.globalSer.userData.daysPerWeekActValue = this.user.totalExe.toString();
        this.navCtrl.push(ActivityPerDayPage);
    }
}
