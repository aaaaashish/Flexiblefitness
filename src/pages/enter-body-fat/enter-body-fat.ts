import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AgeMeasurementPage } from '../age-measurement/age-measurement';
import { ServicesProvider } from '../../providers/services/services';
import { ActivityLevelPage } from '../activity-level/activity-level';
import { ActivityLevelStatusPage } from '../activity-level-status/activity-level-status';

@IonicPage()
@Component({
    selector: 'page-enter-body-fat',
    templateUrl: 'enter-body-fat.html',
})
export class EnterBodyFatPage {
    numRegxForDot = (/^(\d+)?([.]?\d{0,1})?$/);
    fatValue: string = "";
    bodyFatErr = false;
    constructor(public navCtrl: NavController, public navParams: NavParams, public globalSer: ServicesProvider) {
    }

    ionViewDidLoad() {
      console.log('ionViewDidLoad EnterBodyFatPage');
    }

    backBtnFunc(){
        this.globalSer.userData.valOfBodyFatPer = "";
        this.navCtrl.pop();
    }
        
    nextFunc(){
        console.log("valOfBodyFatPer=> "+this.fatValue);
        this.globalSer.userData.valOfBodyFatPer = this.fatValue;
        this.navCtrl.push(ActivityLevelStatusPage);
    }

    checkValueFunc(){
        if(this.fatValue!=""){
            if(parseFloat(this.fatValue)==0){
                this.bodyFatErr = true;
                return;
            }else if(!this.numRegxForDot.test(this.fatValue)){
                this.bodyFatErr = true;
                return;
            }else if(parseFloat(this.fatValue)>100){
                this.bodyFatErr = true;
                return;
            }else{
                this.bodyFatErr = false;
            }
        }else{
            this.bodyFatErr = false;
        }
    }
}
