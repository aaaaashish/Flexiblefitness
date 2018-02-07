import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ActivityLevelPage } from '../activity-level/activity-level';
import { ServicesProvider } from '../../providers/services/services';

@IonicPage()
@Component({
    selector: 'page-age-measurement',
    templateUrl: 'age-measurement.html',
})
export class AgeMeasurementPage {
    user = {ageRange:15};
    min : number = 15;
    max : number = 90;
    step : number = 1;
    constructor(public navCtrl: NavController, public navParams: NavParams, public globalSer: ServicesProvider) {
    }
    
    ionViewDidLoad() {
        console.log('ionViewDidLoad AgeMeasurementPage');

    }   

    backBtnFunc(){
        this.globalSer.userData.ageValue = "";
        this.navCtrl.pop();
    }

    nextFunc(){
        this.globalSer.userData.ageValue = this.user.ageRange.toString();
        console.log("global=> "+JSON.stringify(this.globalSer.userData));
        this.navCtrl.push(ActivityLevelPage);
    }
}
