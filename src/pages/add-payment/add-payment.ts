import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { Stripe } from '@ionic-native/stripe';
import { WorkoutReminderScreenPage } from '../workout-reminder-screen/workout-reminder-screen';
import { ServicesProvider } from '../../providers/services/services';

@IonicPage()
@Component({
    selector: 'page-add-payment',
    templateUrl: 'add-payment.html',
})
export class AddPaymentPage {
    loading:any;
    user = {
        "crdNo":"",
        "cvvNum":"",
        expDate:null
    }
    numRegx = (/^[0-9]*$/);
    crdNuErr = false;
    cvvNuErr = false;
    d = new Date();
    y = this.d.getFullYear()+50; 
    m = this.d.getMonth();
    day = this.d.getDate();
    max  = new Date(this.y,this.m,this.day).toISOString();
    min  = new Date().toISOString();
    constructor(public navCtrl: NavController, public navParams: NavParams, public loader: LoadingController, private stripe: Stripe, public toastCtrl: ToastController, public globalSer: ServicesProvider, public alertCtrl: AlertController) {
    }
    ionViewDidLoad() {
       console.log('ionViewDidLoad AddPaymentPage');
    }

    backBtnFunc(){
        this.navCtrl.pop();
    }

    cardNoBlurFunc(){
        if(this.user.crdNo!=""){
            if(!this.numRegx.test(this.user.crdNo) || this.user.crdNo.trim().length!=16){
                this.crdNuErr = true;
                return;    
            }else{
                this.crdNuErr = false;
            }
        }else{
            this.crdNuErr = false;
        }
    }

    cvvNoBlurFunc(){
        if(this.user.cvvNum!=""){
            if(!this.numRegx.test(this.user.cvvNum) || this.user.cvvNum.trim().length!=3){
                this.cvvNuErr = true;
                return;
            }else{
                this.cvvNuErr = false;
            }
        }else{
            this.cvvNuErr = false;
        }
    }

    pay(){
        if(this.globalSer.networkStatus){
            this.presentLoading();
            this.stripe.setPublishableKey('pk_test_dEeuq5b3DFsWPJQeNUoiK99A');
            let card = {
                number: this.user.crdNo,
                expMonth: this.user.expDate.split('-')[1],
                expYear: this.user.expDate.split('-')[0],
                cvc: this.user.cvvNum
            };
            console.log("data=> "+JSON.stringify(card));    
            this.stripe.createCardToken(card).then(token => {
                console.log("token_succ=> "+JSON.stringify(token));                     
                this.callSubscriptionAPI(token);
            }).catch(error =>{
                this.loading.dismiss();
                console.log("token_err=> "+JSON.stringify(error));
                this.showErr("The payment credentials you entered are invalid. Please check and try again.");
            });
        }else
            this.showErr("Please check your internet connection.");         
    }

    callSubscriptionAPI(tokenObj){
        let data = {
            "userID": "",
            "cardToken": tokenObj.id,
            "subscriptionPlanID": parseInt(this.globalSer.userData.subscriptionPlanID)
        }     
        if(this.navCtrl.getPrevious().name=="SubscriptionPlanScreenPage"){
            data.userID = this.globalSer.currUser.userID;
        }else
            data.userID = localStorage.getItem("userID");
            
        console.log("api obj-> "+JSON.stringify(data));
        this.globalSer.postMethod(data,"subscribePlan").then(succ =>{
            console.log("subscribePlan succ-> "+JSON.stringify(succ));
            this.loading.dismiss();
            this.globalSer.serData = succ;
            if(this.globalSer.serData.statusCode=="200"){
                if(this.globalSer.serData.data.alreadySubscribed==false){
                    if(this.navCtrl.getPrevious().name=="SubscriptionPlanScreenPage"){
                        this.navCtrl.push(WorkoutReminderScreenPage);
                    }else
                        this.navCtrl.pop();
                }else{
                    let alreadyAlert = this.alertCtrl.create({
                        title: 'FLEXIBLE FITNESS',            
                        subTitle: "You have already subscribed this plan.",
                        enableBackdropDismiss: false,
                        buttons: [{
                            text: 'OK',
                            handler: () => {
                                this.navCtrl.push(WorkoutReminderScreenPage);
                            }
                        }]        
                    });
                    alreadyAlert.present();
                }
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
        }).catch(err =>{
            this.loading.dismiss();
            console.log("subs_api_err=> "+JSON.stringify(err));
        });
    }

    showErr(msg){
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'bottom',
            cssClass: "ff-toast"
        });
        toast.present();
    }

    presentLoading(){
        this.loading = this.loader.create({
            spinner: "crescent",
            content: 'Please wait...',
            cssClass: "ff-loader"
        });
        this.loading.present();
    }
}
