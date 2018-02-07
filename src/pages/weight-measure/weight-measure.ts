import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BodyFatPercentagePage } from '../body-fat-percentage/body-fat-percentage';
import { ServicesProvider } from '../../providers/services/services';

@IonicPage()
@Component({
    selector: 'page-weight-measure',
    templateUrl: 'weight-measure.html',
})
export class WeightMeasurePage {
    user = { weightRange:0 ,label:""};
    min : number = 0;
    max : number = 0;
    step : number = 1;
    showLabel : any = false;
    constructor(public navCtrl: NavController, public navParams: NavParams, public globalSer: ServicesProvider) {
        if(this.globalSer.userData.unitOfMeasure=="2"){
            this.user.weightRange = 90;
            this.min = 90;
            this.max = 300;
            this.user.label = "lb";
        }else{
            this.user.weightRange = 40;
            this.min = 40;
            this.max = 135;
            this.user.label = "kg";
        }
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad WeightMeasurePage');
    }
    
    backBtnFunc(){
        this.globalSer.userData.weighValue = "";
        this.navCtrl.pop();
    }
    nextFunc(){
        console.log("weightRange=> "+this.user.weightRange.toString());
        this.globalSer.userData.weighValue = this.user.weightRange.toString();
        this.navCtrl.push(BodyFatPercentagePage);
    }
}
