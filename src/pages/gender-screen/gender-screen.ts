import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UnitOfMeasurementPage } from '../unit-of-measurement/unit-of-measurement';
import { ServicesProvider } from '../../providers/services/services';

@IonicPage()
@Component({
    selector: 'page-gender-screen',
    templateUrl: 'gender-screen.html',
})
export class GenderScreenPage {
    gender : any = "1";
    mActClass : any = true;
    fActClass : any = false;
    constructor(public navCtrl: NavController, public navParams: NavParams, public globalSer: ServicesProvider) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad GenderScreenPage');
    }

    backBtnFunc(){
        this.globalSer.userData.gender = "";
        this.navCtrl.pop();
    }

    selectFunc(type){
        if(type=="MALE"){
            this.gender = "1";
            this.mActClass = true;
            this.fActClass = false;
        }else{
            this.gender = "2";
            this.mActClass = false;
            this.fActClass = true;
        }        
    }

    nextFunc(){
        console.log("gender=> "+this.gender);
        this.globalSer.userData.gender = this.gender;
        this.navCtrl.push(UnitOfMeasurementPage);
    }
}
