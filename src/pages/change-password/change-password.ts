import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { ServicesProvider } from '../../providers/services/services';

@IonicPage()
@Component({
    selector: 'page-change-password',
    templateUrl: 'change-password.html',
})
export class ChangePasswordPage {
    loading:any;
    passRegex = (/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,16})/);
    user = {
        "oldP":"",
        "newP":"",
        "conP":""
    }
    oldPErr = false;
    newPErr = false;
    confPErr = false;
    saveBtn = true;

    constructor(public navCtrl: NavController, public navParams: NavParams, public globalSer: ServicesProvider, public loader: LoadingController, public toastCtrl: ToastController, public alertCtrl: AlertController) {
    }

    ionViewDidLoad() {
       console.log('ionViewDidLoad ChangePasswordPage');
    }

    backBtnFunc(){
        this.navCtrl.pop();
    }

    cancelFunc(){
        this.navCtrl.pop();
    }

    oldPBlurFunc(){
        if(this.user.oldP!=""){
            if(!this.passRegex.test(this.user.oldP)){
                this.oldPErr = true;
                return;
            }else{
                this.oldPErr = false;    
            }
        }else{
            this.oldPErr = false;
        }
    }

    newPBlurFunc(){
        if(this.user.newP!=""){
            if(!this.passRegex.test(this.user.newP)){
                this.newPErr = true;
                return;
            }else{
                this.newPErr = false;
            }
        }else{
            this.newPErr = false;
        }
    }

    confPBlurFunc(){
        if(this.user.conP!=""){
            if(this.user.newP!=this.user.conP){
                this.confPErr = true;
                return;    
            }else{
                this.confPErr = false;
            }
        }else{
            this.confPErr = false;
        }
    }

    saveFunc(){
        //this.navCtrl.pop();
        if(this.globalSer.networkStatus){
            let data = {
                "userID": localStorage.getItem("userID"),
                "password": this.user.oldP,
                "newPassword": this.user.newP
            }      
            console.log("cp data-> "+JSON.stringify(data));  
            this.presentLoading();
            this.globalSer.postMethod(data,"changePassword").then(succ =>{
                this.loading.dismiss();
                console.log("cp succ -> "+JSON.stringify(succ));
                this.globalSer.serData = succ;
                if(this.globalSer.serData.statusCode=="200"){
                    let succAlert = this.alertCtrl.create({
                        title: 'FLEXIBLE FITNESS',            
                        subTitle: "Your password has been changed successfully.",
                        enableBackdropDismiss: false,
                        buttons: [{
                            text: 'OK',
                            handler: () => {
                                this.navCtrl.pop();
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
            }).catch(err =>{
                this.loading.dismiss();
                console.log("cp err -> "+JSON.stringify(err));
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

    presentLoading(){
        this.loading = this.loader.create({
            spinner: "crescent",
            content: 'Please wait...',
            cssClass: "ff-loader"
        });
        this.loading.present();
    }
}
