import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ActivityLevelPage } from '../activity-level/activity-level';
import { ServicesProvider } from '../../providers/services/services';
import { DaysOfWorkPage } from '../days-of-work/days-of-work';

@IonicPage()
@Component({
    selector: 'page-activity-level-status',
    templateUrl: 'activity-level-status.html',
})
export class ActivityLevelStatusPage {
    actLevelStatus: any = "1";
    staOfActivity : any;
    constructor(public navCtrl: NavController, public navParams: NavParams, public globalSer: ServicesProvider) {
    }
    ionViewDidLoad() {
       console.log('ionViewDidLoad ActivityLevelStatusPage');
    }

    backBtnFunc(){
        this.globalSer.userData.activityStatus = "";
        this.navCtrl.pop();
    }

    nextFunc(){
        this.actLevelStatus=="1"?this.staOfActivity=true:this.staOfActivity=false;
        console.log("activityStatus -> "+this.staOfActivity);
        this.globalSer.userData.activityStatus = this.staOfActivity;
        if(this.staOfActivity==true)
            this.navCtrl.push(ActivityLevelPage);
        else
            this.navCtrl.push(DaysOfWorkPage);
    }
}
