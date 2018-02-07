import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ServicesProvider } from '../../providers/services/services';
import { TypeOfExercisePage } from '../type-of-exercise/type-of-exercise';

@IonicPage()
@Component({
    selector: 'page-activity-per-day',
    templateUrl: 'activity-per-day.html',
})
export class ActivityPerDayPage {
    user = {totalHrPerDay:1}
    constructor(public navCtrl: NavController, public navParams: NavParams, public globalSer: ServicesProvider) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ActivityPerDayPage');
    }

    min : number = 1;
    max : number = 8;
    step : number = 1;

    backBtnFunc(){
        this.globalSer.userData.hrsPerDayActValue = "";
        this.navCtrl.pop();
    }

    nextFunc(){
        console.log("hrsPerDayActValue => "+this.user.totalHrPerDay.toString());
        this.globalSer.userData.hrsPerDayActValue = this.user.totalHrPerDay.toString();
        this.navCtrl.push(TypeOfExercisePage);
    }
}
