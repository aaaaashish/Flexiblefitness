import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { WorkoutReminderScreenPage } from '../workout-reminder-screen/workout-reminder-screen';
import { ServicesProvider } from '../../providers/services/services';

@IonicPage()
@Component({
    selector: 'page-pro-screen',
    templateUrl: 'pro-screen.html',
})
export class ProScreenPage {
    pro: any = "Monthly";
    constructor(public navCtrl: NavController, public navParams: NavParams , public globalSer: ServicesProvider) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ProScreenPage');
    }

    nextFunc(){
        this.globalSer.userData.proPlan = this.pro;
        console.log("workoutReminder=> "+JSON.stringify(this.globalSer.userData));
        this.navCtrl.push(WorkoutReminderScreenPage)
    }

    backBtnFunc(){
      this.globalSer.userData.proPlan = "";
        this.navCtrl.pop();
    }
}
