import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the MealsDeliveredScreenPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-meals-delivered-screen',
  templateUrl: 'meals-delivered-screen.html',
})
export class MealsDeliveredScreenPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MealsDeliveredScreenPage');
  }
  backBtnFunc(){
    this.navCtrl.pop();
}
}
