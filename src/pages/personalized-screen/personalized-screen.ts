import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { WorkoutReminderScreenPage } from '../workout-reminder-screen/workout-reminder-screen';
import { ServicesProvider } from '../../providers/services/services';

@IonicPage()
@Component({
    selector: 'page-personalized-screen',
    templateUrl: 'personalized-screen.html',
})
export class PersonalizedScreenPage {
    Personalized: any = "Monthly";
    constructor(public navCtrl: NavController, public navParams: NavParams,public globalSer: ServicesProvider) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad PersonalizedScreenPage');
    }
    
    nextFunc(){
        this.globalSer.userData.personalizedPlan = this.Personalized;
        console.log("workoutReminder=> "+JSON.stringify(this.globalSer.userData));
        this.navCtrl.push(WorkoutReminderScreenPage)
    }

    backBtnFunc(){
        this.globalSer.userData.personalizedPlan = "";
        this.navCtrl.pop();
    }
}
