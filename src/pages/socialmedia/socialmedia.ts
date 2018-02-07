import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Nav, ToastController } from 'ionic-angular';
import { ServicesProvider } from '../../providers/services/services';
import { BrowserTab } from '@ionic-native/browser-tab';

@IonicPage()
@Component({
    selector: 'page-socialmedia',
    templateUrl: 'socialmedia.html',
})
export class SocialmediaPage {
    browser: any;
    
    constructor(public navCtrl: NavController, private browserTab: BrowserTab,public navParams: NavParams,public nav: Nav, public globalSer: ServicesProvider, public toastCtrl: ToastController) {
    
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SocialmediaPage');
    }

    backBtnFunc(){
        console.log("called");
        this.navCtrl.pop();
    } 

    facebookFunc(){
        if(this.globalSer.networkStatus){
            this.browserTab.isAvailable().then((isAvailable: boolean) => {
                if (isAvailable) {
                    this.browserTab.openUrl('https://www.facebook.com/flexiblefitnessofficial/');
                } else {
                    console.log("not available -> "+isAvailable);
                }
    
            });
        }else
            this.showErrToast();
    }

    instagramFunc(){
        if(this.globalSer.networkStatus){
            this.browserTab.isAvailable().then((isAvailable: boolean) => {
                if (isAvailable) {
                    this.browserTab.openUrl('https://www.instagram.com/flexiblefitnessofficial/?hl=en');
                } else {
                    console.log("not available -> "+isAvailable);   
                }
            });
        }else
            this.showErrToast();
    }
    
    twitterFunc(){
        if(this.globalSer.networkStatus){
            this.browserTab.isAvailable().then((isAvailable: boolean) => {
                if (isAvailable) {
                    this.browserTab.openUrl('https://twitter.com/Flexiblefitt');
                } else {
                    console.log("not available -> "+isAvailable);
                }
            });
        }else
            this.showErrToast();
    }

    showErrToast(){
        let toast = this.toastCtrl.create({
            message: "Please check your internet connection.",
            duration: 3000,
            position: 'bottom',
            cssClass: "ff-toast"
        });
        toast.present();
    }
}
