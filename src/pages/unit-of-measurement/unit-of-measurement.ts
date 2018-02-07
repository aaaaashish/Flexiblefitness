import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TallMeasurePage } from '../tall-measure/tall-measure';
import { ServicesProvider } from '../../providers/services/services';


@IonicPage()
@Component({
    selector: 'page-unit-of-measurement',
    templateUrl: 'unit-of-measurement.html',
})
export class UnitOfMeasurementPage {
    unitOfMeasure: any = "2";
    constructor(public navCtrl: NavController, public navParams: NavParams, public globalSer: ServicesProvider) {
        
    }

    ionViewDidLoad() {
      console.log('ionViewDidLoad UnitOfMeasurementPage');
    }

    backBtnFunc(){
        this.globalSer.userData.unitOfMeasure = "";
        this.navCtrl.pop();
    }
    
    nextFunc(){
        console.log("unitOfMeasure -> "+this.unitOfMeasure);
        this.globalSer.userData.unitOfMeasure = this.unitOfMeasure;
        this.navCtrl.push(TallMeasurePage);
    }
    
}
