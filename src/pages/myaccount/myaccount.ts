import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { ServicesProvider } from '../../providers/services/services';
import { ChangePasswordPage } from '../change-password/change-password';
import { ChangeSubscriptionPage } from '../change-subscription/change-subscription';
import { LocalDbProvider } from '../../providers/local-db/local-db';

@IonicPage()
@Component({
    selector: 'page-myaccount',
    templateUrl: 'myaccount.html',
})
export class MyaccountPage {
    fObj:any;
    loading:any;
    emailRegex = (/^[A-Z0-9_]+([\.][A-Z0-9_]+)*@[A-Z0-9-]+(\.[a-zA-Z]{2,4})+$/i);
    nameRegex = (/^[A-Za-z ]+$/);
    lastNameRegex = (/^[A-Za-z]+$/);
    user = {
        "email":"",
        "fName":"",
        "lName":"",
        DOB: null,
        //DOB: new Date((704745000000)+(24*60*60*1000)).toISOString(),
        "age":"",
        "gender":"1"
    }
    subPlanArr = [{
        name:"Monthly",
    },{
        name:"Quarterly",
    },{
        name:"Annually",
    }];
    emailErr = false;
    fNameErr = false;
    lNameErr = false;
    updateBtn = true;
    max  = new Date().toISOString();
    fNameErrMsg:any = "";
    lNameErrMsg:any = "";
    changePStatus:any = true;

    constructor(public navCtrl: NavController, public navParams: NavParams, public nav: Nav, public globalSer: ServicesProvider, public toastCtrl: ToastController, public alertCtrl: AlertController, public loader: LoadingController, public db: LocalDbProvider) {
        this.presentLoading();
        this.db.fetchDataFromUsersTbl(localStorage.getItem("userID")).then(fSucc =>{
            //console.log("fSucc=> "+JSON.stringify(fSucc));
            this.fObj = fSucc;
            this.user.email = this.fObj.emailAddress;
            this.user.fName = this.fObj.firstName;
            this.user.lName = this.fObj.lastName;
            //this.user.DOB = new Date(this.fObj.dob).toISOString();
            this.user.age = this.calcDate(new Date().getTime(),this.fObj.dob).toString();
            console.log("age -> "+this.user.age);
            this.user.gender = this.fObj.gender;
            this.fObj.socialId!=""?this.changePStatus=false:this.changePStatus=true;
            this.loading.dismiss();
        }).catch(fErr =>{
            this.loading.dismiss();
            console.log("fErr=> "+JSON.stringify(fErr));
        });
    }

    calcDate(today,past) {
        var diff = Math.round(today - past);
        var day = 1000 * 60 * 60 * 24;    
        var days = Math.round(diff/day);
        var months = Math.round(days/31);
        var years = Math.round(months/12);    
        return years
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad MyaccountPage');
    }

    backBtnFunc(){
        this.navCtrl.pop();
    }

    cancelFunc(){
        this.navCtrl.pop();
    }

    updateFunc(){
        this.presentLoading();
        let clmnArr = ['emailAddress','firstName','lastName','gender','initDate'];
        let dataArr = [
            this.user.email,
            this.user.fName,
            this.user.lName,
            this.user.gender,
            new Date().getTime(),
            parseInt(localStorage.getItem("userID"))
        ];
        this.db.updateTbl('Users','userID',clmnArr,dataArr).then(uSucc =>{
            this.loading.dismiss();
            console.log("uSucc -> "+JSON.stringify(uSucc));
            let upAlert = this.alertCtrl.create({
                title: 'FLEXIBLE FITNESS',            
                subTitle: "Your account has been updated successfully.",
                enableBackdropDismiss: false,
                buttons: [{
                    text: 'OK',
                    handler: () => {
                        this.navCtrl.pop();
                    }
                }]        
            });
            upAlert.present();
        }).catch(uErr =>{
            this.loading.dismiss();
            console.log("uErr -> "+JSON.stringify(uErr));
        }); 
    }

    changePassw(){
        this.navCtrl.push(ChangePasswordPage)
    }

    emailBlurFunc(){
        if(this.user.email!=""){
            if(!this.emailRegex.test(this.user.email)){
                this.emailErr = true;
                return;
            }else{
                this.emailErr = false;
            }
        }else{
            this.emailErr = false;
        }
    }

    fNameBlurFunc(){
        if(this.user.fName!=""){
            if(!this.nameRegex.test(this.user.fName)){
                this.fNameErrMsg = "First name accepts character only.";
                this.fNameErr = true;
                return;
            }else if(this.user.fName.length<2){
                this.fNameErrMsg = "Enter at least two characters for your first name.";
                this.fNameErr = true;
                return;
            }else{
                this.fNameErrMsg = "";
                this.fNameErr = false;
            }
        }else{
            this.fNameErrMsg = "";
            this.fNameErr = false;
        }
    }

    lNameBlurFunc(){
        if(this.user.lName!=""){
            if(!this.lastNameRegex.test(this.user.lName)){
                this.lNameErrMsg = "Last name accepts character only.";
                this.lNameErr = true;
                return;
            }else if(this.user.lName.length<2){
                this.lNameErrMsg = "Enter at least two characters for your last name.";
                this.lNameErr = true;
                return;
            }else{
                this.lNameErrMsg = "";
                this.lNameErr = false;
            }
        }else{
            this.lNameErrMsg = "";
            this.lNameErr = false;
        }
    }

    changePlan(){
        this.navCtrl.push(ChangeSubscriptionPage);
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
