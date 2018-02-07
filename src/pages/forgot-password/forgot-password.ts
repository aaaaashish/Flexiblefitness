import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginPage } from '../login/login';
import { ServicesProvider } from '../../providers/services/services';

@IonicPage()
@Component({
    selector: 'page-forgot-password',
    templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {
    forgotForm: FormGroup;
    user = {
        emailVal:""
    };
    constructor(public navCtrl: NavController, public navParams: NavParams, public globalSer: ServicesProvider, public loader: LoadingController, public toastCtrl: ToastController, public alertCtrl: AlertController) {
        this.forgotForm = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.pattern(/^[A-Z0-9_]+([\.][A-Z0-9_]+)*@[A-Z0-9-]+(\.[a-zA-Z]{2,4})+$/i)])
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ForgotPasswordPage');
    }

    backBtnFunc() {
        this.navCtrl.pop();
    }

    submit(){     
        //this.navCtrl.push(LoginPage);   
        if(this.globalSer.networkStatus){
            let data = {
                "emailAddress": this.user.emailVal     
            }
            console.log("data=> "+JSON.stringify(data));
            let loading = this.loader.create({
                spinner: "crescent",
                content: 'Please wait...',
                cssClass: "ff-loader"
            });
            loading.present();
            this.globalSer.postMethod(data,"forgotPassword").then(succ=>{
                loading.dismiss();
                console.log("forgot_succ=> "+JSON.stringify(succ));
                this.globalSer.serData = succ;
                if(this.globalSer.serData.statusCode=="200"){
                    let succAlert = this.alertCtrl.create({
                        title: 'FLEXIBLE FITNESS',            
                        subTitle: this.globalSer.serData.message,
                        enableBackdropDismiss: false,                        
                        buttons: [{
                            text: 'OK',
                            handler: () => {
                                this.navCtrl.push(LoginPage);
                            }
                        }]        
                    });
                    succAlert.present();
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
                console.log("forgot_err=> "+JSON.stringify(err));
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
}
