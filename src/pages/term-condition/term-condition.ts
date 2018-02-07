import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { ServicesProvider } from '../../providers/services/services';

@IonicPage()
@Component({
    selector: 'page-term-condition',
    templateUrl: 'term-condition.html',
})
export class TermConditionPage {
    tcContent:any = "";
    constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public globalSer: ServicesProvider, public loader: LoadingController, public toastCtrl: ToastController, public alertCtrl: AlertController) {
        if(this.globalSer.networkStatus){
            let loading = this.loader.create({
                spinner: "crescent",
                content: 'Please wait...',
                cssClass: "ff-loader"
            });
            loading.present();
            this.globalSer.getMethod("getTermOfUse").then(succ=>{
                loading.dismiss();
                console.log("tc_succ=> ");
                this.globalSer.serData = succ;
                if(this.globalSer.serData.statusCode=="200"){
                    this.tcContent = this.globalSer.serData.data.staticContentDescription;
                }else{
                    let alert = this.alertCtrl.create({
                        title: 'FLEXIBLE FITNESS',            
                        subTitle: this.globalSer.serData.message,
                        buttons: [{
                            text: 'OK',
                            handler: () => {
                            }
                        }]        
                    });
                    alert.present();
                }
            }).catch(err=>{
                loading.dismiss();
                console.log("tc_err=> "+JSON.stringify(err));
            });
        }else{
            let toast = this.toastCtrl.create({
                message: "Please check your internet connection.",
                duration: 3000,
                position: 'bottom',
                cssClass: "ff-toast"
            });
            toast.present();
        }
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad TermConditionPage');
    }

    backBtnFunc() {
        this.viewCtrl.dismiss()
    }

}
