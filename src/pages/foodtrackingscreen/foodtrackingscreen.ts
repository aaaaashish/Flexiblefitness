import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AddFoodPage } from '../add-food/add-food';

@IonicPage()
@Component({
    selector: 'page-foodtrackingscreen',
    templateUrl: 'foodtrackingscreen.html',
})
export class FoodtrackingscreenPage {
    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad FoodtrackingscreenPage');
    }
    addFoodFunc(){
        this.navCtrl.push(AddFoodPage);
    }
}
