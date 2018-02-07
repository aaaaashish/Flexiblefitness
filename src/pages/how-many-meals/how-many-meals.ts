import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SwitchYourMealsPage } from '../switch-your-meals/switch-your-meals';
import { ServicesProvider } from '../../providers/services/services';

@IonicPage()
@Component({
  selector: 'page-how-many-meals',
  templateUrl: 'how-many-meals.html',
})
export class HowManyMealsPage {
    howmanyMeals : any = "1";
    constructor(public navCtrl: NavController, public navParams: NavParams,  public globalSer: ServicesProvider) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad HowManyMealsPage');
    }

    onSubmit(){
        this.globalSer.nutriSaveObj.howManyMeal = this.howmanyMeals;
        this.navCtrl.push(SwitchYourMealsPage)
    }
}
