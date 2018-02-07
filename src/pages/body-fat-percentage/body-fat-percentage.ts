import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EnterBodyFatPage } from '../enter-body-fat/enter-body-fat';
import { SimpleMeasurementPage } from '../simple-measurement/simple-measurement';
import { ServicesProvider } from '../../providers/services/services';

@IonicPage()
@Component({
    selector: 'page-body-fat-percentage',
    templateUrl: 'body-fat-percentage.html',
})
export class BodyFatPercentagePage {
    bodyFatStatus: any = "1";
    status: any;
    constructor(public navCtrl: NavController, public navParams: NavParams, public globalSer: ServicesProvider) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad BodyFatPercentagePage');
    }

    backBtnFunc(){
        this.globalSer.userData.staOfBodyFatPer = "";
        this.navCtrl.pop();
    }
    
    nextFunc(){
        this.bodyFatStatus=="1"?this.status=true:this.status=false;
        console.log("staOfBodyFatPer -> "+this.status);
        this.globalSer.userData.staOfBodyFatPer = this.status;
        if(this.status==true)
            this.navCtrl.push(EnterBodyFatPage);
        else
            this.navCtrl.push(SimpleMeasurementPage);
    }
}
