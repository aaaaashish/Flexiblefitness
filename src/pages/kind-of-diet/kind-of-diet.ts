import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AllergicPage } from '../allergic/allergic';
import { ServicesProvider } from '../../providers/services/services';

@IonicPage()
@Component({
    selector: 'page-kind-of-diet',
    templateUrl: 'kind-of-diet.html',
})
export class KindOfDietPage {
    kindOfDiet : any = "5";
    constructor(public navCtrl: NavController, public navParams: NavParams,  public globalSer: ServicesProvider) {
    }

    ionViewDidLoad() {
        //console.log('ionViewDidLoad KindOfDietPage');
    }

    onSubmit(){
        this.globalSer.nutriSaveObj.kindOfDiat = this.kindOfDiet;
        this.navCtrl.push(AllergicPage)
    }    
}
