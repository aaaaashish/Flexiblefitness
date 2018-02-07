import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-exercise-detail',
    templateUrl: 'exercise-detail.html',
})
export class ExerciseDetailPage {
    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad ExerciseDetailPage');
    }
    backBtnFunc(){
        this.navCtrl.pop();
    }
}
