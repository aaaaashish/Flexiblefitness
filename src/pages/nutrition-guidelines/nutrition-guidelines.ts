import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { KindOfDietPage } from '../kind-of-diet/kind-of-diet';

@IonicPage()
@Component({
    selector: 'page-nutrition-guidelines',
    templateUrl: 'nutrition-guidelines.html',
})
export class NutritionGuidelinesPage {
    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad NutritionGuidelinesPage');
    }

    nextFunc(){
        this.navCtrl.push(KindOfDietPage);
    }
}
