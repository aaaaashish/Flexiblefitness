import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SimpleMeasurementYesPage } from '../simple-measurement-yes/simple-measurement-yes';
import { ServicesProvider } from '../../providers/services/services';
import { ActivityLevelStatusPage } from '../activity-level-status/activity-level-status';

@IonicPage()
@Component({
    selector: 'page-simple-measurement',
    templateUrl: 'simple-measurement.html',
})
export class SimpleMeasurementPage {
    simpleMeaStatus: any = "1";
    statusVal : any;
    constructor(public navCtrl: NavController, public navParams: NavParams, public globalSer: ServicesProvider) {
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad SimpleMeasurementPage');
    }    
    backBtnFunc(){
        this.globalSer.userData.staOfSimpleMeasurement = "";
        this.navCtrl.pop();
    }
    nextFunc(){
        this.simpleMeaStatus=="1"?this.statusVal=true:this.statusVal=false;
        console.log("staOfSimpleMeasurement -> "+this.statusVal);
        this.globalSer.userData.staOfSimpleMeasurement = this.statusVal;
        if(this.statusVal==true)
            this.navCtrl.push(SimpleMeasurementYesPage);
        else
            this.navCtrl.push(ActivityLevelStatusPage);
    }
}
