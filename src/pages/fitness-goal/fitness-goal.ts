import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ServicesProvider } from '../../providers/services/services';
import { TabsPage } from '../tabs/tabs';


@IonicPage()
@Component({
  selector: 'page-fitness-goal',
  templateUrl: 'fitness-goal.html',
})
export class FitnessGoalPage {
    fitGoal: string = "select";
    constructor(public navCtrl: NavController, public navParams: NavParams, public globalSer: ServicesProvider) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad FitnessGoalPage');
    }

    backBtnFunc() {
        this.globalSer.userData.fitnessGoal = "";
        this.navCtrl.pop();
    }

    onSubmit() {
        this.globalSer.userData.fitnessGoal = this.fitGoal;
        console.log("global=> "+JSON.stringify(this.globalSer.userData));
        this.navCtrl.push(TabsPage)
    }

}
