import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { Stripe } from '@ionic-native/stripe';
import { ServicesProvider } from '../../providers/services/services';
import { LocalDbProvider } from '../../providers/local-db/local-db';

@IonicPage()
@Component({
    selector: 'page-payment-for-change-plan',
    templateUrl: 'payment-for-change-plan.html',
})
export class PaymentForChangePlanPage {
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

    constructor(public navCtrl: NavController, public navParams: NavParams, public loader: LoadingController, private stripe: Stripe, public toastCtrl: ToastController, public globalSer: ServicesProvider, public alertCtrl: AlertController, public db: LocalDbProvider) {
    }

    ionViewWillEnter(){
        console.log("will enter called ->"+this.globalSer.changePlanID);
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad PaymentForChangePlanPage');
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
            "userID": localStorage.getItem("userID"),
            "cardToken": tokenObj.id,
            "subscriptionPlanID": parseInt(this.globalSer.changePlanID)
        }
        console.log("api obj-> "+JSON.stringify(data));
        this.globalSer.postMethod(data,"subscribePlan").then(succ =>{
            console.log("subscribePlan succ-> "+JSON.stringify(succ));
            this.loading.dismiss();
            this.globalSer.serData = succ;
            if(this.globalSer.serData.statusCode=="200"){
                let clmnArr = ['userType','initDate'];
                let dataArr = [
                    this.globalSer.serData.data.userType,
                    new Date().getTime(),
                    parseInt(localStorage.getItem("userID"))
                ];
                this.db.updateTbl('Users','userID',clmnArr,dataArr).then(uSucc =>{
                    this.loading.dismiss();
                    console.log("uSucc -> "+JSON.stringify(uSucc));
                    let alert = this.alertCtrl.create({
                        title: 'FLEXIBLE FITNESS',            
                        subTitle: this.globalSer.serData.message,
                        enableBackdropDismiss: false,
                        buttons: [{
                            text: 'OK',
                            handler: () => {
                                this.globalSer.changePlanID = "";
                                this.navCtrl.pop();
                            }
                        }]        
                    });
                    alert.present();
                }).catch(uErr =>{
                    this.loading.dismiss();
                    console.log("uErr -> "+JSON.stringify(uErr));
                });
            }else{
                this.loading.dismiss();
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
