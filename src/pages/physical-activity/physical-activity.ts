import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ServicesProvider } from '../../providers/services/services';
import { WeightGoalPage } from '../weight-goal/weight-goal';
import { ActivityPerWeekPage } from '../activity-per-week/activity-per-week';

@IonicPage()
@Component({
    selector: 'page-physical-activity',
    templateUrl: 'physical-activity.html',
})
export class PhysicalActivityPage {
    physicalActSta: any = "1";
    staOfPhyActivity : any;
    constructor(public navCtrl: NavController, public navParams: NavParams, public globalSer: ServicesProvider) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad PhysicalActivityPage');
    }

    backBtnFunc(){
        this.globalSer.userData.phyActStatus = "";
        this.navCtrl.pop();
    }

    nextFunc(){
        this.physicalActSta=="1"?this.staOfPhyActivity=true:this.staOfPhyActivity=false;
        console.log("phyActStatus -> "+this.staOfPhyActivity);
        this.globalSer.userData.phyActStatus = this.staOfPhyActivity;
        if(this.staOfPhyActivity==true)
            this.navCtrl.push(ActivityPerWeekPage);
        else
            this.navCtrl.push(WeightGoalPage);
    }
}
