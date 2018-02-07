import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-add-food',
    templateUrl: 'add-food.html',
})
export class AddFoodPage {
    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }
    ionViewDidLoad() {
       console.log('ionViewDidLoad AddFoodPage');
    }
    selectFood(){
        this.navCtrl.pop();
    }
}
