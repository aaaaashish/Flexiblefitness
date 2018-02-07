import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ServicesProvider } from '../../providers/services/services';
import { ActivityLevelStatusPage } from '../activity-level-status/activity-level-status';

@IonicPage()
@Component({
    selector: 'page-simple-measurement-yes',
    templateUrl: 'simple-measurement-yes.html',
})
export class SimpleMeasurementYesPage {
    forMale : any = false;
    forFemale : any = false;
    mWiast:string = "";
    fWiast:string = "";
    fWrist:string = "";
    fHip:string = "";
    fForearm:string = "";
    numRegx = (/^[0-9]*$/);
    mWaistErr = false;
    fWaistErr = false;
    fWristErr = false;
    fHipErr = false;
    fForearmErr = false;
    constructor(public navCtrl: NavController, public navParams: NavParams, public globalSer: ServicesProvider) {
        if(this.globalSer.userData.gender=="1"){
            this.forMale = true;
            this.forFemale = false;
        }else{
            this.forMale = false;
            this.forFemale = true;
        }
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SimpleMeasurementYesPage');
    }

    backBtnFunc(){
        if(this.globalSer.userData.gender=="1")
            this.globalSer.userData.maleWaistVal = "";
        else{
            this.globalSer.userData.femaleWaistVal = "";
            this.globalSer.userData.femaleWristVal = "";
            this.globalSer.userData.femaleHipVal = "";
            this.globalSer.userData.femaleforearmVal = "";
        }
        this.navCtrl.pop();
    }

    nextFunc(){
        if(this.globalSer.userData.gender=="1")
            this.globalSer.userData.maleWaistVal = this.mWiast;
        else{
            this.globalSer.userData.femaleWaistVal = this.fWiast;
            this.globalSer.userData.femaleWristVal = this.fWrist;
            this.globalSer.userData.femaleHipVal = this.fHip;
            this.globalSer.userData.femaleforearmVal = this.fForearm;
        }
        console.log("mWiast=> "+this.mWiast+" fWiast -> "+this.fWiast+" fWrist -> "+this.fWrist+" fHip -> "+this.fHip+" fForearm -> "+this.fForearm);
        this.navCtrl.push(ActivityLevelStatusPage);
    }

    mWaistValueCheckFunc(){
        if(this.mWiast!=""){
            if(parseFloat(this.mWiast)==0){
                this.mWaistErr = true;
                return;    
            }else if(!this.numRegx.test(this.mWiast) || parseFloat(this.mWiast)>100){
                this.mWaistErr = true;
                return;
            }else{
                this.mWaistErr = false;
            }
        }else{
            this.mWaistErr = false;
        }
    }

    fWaistValueCheckFunc(){
        if(this.fWiast!=""){
            if(parseFloat(this.fWiast)==0){
                this.fWaistErr = true;
                return;    
            }else if(!this.numRegx.test(this.fWiast) || parseFloat(this.fWiast)>100){
                this.fWaistErr = true;
                return;
            }else{
                this.fWaistErr = false;
            }
        }else{
            this.fWaistErr = false;
        }
    }

    fWristValueCheckFunc(){
        if(this.fWrist!=""){
            if(parseFloat(this.fWrist)==0){
                this.fWristErr = true;
                return;    
            }else if(!this.numRegx.test(this.fWrist) || parseFloat(this.fWrist)>50){
                this.fWristErr = true;
                return;
            }else{
                this.fWristErr = false;
            }
        }else{
            this.fWristErr = false;
        }
    }

    fHipValueCheckFunc(){
        if(this.fHip!=""){
            if(parseFloat(this.fHip)==0){
                this.fHipErr = true;
                return;    
            }else if(!this.numRegx.test(this.fHip) || parseFloat(this.fHip)>50){
                this.fHipErr = true;
                return;
            }else{
                this.fHipErr = false;
            }
        }else{
            this.fHipErr = false;
        }
    }

    fForearmValueCheckFunc(){
        if(this.fForearm!=""){
            if(parseFloat(this.fForearm)==0){
                this.fForearmErr = true;
                return;    
            }else if(!this.numRegx.test(this.fForearm) || parseFloat(this.fForearm)>50){
                this.fForearmErr = true;
                return;
            }else{
                this.fForearmErr = false;
            }
        }else{
            this.fForearmErr = false;
        }
    }
}
