import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ServicesProvider } from '../../providers/services/services';

@IonicPage()
@Component({
    selector: 'page-nutrition-sub-cat',
    templateUrl: 'nutrition-sub-cat.html',
})
export class NutritionSubCatPage {
    recipeObj = {
        title:"",
        listArr:[]
    };

    constructor(public navCtrl: NavController, public navParams: NavParams, public globalSer: ServicesProvider, public loader: LoadingController) {
    }

    backBtnFunc(){
        this.navCtrl.popToRoot();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad');
    }

    ionViewWillEnter(){
        console.log('will enter called');
        this.setData();
    }

    setData(){
        this.recipeObj.title = this.globalSer.nutriSubCat.name;
        this.recipeObj.listArr = this.globalSer.nutriSubCat.listArr;
    }
}
