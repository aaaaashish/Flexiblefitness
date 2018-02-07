import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GoalsettingsPage } from '../goalsettings/goalsettings';
import { SocialmediaPage } from '../socialmedia/socialmedia';
import { MyaccountPage } from '../myaccount/myaccount';
import { AlertController, LoadingController, ToastController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { App } from 'ionic-angular/components/app/app';
import { ServicesProvider } from '../../providers/services/services';
import { AddPaymentPage } from '../add-payment/add-payment';
import { Facebook } from '@ionic-native/facebook';
import { LocalDbProvider } from '../../providers/local-db/local-db';
import { NutritionUpdatePage } from '../nutrition-update/nutrition-update';
import { SyncProvider } from '../../providers/sync/sync';
import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free';

@IonicPage()
@Component({
    selector: 'page-setting',
    templateUrl: 'setting.html',
})
export class SettingPage {
    admobid:any;
    loading:any;
    checkLoginObj:any;
    syncTimeObj:any;
    syncInd = 0;
    weightObj:any;
    weSyncObj:any;
    bodyfatObj:any;
    bodySyncObj:any;
    picObj:any;
    picSyncObj:any;
    userObj:any;
    nutriObj:any;
    userAPIObj:any;
    actDurObj:any;
    actSyncObj:any;
    userCalObj:any;
    calSyncObj:any;
    logFoodObj:any;
    logFoodSyncObj:any;
    workoutCmpObj:any;
    workoutCmpSyncObj:any;

    constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, public app: App, public globalSer: ServicesProvider, public toastCtrl: ToastController, public loader: LoadingController, public fb: Facebook, public db: LocalDbProvider, public sync: SyncProvider, private admobFree: AdMobFree){
        
    }
    ionViewWillEnter(){
        if (/(android)/i.test(navigator.userAgent)) {
            this.admobid = {
                banner: 'ca-app-pub-3940256099942544/2934735716'
            };
        }
        else if (/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
            this.admobid = {
                banner: 'ca-app-pub-3940256099942544/2934735716'
            };
        }
        this.prepareBanner();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SettingPage');
    }

    goal(){  
        this.app.getRootNav().push(GoalsettingsPage);
    }

    nutrition(){
        this.db.fetchDataFromUsersTbl(localStorage.getItem("userID")).then(uSucc =>{
            this.userObj = uSucc;
            if(this.userObj.isNutritionFlowSaved=="true" || this.userObj.isNutritionFlowSaved==true)
                this.app.getRootNav().push(NutritionUpdatePage);
            else
                this.showErrToast("Firstly submit your nutrition flow, then update it.");
        }).catch(uErr =>{
            console.log("uErr => "+JSON.stringify(uErr));
        });
    }

    social(){
        this.app.getRootNav().push(SocialmediaPage);
    }

    account(){
        this.app.getRootNav().push(MyaccountPage);
    }

    logout() {
        let alert = this.alertCtrl.create({
            title: 'FLEXIBLE FITNESS',
            message: 'Are you sure you want to logout?',
            buttons: [{
                text: 'NO',
                role: 'cancel',
                handler: () => {
                    console.log('Cancel clicked');
                }
            },
            {
                text: 'YES',
                handler: () => {
                    console.log('YES clicked');
                    //this.logoutAPICall();
                    this.syncDataToServer();
                }
            }]
        });
        alert.present();
    }

    syncDataToServer(){
        if(this.globalSer.networkStatus){
            this.presentLoading();
            this.globalSer.getMethod("loginCheck?userID="+localStorage.getItem('userID')+"&deviceID="+this.globalSer.deviceUUID).then(apiSucc =>{
                this.checkLoginObj = apiSucc;
                if(this.checkLoginObj.statusCode=="200"){
                    this.globalSer.getMethod("getSyncTime?userID="+localStorage.getItem("userID")).then(getSyncTSucc =>{
                        console.log("getSyncTSucc -> "+JSON.stringify(getSyncTSucc));
                        this.syncTimeObj = getSyncTSucc;
                        if(this.syncTimeObj.statusCode=="200"){
                            this.recurCallForSync(this.syncTimeObj.data);
                        }else{
                            this.loading.dismiss();
                            let alert = this.alertCtrl.create({
                                title: 'FLEXIBLE FITNESS',            
                                subTitle: this.syncTimeObj.message,
                                buttons: [{
                                    text: 'OK',
                                    handler: () => {
                                    }
                                }]        
                            });
                            alert.present();
                        }
                    }).catch(getSyncTErr =>{
                        this.loading.dismiss();
                        console.log("getSyncTErr -> "+JSON.stringify(getSyncTErr));        
                    });
                }else{
                    this.loading.dismiss();
                    let alert = this.alertCtrl.create({
                        title: 'FLEXIBLE FITNESS',            
                        subTitle: this.checkLoginObj.message,
                        enableBackdropDismiss: false,
                        buttons: [{
                            text: 'OK',
                            handler: () => {
                                let loading = this.loader.create({
                                    spinner: "crescent",
                                    content: 'Please wait...',
                                    cssClass: "ff-loader"
                                });
                                loading.present();
                                this.db.deleteDB().then(delSucc =>{
                                    loading.dismiss();
                                    this.fb.logout();
                                    localStorage.setItem("userID","");
                                    this.globalSer.nutritionQueStatus = false;
                                    this.app.getRootNav().setRoot(LoginPage);
                                }).catch(delErr => {
                                    loading.dismiss();
                                    console.log("delDBERR->"+delErr);
                                });
                            }
                        }]        
                    });
                    alert.present();
                }
            }).catch(apiErr =>{
                this.loading.dismiss();
                console.log("apiErr -> "+JSON.stringify(apiErr));
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

    recurCallForSync(obj){
        if(this.syncInd<8){
            if(this.syncInd==0){
                this.sync.getLatestRecordFromDB(localStorage.getItem("userID"),"WeightListDB",obj.lastWeightSyncTime).then(weSucc =>{
                    this.weightObj = weSucc;
                    if(this.weightObj.length!=0){
                        let data = [];
                        for(var i=0; i<this.weightObj.length; i++){
                            data.push({
                                "weight": parseInt(this.weightObj[i].weight),
	                            "creationTime": this.weightObj[i].creationTime
                            });
                        }
                        this.globalSer.postMethod(data,"weightSync?userID="+localStorage.getItem("userID")).then(wSyncSucc =>{
                            this.weSyncObj = wSyncSucc;
                            console.log("weSyncObj -> "+JSON.stringify(this.weSyncObj));
                            if(this.weSyncObj.statusCode=="200"){
                                this.syncInd++;
                                this.recurCallForSync(obj);
                            }else{
                                this.loading.dismiss();
                                console.log("weight other response -> "+JSON.stringify(this.weSyncObj));
                            }
                        }).catch(wSyncErr =>{
                            this.loading.dismiss();
                            console.log("wSyncErr -> "+JSON.stringify(wSyncErr));
                        });
                    }else{
                        this.syncInd++;
                        this.recurCallForSync(obj);
                    }
                }).catch(weErr =>{
                    this.loading.dismiss();
                    console.log("weErr -> "+JSON.stringify(weErr));
                });
            }else if(this.syncInd==1){
                this.sync.getLatestRecordFromDB(localStorage.getItem("userID"),"BodyfatListDB",obj.lastBodyFatSyncTime).then(bSucc =>{
                    this.bodyfatObj = bSucc;
                    if(this.bodyfatObj.length!=0){
                        let data = [];
                        for(var i=0; i<this.bodyfatObj.length; i++){
                            data.push({
                                "bfPercentage": parseInt(this.bodyfatObj[i].bfPercentage),
	                            "bfPercentageCreationTime": this.bodyfatObj[i].bfPercentageCreationTime
                            });
                        }
                        this.globalSer.postMethod(data,"bodyFatSync?userID="+localStorage.getItem("userID")).then(bSyncSucc =>{
                            this.bodySyncObj = bSyncSucc;
                            if(this.bodySyncObj.statusCode=="200"){
                                this.syncInd++;
                                this.recurCallForSync(obj);
                            }else{
                                this.loading.dismiss();
                                console.log("bodyfat other response -> "+JSON.stringify(this.bodySyncObj));
                            }
                        }).catch(bSyncErr =>{
                            this.loading.dismiss();
                            console.log("bSyncErr -> "+JSON.stringify(bSyncErr));
                        });
                    }else{
                        this.syncInd++;
                        this.recurCallForSync(obj);
                    }
                }).catch(weErr =>{
                    this.loading.dismiss();
                    console.log("weErr -> "+JSON.stringify(weErr));
                });
            }else if(this.syncInd==2){
                this.sync.getLatestRecordFromDB(localStorage.getItem("userID"),"ProgressPicTbl",obj.lastProfileImageSyncTime).then(picSucc =>{
                    this.picObj = picSucc;
                    if(this.picObj.length!=0){
                        let data = [];
                        for(var i=0; i<this.picObj.length; i++){
                            data.push({
                                "picture":this.picObj[i].picture.split(',')[1],
                                "updateTime": this.picObj[i].progressPicUpdateTime
                            });
                            if(i==this.picObj.length-1)
                                this.funCallForProgressPic(data,obj);
                        }
                    }else{
                        this.syncInd++;
                        this.recurCallForSync(obj);
                    }
                }).catch(picErr =>{
                    this.loading.dismiss();
                    console.log("picErr -> "+JSON.stringify(picErr));
                });
            }else if(this.syncInd==3){
                this.db.fetchDataFromUsersTbl(localStorage.getItem("userID")).then(uSucc =>{
                    this.userObj = uSucc;
                    let data = {
                        "userID": localStorage.getItem("userID"),
                        "firstName": this.userObj.firstName,
                        "lastName": this.userObj.lastName,
                        "age": this.userObj.dob,
                        "activityLevelID": this.userObj.activityLevel,
                        "weightGoalID": this.userObj.weightGoal,
                        "progressPaceID": this.userObj.paceOfProgress,
                        "dietID": "",
                        "allergens": "",
                        "mealChangeFrequecyID": "",
                        "mealFrequency": "",
                        "mealDelivery": "",
                        "tooltipStatus": this.userObj.tooltipStatus,
                        "tooltipTime": this.userObj.tooltipTime,
                        "isWorkoutReminder": this.userObj.workoutReminder,
                        "workoutReminderTime": this.userObj.workoutReminderTime,
                    }
                    if(this.userObj.isNutritionFlowSaved=="true" || this.userObj.isNutritionFlowSaved==true){
                        this.db.fetchDataFromNutritionSavedDataTbl(localStorage.getItem("userID")).then(nutriSucc =>{
                            this.nutriObj = nutriSucc;
                            data.dietID = this.nutriObj[0].dietID;
                            data.allergens = this.nutriObj[0].allergicID;
                            data.mealChangeFrequecyID = this.nutriObj[0].switchMealID;
                            data.mealFrequency = this.nutriObj[0].mealTypeID;
                            data.mealDelivery = this.nutriObj[0].mealsDeliverID;
                            this.funCallForUsers(data,obj);
                        }).catch(nutriErr =>{
                            this.loading.dismiss();
                            console.log("nutriErr -> "+JSON.stringify(nutriErr));
                        });
                    }else{
                        data.dietID = null;
                        data.allergens = null;
                        data.mealChangeFrequecyID = null;
                        data.mealFrequency = null;
                        data.mealDelivery = null;
                        this.funCallForUsers(data,obj);
                    }
                }).catch(uErr =>{
                    this.loading.dismiss();
                    console.log("uErr -> "+JSON.stringify(uErr));
                });
            }else if(this.syncInd==4){
                this.sync.getLatestRecordFromDB(localStorage.getItem("userID"),"ActivityPerformDurationTbl",obj.lastActLogSyncTime).then(actSucc =>{
                    this.actDurObj = actSucc;
                    if(this.actDurObj.length!=0){
                        let data = [];
                        for(var i=0; i<this.actDurObj.length; i++){
                            data.push({
                                "userID": localStorage.getItem("userID"),
                                "activityID": this.actDurObj[i].actID,
                                "activityName": this.actDurObj[i].actName,
                                "activityLogTime": this.actDurObj[i].initDate,
                                "duration": parseFloat(this.actDurObj[i].duration)
                            });
                        }
                        this.globalSer.postMethod(data,"activityLogSync").then(actSyncSucc =>{
                            this.actSyncObj = actSyncSucc;
                            if(this.actSyncObj.statusCode=="200"){
                                this.syncInd++;
                                this.recurCallForSync(obj);
                            }else{
                                this.loading.dismiss();
                                console.log("activity log other response -> "+JSON.stringify(this.actSyncObj));
                            }
                        }).catch(actSyncErr =>{
                            this.loading.dismiss();
                            console.log("actSyncErr -> "+JSON.stringify(actSyncErr));
                        });
                    }else{
                        this.syncInd++;
                        this.recurCallForSync(obj);
                    }
                }).catch(actErr =>{
                    this.loading.dismiss();
                    console.log("actErr -> "+JSON.stringify(actErr));
                });
            }else if(this.syncInd==5){
                this.sync.getRecordFromTbl(localStorage.getItem("userID"),"userCaloriesTbl","calorieDate",obj.lastUserCalorieSyncTime).then(calSucc =>{
                    this.userCalObj = calSucc;
                    if(this.userCalObj.length!=0){
                        let data = [];
                        for(var i=0; i<this.userCalObj.length; i++){
                            data.push({
                                "userID": localStorage.getItem("userID"),
                                "dailyCalories": this.userCalObj[i].totalCalorie,
                                "caloriesConsumed": this.userCalObj[i].calorieConsumed,
                                "calorieCalculateDate": this.userCalObj[i].calorieDate
                            });
                            if(i==this.userCalObj.length-1){
                                this.globalSer.postMethod(data,"usersCaloriesDataSync").then(calSyncSucc =>{
                                    this.calSyncObj = calSyncSucc;
                                    if(this.calSyncObj.statusCode=="200"){
                                        this.syncInd++;
                                        this.recurCallForSync(obj);
                                    }else{
                                        this.loading.dismiss();
                                        console.log("user calorie other response -> "+JSON.stringify(this.calSyncObj));
                                    }
                                }).catch(calSyncErr =>{
                                    this.loading.dismiss();
                                    console.log("calSyncErr -> "+JSON.stringify(calSyncErr));
                                });
                            }
                        }
                    }else{
                        this.syncInd++;
                        this.recurCallForSync(obj);
                    }
                }).catch(calErr =>{
                    this.loading.dismiss();
                    console.log("calErr -> "+JSON.stringify(calErr));
                });
            }else if(this.syncInd==6){
                this.sync.getRecordFromTbl(localStorage.getItem("userID"),"LogYourOwnFoodTbl","takenTime",obj.lastUserOwnFeedSyncTime).then(logFoodSucc =>{
                    this.logFoodObj = logFoodSucc;
                    if(this.logFoodObj.length!=0){
                        let data = [];
                        for(var i=0; i<this.logFoodObj.length; i++){
                            data.push({
                                "userID": localStorage.getItem("userID"),
                                "calories": this.logFoodObj[i].foodCal,
                                "userFeedDataTime": this.logFoodObj[i].takenTime,
                                "recipeName": this.logFoodObj[i].foodName,
                                "feedType": this.logFoodObj[i].feedType
                            });
                            if(i==this.logFoodObj.length-1){
                                this.globalSer.postMethod(data,"usersFeedDataSync").then(logFoodSyncSucc =>{
                                    this.logFoodSyncObj = logFoodSyncSucc;
                                    if(this.logFoodSyncObj.statusCode=="200"){
                                        this.syncInd++;
                                        this.recurCallForSync(obj);
                                    }else{
                                        this.loading.dismiss();
                                        console.log("user food log other response -> "+JSON.stringify(this.logFoodSyncObj));
                                    }
                                }).catch(logFoodSyncErr =>{
                                    this.loading.dismiss();
                                    console.log("logFoodSyncErr -> "+JSON.stringify(logFoodSyncErr));
                                });
                            }
                        }
                    }else{
                        this.syncInd++;
                        this.recurCallForSync(obj);
                    }
                }).catch(logFoodErr =>{
                    this.loading.dismiss();
                    console.log("logFoodErr -> "+JSON.stringify(logFoodErr));
                });
            }else if(this.syncInd==7){
                this.sync.getRecordFromTbl(localStorage.getItem("userID"),"offlineCmplteWorkoutTbl","initDate",obj.lastWorkoutSyncTime).then(wCmpSucc =>{
                    this.workoutCmpObj = wCmpSucc;
                    if(this.workoutCmpObj.length!=0){
                        let data = [];
                        for(var i=0; i<this.workoutCmpObj.length; i++){
                            data.push({
                                "userID": localStorage.getItem("userID"),
                                "workoutID": this.workoutCmpObj[i].workoutID,
                                "feedBack": this.workoutCmpObj[i].feedbackVal,
                                "workoutType": this.workoutCmpObj[i].workoutType,
                                "isCompleted": this.workoutCmpObj[i].isCompleted,
                                "exerciseIDCompleted": "",
                                "workoutCompletionTime": this.workoutCmpObj[i].initDate,
                            });
                            if(i==this.workoutCmpObj.length-1){
                                this.globalSer.postMethod(data,"workoutFeedBackSync").then(wSyncSucc =>{
                                    this.workoutCmpSyncObj = wSyncSucc;
                                    if(this.workoutCmpSyncObj.statusCode=="200"){
                                        this.syncInd++;
                                        this.recurCallForSync(obj);
                                    }else{
                                        this.loading.dismiss();
                                        console.log("workout comp other response -> "+JSON.stringify(this.workoutCmpSyncObj));
                                    }
                                }).catch(wSyncErr =>{
                                    this.loading.dismiss();
                                    console.log("workoutCmp sync err -> "+JSON.stringify(wSyncErr));
                                });
                            }
                        }
                    }else{
                        this.syncInd++;
                        this.recurCallForSync(obj);
                    }
                }).catch(wCmpErr =>{
                    this.loading.dismiss();
                    console.log("workoutCompleteErr -> "+JSON.stringify(wCmpErr));
                });
            }
        }else{
            console.log("sync recur done");
            this.syncInd = 0;
            this.logoutAPICall();
        }
    }

    funCallForProgressPic(arr,obj){
        this.globalSer.postMethod(arr,"progressImageSync?userID="+localStorage.getItem("userID")).then(bSyncSucc =>{
            this.picSyncObj = bSyncSucc;
            if(this.picSyncObj.statusCode=="200"){
                this.syncInd++;
                this.recurCallForSync(obj);
            }else{
                this.loading.dismiss();
                console.log("pic other response -> "+JSON.stringify(this.picSyncObj));
            }
        }).catch(bSyncErr =>{
            this.loading.dismiss();
            console.log("bSyncErr -> "+JSON.stringify(bSyncErr));
        });
    }

    funCallForUsers(data,obj){
        let apiData = {
            "userID": data.userID,
            "firstName": data.firstName,
            "lastName": data.lastName,
            "age": data.age,
            "activityLevelID": data.activityLevelID,
            "weightGoalID": data.weightGoalID,
            "progressPaceID": data.progressPaceID,
            "dietID": data.dietID==null?data.dietID:parseInt(data.dietID),
            "allergens": data.allergens,
            "mealChangeFrequecyID": data.mealChangeFrequecyID==null?data.mealChangeFrequecyID:parseInt(data.mealChangeFrequecyID),
            "mealFrequency": data.mealFrequency==null?data.mealFrequency:parseInt(data.mealFrequency),
            "mealDelivery": data.mealDelivery==null?data.mealDelivery:parseInt(data.mealDelivery),
            "tooltipStatus": this.userObj.tooltipStatus,
            "tooltipTime": this.userObj.tooltipTime,
            "isWorkoutReminder": this.userObj.workoutReminder,
            "workoutReminderTime": this.userObj.workoutReminderTime,
        }
        this.globalSer.postMethod(apiData,"userDataSync").then(uApiSucc =>{
            this.userAPIObj = uApiSucc;
            if(this.userAPIObj.statusCode=="200"){
                this.syncInd++;
                this.recurCallForSync(obj);
            }else{
                this.loading.dismiss();
                console.log("pic other response -> "+JSON.stringify(this.userAPIObj));
            }
        }).catch(uApiErr =>{
            this.loading.dismiss();
            console.log("uApiErr -> "+JSON.stringify(uApiErr));
        });
    }

    logoutAPICall(){
        let data = {
            "userID": parseInt(localStorage.getItem('userID')),
            "userDeviceInfo": [{
                "deviceId": this.globalSer.deviceUUID
            }]        
        }
        console.log("logout_data=> "+JSON.stringify(data));
        this.globalSer.postMethod(data,"logout").then(succ=>{
            this.globalSer.serData = succ;
            if(this.globalSer.serData.statusCode=="200"){
                this.db.deleteDB().then(delSucc =>{
                    this.loading.dismiss();
                    this.fb.logout();
                    localStorage.setItem("userID","");
                    this.globalSer.nutritionQueStatus = false;
                    this.app.getRootNav().setRoot(LoginPage);
                }).catch(delErr => {
                    this.loading.dismiss();
                    console.log("delDBERR->"+delErr);
                });
            }else if(this.globalSer.serData.statusCode=="202"){
                this.loading.dismiss();
                let alert = this.alertCtrl.create({
                    title: 'FLEXIBLE FITNESS',            
                    subTitle: this.globalSer.serData.message,
                    enableBackdropDismiss: false,
                    buttons: [{
                        text: 'OK',
                        handler: () => {
                            let loading = this.loader.create({
                                spinner: "crescent",
                                content: 'Please wait...',
                                cssClass: "ff-loader"
                            });
                            loading.present();
                            this.db.deleteDB().then(delSucc =>{
                                loading.dismiss();
                                this.fb.logout();
                                localStorage.setItem("userID","");
                                this.globalSer.nutritionQueStatus = false;
                                this.app.getRootNav().setRoot(LoginPage);
                            }).catch(delErr => {
                                loading.dismiss();
                                console.log("delDBERR->"+delErr);
                            });
                        }
                    }]        
                });
                alert.present();
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
        }).catch(err=>{
            this.loading.dismiss();
            console.log("logout_err=> "+JSON.stringify(err));
        });
    }

    showErrToast(msg){
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

    prepareBanner() {
        const bannerConfig: AdMobFreeBannerConfig = {
            id: this.admobid.banner,
            isTesting: true,
            autoShow: true
        }
        this.admobFree.banner.config(bannerConfig);
        this.admobFree.banner.prepare().then(() => {
            console.log('Banner prepared');
        });
    }
}
