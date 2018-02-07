import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { WeightMeasurePage } from '../weight-measure/weight-measure';
import { ServicesProvider } from '../../providers/services/services';

@IonicPage()
@Component({
    selector: 'page-tall-measure',
    templateUrl: 'tall-measure.html',
})
export class TallMeasurePage {
    user = {
        ftValue:"",
        inchValue:"",
        cmValue:""
    }
    impDiv: any = false;
    metricDiv: any = false;
    numRegx = (/^[0-9]*$/);
    constructor(public navCtrl: NavController, public navParams: NavParams, public globalSer: ServicesProvider, public toastCtrl: ToastController) {
        if(this.globalSer.userData.unitOfMeasure=="2"){
            this.impDiv = true;
            this.metricDiv = false;
        }else{
            this.impDiv = false;
            this.metricDiv = true;
        }
    }

    ionViewDidLoad() {
      console.log('ionViewDidLoad TallMeasurePage');
    }   

    backBtnFunc(){
        this.globalSer.userData.tallFtValue = "";
        this.globalSer.userData.tallInchValue = "";
        this.globalSer.userData.tallCMValue = "";
        this.navCtrl.pop();
    }
    
    nextFunc(){
        if(this.impDiv == true){
            if(this.user.ftValue==""){
                this.showErr("Enter feet value.");
                return;
            }else if(!this.numRegx.test(this.user.ftValue)){
                this.showErr("Enter valid feet value.");
                return;
            }else if(parseFloat(this.user.ftValue)<4 || parseFloat(this.user.ftValue)>7){
                this.showErr("Height must be between 4’0 and 7’0.");
                return;
            }else if(this.user.inchValue!="" && !this.numRegx.test(this.user.inchValue)){
                this.showErr("Enter valid inch value.");
                return;
            }else if(parseFloat(this.user.ftValue)>=7 && (parseFloat(this.user.inchValue)>0)){
                this.showErr("Height value can't be greater than 7.");
                return;
            }else if(this.user.inchValue!="" && (parseFloat(this.user.inchValue)<0 || parseFloat(this.user.inchValue)>11)){
                this.showErr("Inch value must be between 0 and 11.");
                return;
            }else{
                console.log("ftValue -> "+this.user.ftValue+"  inchValue -> "+this.user.inchValue);
                this.globalSer.userData.tallFtValue = this.user.ftValue;
                this.globalSer.userData.tallInchValue = this.user.inchValue;
                //console.log("tall=> "+JSON.stringify(this.globalSer.userData));
                this.navCtrl.push(WeightMeasurePage);
            }
        }
        if(this.metricDiv == true){
            if(this.user.cmValue==""){
                this.showErr("Enter your height.");
                return;
            }else if(!this.numRegx.test(this.user.cmValue)){
                this.showErr("Enter valid height.");
                return;
            }else if(parseFloat(this.user.cmValue)<120 || parseFloat(this.user.cmValue)>210){
                this.showErr("Height must be between 120 cm and 210 cm.");
                return;
            }else{
                console.log("cmValue -> "+this.user.cmValue);
                this.globalSer.userData.tallCMValue = this.user.cmValue;
                //console.log("tall=> "+JSON.stringify(this.globalSer.userData));
                this.navCtrl.push(WeightMeasurePage);
            }
        }
    }

    showErr(msg){
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 2000,
            position: 'bottom',
            cssClass: "ff-toast"
        });
        toast.present();
    }
}
