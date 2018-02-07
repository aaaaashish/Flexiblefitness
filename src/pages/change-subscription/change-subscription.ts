import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { ServicesProvider } from '../../providers/services/services';
import { LocalDbProvider } from '../../providers/local-db/local-db';

@IonicPage()
@Component({
    selector: 'page-change-subscription',
    templateUrl: 'change-subscription.html',
})
export class ChangeSubscriptionPage {
    loading:any;
    changeProPlanVal: any = "2";
    changePersPlanVal: any = "3";

    constructor(public navCtrl: NavController, public navParams: NavParams, public globalSer: ServicesProvider, public loader: LoadingController, public alertCtrl: AlertController, public db: LocalDbProvider) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ChangeSubscriptionPage');
    }

    backBtnFunc(){
        this.navCtrl.pop();
    }

    continue(type){
        if(type==1){
            console.log("Basic");
            this.globalSer.changePlanID = "1";
            //this.navCtrl.push("PaymentForChangePlanPage");
            this.callSubscriptionAPI();
        }
        if(type==2){
            console.log("Pro");
            this.globalSer.changePlanID = this.changeProPlanVal;
            this.navCtrl.push("PaymentForChangePlanPage");
        }
        if(type==3){
            console.log("Personalized");
            this.globalSer.changePlanID = this.changePersPlanVal;
            this.navCtrl.push("PaymentForChangePlanPage");
        }
    }

    callSubscriptionAPI(){
        let data = {
            "userID": localStorage.getItem("userID"),
            "subscriptionPlanID": parseInt(this.globalSer.changePlanID)
        }
        console.log("api obj-> "+JSON.stringify(data));
        this.presentLoading();
        this.globalSer.postMethod(data,"subscribePlan").then(succ =>{
            console.log("subscribePlan succ-> "+JSON.stringify(succ));
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

    presentLoading(){
        this.loading = this.loader.create({
            spinner: "crescent",
            content: 'Please wait...',
            cssClass: "ff-loader"
        });
        this.loading.present();
    }
}
