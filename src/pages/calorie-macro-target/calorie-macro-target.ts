import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-calorie-macro-target',
    templateUrl: 'calorie-macro-target.html',
})
export class CalorieMacroTargetPage {
    calMacroValue: any = "Yes";
    constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad CalorieMacroTargetPage');
    }
    okFunc(){
        if(this.calMacroValue=="Yes"){
            this.showAlert();
            this.navCtrl.pop();
        }else{
            this.navCtrl.pop();
        }
    }
    showAlert(){
        let alert = this.alertCtrl.create({ 
            title: 'FLEXIBLE FITNESS',
            subTitle: 'Your calories have been adjusted accordingly.',
            buttons: [{
                text: 'OK',
                handler: () => {
                    this.showOtherAlert()
                }
            }]
        }); 
        alert.present();
    }

    showOtherAlert(){
        let alert1 = this.alertCtrl.create({ 
            title: 'FLEXIBLE FITNESS',
            subTitle: 'Make sure to follow your calories to achieve your desired results.',
            buttons: [{
                text: 'OK',
                handler: () => {
                }
            }]
        }); 
        alert1.present();
    }    
}
