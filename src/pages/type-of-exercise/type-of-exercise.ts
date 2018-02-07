import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import{ WeightGoalPage } from '../weight-goal/weight-goal';
import { ServicesProvider } from '../../providers/services/services';

@IonicPage()
@Component({
    selector: 'page-type-of-exercise',
    templateUrl: 'type-of-exercise.html',
})
export class TypeOfExercisePage {
    typeOfExercise : any = "Light_endurance";
    constructor(public navCtrl: NavController, public navParams: NavParams, public globalSer: ServicesProvider) {
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad TypeOfExercisePage');
    }
    backBtnFunc(){
        this.globalSer.userData.catOfTypesOfAct = "";
        this.navCtrl.pop();
    }
    nextFunc(){
        console.log("catOfTypesOfAct=> "+this.typeOfExercise);
        this.globalSer.userData.catOfTypesOfAct = this.typeOfExercise;
        this.navCtrl.push(WeightGoalPage);
    }
}
