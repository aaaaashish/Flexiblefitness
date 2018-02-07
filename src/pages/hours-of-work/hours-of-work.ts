import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CategoryOfJobsPage } from '../category-of-jobs/category-of-jobs';
import { ServicesProvider } from '../../providers/services/services';

@IonicPage()
@Component({
    selector: 'page-hours-of-work',
    templateUrl: 'hours-of-work.html',
})
export class HoursOfWorkPage {
    user = {totalHrs:1};
    constructor(public navCtrl: NavController, public navParams: NavParams, public globalSer: ServicesProvider) {
    }
    ionViewDidLoad() {
      console.log('ionViewDidLoad HoursOfWorkPage');
    }
    min : number = 1;
    max : number = 16;
    step : number = 1;

    backBtnFunc(){
        this.globalSer.userData.hrsPerDayValue = "";
        this.navCtrl.pop();
    }
    nextFunc(){
        console.log("hrsPerDayValue=> "+this.user.totalHrs.toString());
        this.globalSer.userData.hrsPerDayValue = this.user.totalHrs.toString();
        this.navCtrl.push(CategoryOfJobsPage);
    }
}
