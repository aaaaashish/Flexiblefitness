import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { TabsPage } from '../tabs/tabs';
import { ServicesProvider } from '../../providers/services/services';
import { WelcomePage } from '../welcome/welcome';
import { Facebook } from '@ionic-native/facebook';
import { LocalDbProvider } from '../../providers/local-db/local-db';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {
    currInd = 0;
    workoutInd = 0;
    workoutDetInd = 0;
    loading:any;
    remChecked: any = false;
    login = {
        email:"",
        password:""
    };
    loginForm: FormGroup;
    pImgAPIObj: any;
    wObj:any;
    bObj:any;
    workoutObj:any;
    fbOtherDeviceLogin:any;
    tipObj:any;
    freeMealInd = 0;
    recipeInd = 0;

    constructor(public navCtrl: NavController, public navParams: NavParams, public globalSer: ServicesProvider, public loader: LoadingController, public toastCtrl: ToastController, public alertCtrl: AlertController, public fb: Facebook, public db: LocalDbProvider, public transfer: FileTransfer, public file: File) {
        if(localStorage.getItem('remCheck')=='true'){
            this.login.email = localStorage.getItem('email');
            this.login.password = localStorage.getItem('pass');
            this.remChecked = true;
        }else{
            this.login.email = "";
            this.login.password = "";
            this.remChecked = false;
        }
    }

    ngOnInit(){
        this.loginForm = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.pattern(/^[A-Z0-9_]+([\.][A-Z0-9_]+)*@[A-Z0-9-]+(\.[a-zA-Z]{2,4})+$/i)]),
            password: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,16})/)])
        })
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad LoginPage');
    }

    signup(){
        this.navCtrl.push(SignupPage);
    }

    loginFunc(){
        //this.navCtrl.setRoot(TabsPage);
        if(this.globalSer.networkStatus){
            let data = {
                "emailAddress": this.login.email,
                "password": this.login.password,
                "wantLoginInAnotherDevice": false,
                "userDeviceInfo": [{
                    "deviceType": this.globalSer.devicePlatform,
                    "deviceId": this.globalSer.deviceUUID,
                    "deviceKey":"",
                    "deviceToken": this.globalSer.deviceUUID
                }]        
            }
            console.log("data=> "+JSON.stringify(data));
            this.presentLoading();
            this.globalSer.postMethod(data,"login").then(succ=>{
                console.log("login_succ=> ");
                if(this.remChecked==true){
                    localStorage.setItem('remCheck','true');
                    localStorage.setItem('email',this.login.email);
                    localStorage.setItem('pass',this.login.password);
                }else{
                    localStorage.setItem('remCheck','false');
                }
                this.globalSer.serData = succ;
                if(this.globalSer.serData.statusCode=="200"){
                    this.globalSer.currUser = this.globalSer.serData.data;
                    if(this.globalSer.serData.data.isSubscriptionFlowSaved==false){
                        this.loading.dismiss();
                        this.subscriptionPending();
                    }else if(this.globalSer.serData.data.isSubscriptionFlowSaved==true){
                        this.funcCallAfterLoginSucc();                        
                    }else{
                        this.loading.dismiss();
                        console.log('isSubscriptionFlowSaved -> '+this.globalSer.serData.data.isSubscriptionFlowSaved);
                    }
                }else if(this.globalSer.serData.statusCode=="202"){
                    this.loading.dismiss();
                    let alreadyLog = this.alertCtrl.create({
                        title: 'FLEXIBLE FITNESS',
                        message: this.globalSer.serData.message,
                        enableBackdropDismiss: false,
                        buttons: [{
                            text: 'NO',
                            role: 'cancel',
                            handler: () => {
                                console.log('Cancel clicked');
                            }
                        },{
                            text: 'YES',
                            handler: () => {
                                console.log('YES clicked');
                                this.callAgainLogin();
                            }
                        }]
                    });
                    alreadyLog.present();
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
                console.log("login_err=> "+JSON.stringify(err));
            });
        }else
            this.showErrToast();
    }

    callAgainLogin(){
        console.log("callAgainLogin_called");
        let data = {
            "emailAddress": this.login.email,
            "password": this.login.password,
            "wantLoginInAnotherDevice": true,
            "userDeviceInfo": [{
                "deviceType": this.globalSer.devicePlatform,
                "deviceId": this.globalSer.deviceUUID,
                "deviceKey":"",
                "deviceToken": this.globalSer.deviceUUID
            }]        
        }
        console.log("data=> "+JSON.stringify(data));
        this.presentLoading();
        this.globalSer.postMethod(data,"login").then(succ=>{
            console.log("login_succ=> ");
            this.globalSer.serData = succ;
            if(this.globalSer.serData.statusCode=="200"){
                this.globalSer.currUser = this.globalSer.serData.data;
                if(this.globalSer.serData.data.isSubscriptionFlowSaved==false){
                    this.loading.dismiss();
                    this.subscriptionPending();
                }else{
                    this.funcCallAfterLoginSucc();                        
                }
            }else if(this.globalSer.serData.statusCode=="202"){
                this.loading.dismiss();
                let alreadyLog = this.alertCtrl.create({
                    title: 'FLEXIBLE FITNESS',
                    message: this.globalSer.serData.message,
                    enableBackdropDismiss: false,
                    buttons: [{
                        text: 'NO',
                        role: 'cancel',
                        handler: () => {
                            console.log('Cancel clicked');
                        }
                    },{
                        text: 'YES',
                        handler: () => {
                            console.log('YES clicked');
                            this.callAgainLogin();
                        }
                    }]
                });
                alreadyLog.present();
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
            console.log("login_err=> "+JSON.stringify(err));
        });
    }

    funcCallAfterLoginSucc(){
        console.log("funcCallAfterLoginSucc_called -> ");
        this.db.insIntoUsersTbl(this.globalSer.serData.data).then(succ =>{
            this.callFuncToStoreImg(this.globalSer.serData.data.progressPicArr,this.globalSer.serData.data.progressPicArr.length);
        }).catch(err =>{
            this.loading.dismiss();
            console.log("ins err => "+JSON.stringify(err));
            this.db.deleteDB();
        });
    }

    callFuncToStoreImg(arr,total){
        if(this.currInd<total){
            console.log("recursion called");
            this.getBase64ImageFromURL(arr[this.currInd].picture).subscribe(base64data => {
                let bsData = 'data:image/jpg;base64,'+base64data;
                this.db.insDataIntoProgressPicTbl(this.globalSer.serData.data.userID,bsData,arr[this.currInd].updateTime).then(imgSucc =>{
                    this.currInd++;
                    this.callFuncToStoreImg(arr,total);
                }).catch(imgErr => {
                    this.loading.dismiss();
                    console.log("imgErr => "+JSON.stringify(imgErr));
                    this.db.deleteDB();
                });
            });
        }else{
            console.log("recursion complete");
            this.currInd = 0;
            this.db.insIntoWeightListDB(this.globalSer.serData.data.userID,this.globalSer.serData.data.weightListArr).then(wInsSucc =>{
                this.db.insIntoBodyfatListDB(this.globalSer.serData.data.userID,this.globalSer.serData.data.bodyfatListArr).then(bInsSucc =>{
                    //this.fetchWorkoutListFromAPI();
                    this.recursionFuncCallForWorkoutList(this.globalSer.serData.data.mainWorkoutListArr,this.globalSer.serData.data.mainWorkoutListArr.length);
                }).catch(bInsErr =>{
                    this.loading.dismiss();
                    console.log("bInsErr=> "+JSON.stringify(bInsErr));
                    this.db.deleteDB();
                });
            }).catch(wInsErr =>{
                this.loading.dismiss();
                console.log("wInsErr=> "+JSON.stringify(wInsErr));
                this.db.deleteDB();
            });
        }
    }

    subscriptionPending(){
        let alert = this.alertCtrl.create({
            title: 'FLEXIBLE FITNESS',
            message: 'Your subscription is still pending. Would you like to complete it?',
            buttons: [{
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                    console.log('Cancel clicked');
                }
            },{
                text: 'OK',
                handler: () => {
                    this.navCtrl.push(WelcomePage);
                }
            }]
        });
        alert.present();
    }

    recursionFuncCallForWorkoutList(arr,total){
        if(this.workoutInd<total){
            console.log("recursion called for workout");
            let picture="";
            parseInt(this.globalSer.serData.data.genderID)==1?picture=arr[this.workoutInd].mainImage_Male:picture=arr[this.workoutInd].mainImage_Female;
            this.getBase64ImageFromURL(picture).subscribe(base64data => {
                let bsData = 'data:image/jpg;base64,'+base64data;
                this.db.insListIntoMainWorkoutList(this.globalSer.serData.data.userID,arr[this.workoutInd].workoutName,bsData).then(workInSucc =>{
                    this.workoutInd++;
                    this.recursionFuncCallForWorkoutList(arr,total);
                }).catch(workInErr =>{
                    this.loading.dismiss();
                    console.log("workInErr => "+JSON.stringify(workInErr));
                    this.db.deleteDB();
                });
            });
        }else{
            this.workoutInd = 0;
            console.log("recursion done for workout");
            this.insWorkoutDetails();
        }
    }

    insWorkoutDetails(){
        console.log("recursion call for workout details");
        if(this.workoutDetInd<14){
            if(this.workoutDetInd==0){
                let picture = "";
                parseInt(this.globalSer.serData.data.genderID)==1?picture=this.globalSer.serData.data.cardioWorkoutList[0].mainImage_Male:picture=this.globalSer.serData.data.cardioWorkoutList[0].mainImage_Female;
                this.getBase64ImageFromURL(picture).subscribe(base64data => {
                    let bsData = 'data:image/jpg;base64,'+base64data;
                    let data = {
                        userID: this.globalSer.serData.data.userID,
                        type: "CARDIO",
                        name: "CARDIO WORKOUT",
                        img: bsData,
                        desc: this.globalSer.serData.data.cardioWorkoutList[0].description,
                        rule: this.globalSer.serData.data.cardioWorkoutList[0].rules
                    }
                    this.db.insIntoWorkoutDetailsTbl(data).then(succ =>{
                        console.log("CARDIO_det_ins");
                        this.workoutDetInd++;
                        this.insWorkoutDetails();
                    }).catch(err =>{
                        this.loading.dismiss();
                        console.log("ins err for cardio");
                        this.db.deleteDB();
                    });
                });
            }else if(this.workoutDetInd==1){
                let picture = "";
                parseInt(this.globalSer.serData.data.genderID)==1?picture=this.globalSer.serData.data.gymWorkoutList[0].mainImage_Male:picture=this.globalSer.serData.data.gymWorkoutList[0].mainImage_Female;
                this.getBase64ImageFromURL(picture).subscribe(base64data => {
                    let bsData = 'data:image/jpg;base64,'+base64data;
                    let data = {
                        userID: this.globalSer.serData.data.userID,
                        type: "GYM",
                        name: "RESISTANCE WORKOUT – GYM",
                        img: bsData,
                        desc: this.globalSer.serData.data.gymWorkoutList[0].description,
                        rule: this.globalSer.serData.data.gymWorkoutList[0].rules
                    }
                    this.db.insIntoWorkoutDetailsTbl(data).then(succ =>{
                        console.log("GYM_det_ins");
                        this.workoutDetInd++;
                        this.insWorkoutDetails();
                    }).catch(err =>{
                        this.loading.dismiss();
                        console.log("ins err for GYM");
                        this.db.deleteDB();
                    });
                });
            }else if(this.workoutDetInd==2){
                let picture = "";
                parseInt(this.globalSer.serData.data.genderID)==1?picture=this.globalSer.serData.data.otgWorkoutList[0].mainImage_Male:picture=this.globalSer.serData.data.otgWorkoutList[0].mainImage_Female;
                this.getBase64ImageFromURL(picture).subscribe(base64data => {
                    let bsData = 'data:image/jpg;base64,'+base64data;
                    let data = {
                        userID: this.globalSer.serData.data.userID,
                        type: "OTG",
                        name: "RESISTANCE WORKOUT – ON THE GO",
                        img: bsData,
                        desc: this.globalSer.serData.data.otgWorkoutList[0].description,
                        rule: this.globalSer.serData.data.otgWorkoutList[0].rules
                    }
                    this.db.insIntoWorkoutDetailsTbl(data).then(succ =>{
                        console.log("OTG_det_ins");
                        this.workoutDetInd++;
                        this.insWorkoutDetails();
                    }).catch(err =>{
                        this.loading.dismiss();
                        console.log("ins err for OTG");
                        this.db.deleteDB();
                    });
                });
            }else if(this.workoutDetInd==3){
                let picture = "";
                parseInt(this.globalSer.serData.data.genderID)==1?picture=this.globalSer.serData.data.selfDefenceWorkoutList[0].mainImage_Male:picture=this.globalSer.serData.data.selfDefenceWorkoutList[0].mainImage_Female;
                this.getBase64ImageFromURL(picture).subscribe(base64data => {
                    let bsData = 'data:image/jpg;base64,'+base64data;
                    let data = {
                        userID: this.globalSer.serData.data.userID,
                        type: "SELF",
                        name: "SELF-DEFENSE WORKOUT",
                        img: bsData,
                        desc: this.globalSer.serData.data.selfDefenceWorkoutList[0].description,
                        rule: this.globalSer.serData.data.selfDefenceWorkoutList[0].rules
                    }
                    this.db.insIntoWorkoutDetailsTbl(data).then(succ =>{
                        console.log("SELF_det_ins");
                        this.workoutDetInd++;
                        this.insWorkoutDetails();
                    }).catch(err =>{
                        this.loading.dismiss();
                        console.log("ins err for SELF");
                        this.db.deleteDB();
                    });
                });
            }else if(this.workoutDetInd==4){
                this.db.insIntoAnotherActivityListTbl(this.globalSer.serData.data.userID,this.globalSer.serData.data.otherActivityListArr).then(actSucc =>{
                    console.log("another_det_ins");
                    this.workoutDetInd++;
                    this.insWorkoutDetails();
                }).catch(actErr =>{
                    this.loading.dismiss();
                    console.log("actErr -> "+JSON.stringify(actErr));
                    this.db.deleteDB();
                });
            }else if(this.workoutDetInd==5){
                this.globalSer.getMethod("tipForTheDay").then(tipSucc =>{
                    this.tipObj = tipSucc;
                    if(this.tipObj.statusCode=="200"){
                        let data = {
                            tipID: this.tipObj.data.dailyTipID,
                            tipDesc: this.tipObj.data.dailyTip
                        }
                        this.db.insIntoDailyTipTbl(data).then(tipInsSucc =>{
                            console.log("daily_tip_ins");
                            this.workoutDetInd++;
                            this.insWorkoutDetails();
                        }).catch(tipInsErr =>{
                            this.loading.dismiss();
                            console.log("tipInsErr -> "+JSON.stringify(tipInsErr));
                            this.db.deleteDB();
                        });
                    }else{
                        this.loading.dismiss();
                        console.log("tipErr code -> "+JSON.stringify(this.tipObj));
                        this.db.deleteDB();
                    }
                }).catch(tipErr =>{
                    this.loading.dismiss();
                    console.log("tipErr -> "+JSON.stringify(tipErr));
                    this.db.deleteDB();
                });
            }else if(this.workoutDetInd==6){
                this.db.insIntoAllerganceListTbl(this.globalSer.serData.data.allerganceListArr).then(allSucc =>{
                    console.log("allergence_ins");
                    this.workoutDetInd++;
                    this.insWorkoutDetails();
                }).catch(allErr =>{
                    this.loading.dismiss();
                    console.log("allErr -> "+JSON.stringify(allErr));
                    this.db.deleteDB();
                });
            }else if(this.workoutDetInd==7){
                if(this.globalSer.serData.data.isNutritionFlowSaved=="false" || this.globalSer.serData.data.isNutritionFlowSaved==false){
                    this.workoutDetInd++;
                    this.insWorkoutDetails();
                }else if(this.globalSer.serData.data.isNutritionFlowSaved=="true" || this.globalSer.serData.data.isNutritionFlowSaved==true){
                    let data = {
                        userID: this.globalSer.serData.data.userID,
                        kindOfDiat: this.globalSer.serData.data.nutritionFlow.dietID.toString(),
                        allergance: this.globalSer.serData.data.nutritionFlow.allergens.toString(),
                        howManyMeal: this.globalSer.serData.data.nutritionFlow.mealFrequency.toString(),
                        switchMeals: this.globalSer.serData.data.nutritionFlow.mealChangeFrequecyID.toString(),
                        mealDeliverStatus: this.globalSer.serData.data.nutritionFlow.mealDelivery.toString()
                    }
                    this.db.insIntoNutritionSavedDataTbl(data).then(nutriInsSucc =>{
                        console.log("nutri_save_ins");
                        this.workoutDetInd++;
                        this.insWorkoutDetails();
                    }).catch(nutriInsErr =>{
                        this.loading.dismiss();
                        console.log("nutriInsErr -> "+JSON.stringify(nutriInsErr));
                        this.db.deleteDB();
                    });
                }else{
                    console.log("isNutritionFlowSaved -> "+this.globalSer.serData.data.isNutritionFlowSaved);
                    this.workoutDetInd++;
                    this.insWorkoutDetails();
                }
            }else if(this.workoutDetInd==8){
                this.db.insIntoActivityPerformDurationTbl(this.globalSer.serData.data.userID,this.globalSer.serData.data.activityLogList).then(actSucc =>{
                    console.log("activity log in succ");
                    this.workoutDetInd++;
                    this.insWorkoutDetails();
                }).catch(actErr =>{
                    this.loading.dismiss();
                    console.log("ins err for activity log list");
                    this.db.deleteDB();
                });
            }else if(this.workoutDetInd==9){
                this.insDataIntoFreeUserMealList(this.globalSer.serData.data.freeUserMealList,this.globalSer.serData.data.freeUserMealList.length);
            }else if(this.workoutDetInd==10){
                let calArr = this.globalSer.serData.data.userCaloriesListArr;
                if(calArr.length!=0){
                    let arr = [];
                    for(var i=0; i<calArr.length; i++){
                        arr.push({
                            totalCal: calArr[i].dailyCalories,
                            calConsumed: calArr[i].caloriesConsumed,
                            calDate: calArr[i].calorieCalculateDate
                        });
                        if(i==calArr.length-1){
                            this.db.insIntoUserCaloriesTbl(this.globalSer.serData.data.userID,arr).then(insCalSucc =>{
                                console.log("user calorie ins succ");
                                this.workoutDetInd++;
                                this.insWorkoutDetails();
                            }).catch(insCalErr =>{
                                this.loading.dismiss();
                                console.log('insCalErr => '+JSON.stringify(insCalErr));
                                this.db.deleteDB();
                            });
                        }
                    }
                }else{
                    this.workoutDetInd++;
                    this.insWorkoutDetails();
                }
            }else if(this.workoutDetInd==11){
                let preFoodArr = this.globalSer.serData.data.userPreFoodListArr;
                if(preFoodArr.length!=0){
                    let arr = [];
                    for(var i=0; i<preFoodArr.length; i++){
                        arr.push({
                            foodName: preFoodArr[i].recipeName,
                            foodCal: preFoodArr[i].calories,
                            takenTime: preFoodArr[i].userFeedDataTime
                        });
                        if(i==preFoodArr.length-1){
                            this.db.insIntoPreviousFoodTbl(this.globalSer.serData.data.userID,arr).then(insCalSucc =>{
                                console.log("pre food ins succ");
                                this.workoutDetInd++;
                                this.insWorkoutDetails();
                            }).catch(insCalErr =>{
                                this.loading.dismiss();
                                console.log('insCalErr => '+JSON.stringify(insCalErr));
                                this.db.deleteDB();
                            });
                        }
                    }
                }else{
                    this.workoutDetInd++;
                    this.insWorkoutDetails();
                }
            }else if(this.workoutDetInd==12){
                let foodLogArr = this.globalSer.serData.data.userFoodLogListArr;
                if(foodLogArr.length!=0){
                    let arr = [];
                    for(var i=0; i<foodLogArr.length; i++){
                        arr.push({
                            foodName: foodLogArr[i].recipeName,
                            foodCal: foodLogArr[i].calories,
                            takenTime: foodLogArr[i].userFeedDataTime,
                            feedType: foodLogArr[i].feedType
                        });
                        if(i==foodLogArr.length-1){
                            this.db.insIntoLogYourOwnFoodTbl(this.globalSer.serData.data.userID,arr).then(insCalSucc =>{
                                console.log("food log ins succ");
                                this.workoutDetInd++;
                                this.insWorkoutDetails();
                            }).catch(insCalErr =>{
                                this.loading.dismiss();
                                console.log('insCalErr => '+JSON.stringify(insCalErr));
                                this.db.deleteDB();
                            });
                        }
                    }
                }else{
                    this.workoutDetInd++;
                    this.insWorkoutDetails();
                }
            }else if(this.workoutDetInd==13){
                // Only on the time of login
                let mealArr = this.globalSer.serData.data.todaysMealList;
                if(mealArr.length!=0){
                    this.insDataIntoTodaysMeal(mealArr,mealArr.length);
                }else{
                    this.workoutDetInd++;
                    this.insWorkoutDetails();
                }
            }
        }else{
            this.workoutDetInd = 0;
            console.log("recursion done for workout details");
            this.loading.dismiss();
            localStorage.setItem("userID",this.globalSer.serData.data.userID);
            this.navCtrl.setRoot(TabsPage);
        }
    }

    insDataIntoFreeUserMealList(arr,total){
        if(this.freeMealInd<total){
            this.getBase64ImageFromURL(arr[this.freeMealInd].foodImage).subscribe(base64data => {
                let bsData = 'data:image/jpg;base64,'+base64data;
                let data = {
                    cat: arr[this.freeMealInd].recipeCategory,
                    catName: arr[this.freeMealInd].recipeName,
                    img: bsData
                }
                this.db.insIntoMealListForFreeUser(data).then(mInsSucc =>{
                    this.freeMealInd++;
                    this.insDataIntoFreeUserMealList(arr,total);
                }).catch(mInsErr =>{
                    this.loading.dismiss();
                    console.log("mInsErr => "+JSON.stringify(mInsErr));
                    this.db.deleteDB();
                });
            });
        }else{
            this.freeMealInd = 0;
            this.workoutDetInd++;
            console.log("recursion done for free user list");
            this.insWorkoutDetails();
        }
    }

    insDataIntoTodaysMeal(recipeArr,total){
        if(this.recipeInd<total){
            this.getBase64ImageFromURL(recipeArr[this.recipeInd].foodImage).subscribe(base64data => {
                let bsData = 'data:image/jpg;base64,'+base64data;
                let recipeObj = {
                    userID: this.globalSer.serData.data.userID,
                    recipeID: recipeArr[this.recipeInd].recipeID,
                    recipeName: recipeArr[this.recipeInd].recipeName,
                    recipeCategory: recipeArr[this.recipeInd].recipeCategory,
                    mealLabel: recipeArr[this.recipeInd].mealLabel,
                    calories: recipeArr[this.recipeInd].calories,
                    foodImage: bsData,
                    instructions: recipeArr[this.recipeInd].instructions
                }
                this.db.insIntoUserTodaysMealTbl(recipeObj).then(mealSucc =>{
                    this.db.insIntoRecipeIngredientTbl(recipeArr[this.recipeInd].recipeID,recipeArr[this.recipeInd].ingredientsList).then(increInsSucc =>{
                        this.recipeInd++;
                        this.insDataIntoTodaysMeal(recipeArr,total);
                    }).catch(increInsErr =>{
                        this.loading.dismiss();
                        console.log("increInsErr => "+JSON.stringify(increInsErr));
                        this.db.deleteDB();
                    });
                }).catch(mealErr => {
                    this.loading.dismiss();
                    console.log("imgErr => "+JSON.stringify(mealErr));
                    this.db.deleteDB();
                });
            });
        }else{
            console.log("recur done for todays meal");
            this.workoutDetInd++;
            this.insWorkoutDetails();
        }
    }

    fbLoginFunc(){
        if(this.globalSer.networkStatus){
            this.fb.getLoginStatus().then(succ=>{
                if(succ.status=="unknown"){
                    this.fb.login(["email"]).then(lSucc=>{
                        this.fb.api("/me?fields=picture,first_name,birthday,email,last_name,gender,location", ["public_profile"]).then(apiSucc=>{
                            this.fbOtherDeviceLogin = false;
                            this.callSocialLoginApi(apiSucc);
                        }).catch(apiErr=>{
                            console.log("api_err=> "+JSON.stringify(apiErr));
                        });
                    }).catch(lErr=>{
                        console.log("login_err=> "+JSON.stringify(lErr));
                    });
                }else{
                    this.fb.api("/me?fields=picture,first_name,birthday,email,last_name,gender,location", ["public_profile"]).then(apiSucc=>{
                        this.fbOtherDeviceLogin = false;
                        this.callSocialLoginApi(apiSucc);
                    }).catch(apiErr=>{
                        console.log("api_err=> "+JSON.stringify(apiErr));
                    });
                }
            }).catch(err=>{
                console.log("loginStatus_err=> "+JSON.stringify(err));
            });
        }else
            this.showErrToast();
    }

    callSocialLoginApi(obj){
        let data = {
            "socialId": obj.id,
            "emailAddress": obj.email,
            "firstName": obj.first_name,
            "lastName": obj.last_name,
            "country": "",
            "wantLoginInAnotherDevice": this.fbOtherDeviceLogin,
            "userDeviceInfo": [{
                "deviceType": this.globalSer.devicePlatform,
                "deviceId": this.globalSer.deviceUUID,
                "deviceKey":"",
                "deviceToken": this.globalSer.deviceUUID
            }]        
        }
        console.log("data=> "+JSON.stringify(data));
        this.presentLoading();
        this.globalSer.postMethod(data,"socialSignUp").then(succ=>{            
            console.log("login_succ=> ");
            this.globalSer.serData = succ;
            if(this.globalSer.serData.statusCode=="200"){
                this.globalSer.currUser = this.globalSer.serData.data;
                if(this.globalSer.serData.data.isSubscriptionFlowSaved==false){
                    this.loading.dismiss();
                    this.navCtrl.push(WelcomePage);
                }else if(this.globalSer.serData.data.isSubscriptionFlowSaved==true){
                    this.funcCallAfterLoginSucc();
                }else{
                    this.loading.dismiss();
                    console.log('isSubscriptionFlowSaved ->' + this.globalSer.serData.data.isSubscriptionFlowSaved);
                }
            }else if(this.globalSer.serData.statusCode=="202"){
                this.loading.dismiss();
                let alreadyLog = this.alertCtrl.create({
                    title: 'FLEXIBLE FITNESS',
                    message: this.globalSer.serData.message,
                    enableBackdropDismiss: false,
                    buttons: [{
                        text: 'NO',
                        role: 'cancel',
                        handler: () => {
                            console.log('Cancel clicked');
                        }
                    },{
                        text: 'YES',
                        handler: () => {
                            console.log('YES clicked');
                            this.fbOtherDeviceLogin = true;
                            this.callSocialLoginApi(obj);
                        }
                    }]
                });
                alreadyLog.present();
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
            console.log("login_err=> "+JSON.stringify(err));
        });
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

    getBase64ImageFromURL(url: string) {
        return Observable.create((observer: Observer<string>) => {
            let img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = url;
            if (!img.complete) {
                img.onload = () => {
                    observer.next(this.getBase64Image(img));
                    observer.complete();
                };
                img.onerror = (err) => {
                    observer.error(err);
                };
            } else {
                observer.next(this.getBase64Image(img));
                observer.complete();
            }
        }); 
    }
    
    getBase64Image(img: HTMLImageElement) {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    }
    
}
