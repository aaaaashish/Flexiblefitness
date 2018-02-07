import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HoursOfWorkPage } from '../hours-of-work/hours-of-work';
import { ServicesProvider } from '../../providers/services/services';
import { PhysicalActivityPage } from '../physical-activity/physical-activity';

@IonicPage()
@Component({
    selector: 'page-days-of-work',
    templateUrl: 'days-of-work.html',
})
export class DaysOfWorkPage {
    user = {totalDays:0}
    constructor(public navCtrl: NavController, public navParams: NavParams, public globalSer: ServicesProvider) {
    }
    ionViewDidLoad() {
      console.log('ionViewDidLoad DaysOfWorkPage');
    }
    min : number = 0;
    max : number = 7;
    step : number = 1;

    backBtnFunc(){
        this.globalSer.userData.daysPerWeekValue = "";
        this.navCtrl.pop();
    }
    nextFunc(){
        console.log("daysPerWeekValue=> "+this.user.totalDays.toString());
        this.globalSer.userData.daysPerWeekValue = this.user.totalDays.toString();
        if(this.user.totalDays==0)
            this.navCtrl.push(PhysicalActivityPage);
        else
            this.navCtrl.push(HoursOfWorkPage);
    }
}
