import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { ServicesProvider } from '../../providers/services/services';
import { ReminderHoursPage } from '../reminder-hours/reminder-hours';
import { LocalDbProvider } from '../../providers/local-db/local-db';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';


@IonicPage()
@Component({
    selector: 'page-workout-reminder-screen',
    templateUrl: 'workout-reminder-screen.html',
})
export class WorkoutReminderScreenPage {
    currInd = 0;
    wObj:any;
    bObj:any;
    loading:any;
    pImgAPIObj:any;
    reminderStatus: any = "1";
    reminder: any;
    btnLabel: any = "NEXT";
    apiBfValue: any;
    apiWaist: any;
    apiWrist: any;
    apiHip: any;
    apiForearm: any;
    workoutInd = 0;
    workoutObj:any;
    workoutDetInd = 0;
    tipObj:any;
    freeMealInd = 0;
    
    constructor(public navCtrl: NavController, public navParams: NavParams, public globalSer: ServicesProvider, public toastCtrl: ToastController, public loader: LoadingController, public alertCtrl: AlertController, public db: LocalDbProvider, public transfer: FileTransfer, public file: File) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad WorkoutReminderScreenPage');
    }

    nextFunc(){
        this.reminderStatus=="1"?this.reminder=true:this.reminder=false;
        this.globalSer.userData.workoutReminder = this.reminder;
        if(this.btnLabel=="SUBMIT"){
            //console.log("userData=> "+JSON.stringify(this.globalSer.userData));
            if(this.globalSer.networkStatus){
                if(this.globalSer.userData.staOfBodyFatPer)
                    this.apiBfValue = parseFloat(this.globalSer.userData.valOfBodyFatPer);
                else
                    this.apiBfValue = "";
                if(this.globalSer.userData.gender=="1"){
                    this.apiWaist = this.globalSer.userData.maleWaistVal==""?"":parseInt(this.globalSer.userData.maleWaistVal);
                    this.apiWrist = "";
                    this.apiHip = "";
                    this.apiForearm = "";
                }else if(this.globalSer.userData.gender=="2"){
                    this.apiWaist = this.globalSer.userData.femaleWaistVal==""?"":parseInt(this.globalSer.userData.femaleWaistVal);
                    this.apiWrist = this.globalSer.userData.femaleWristVal==""?"":parseInt(this.globalSer.userData.femaleWristVal);
                    this.apiHip = this.globalSer.userData.femaleHipVal==""?"":parseInt(this.globalSer.userData.femaleHipVal);
                    this.apiForearm = this.globalSer.userData.femaleforearmVal==""?"":parseInt(this.globalSer.userData.femaleforearmVal);
                }
                let data = {
                    "userID": this.globalSer.currUser.userID,
                    "genderID": parseInt(this.globalSer.userData.gender),
                    "unitOfMeasurementID": parseInt(this.globalSer.userData.unitOfMeasure),
                    "heightCM": this.globalSer.userData.tallCMValue==""?"":parseInt(this.globalSer.userData.tallCMValue),
                    "heightFT": this.globalSer.userData.tallFtValue==""?"":parseInt(this.globalSer.userData.tallFtValue),
                    "heightInch": this.globalSer.userData.tallInchValue==""?"":parseInt(this.globalSer.userData.tallInchValue),
                    "firstWeight": parseInt(this.globalSer.userData.weighValue),
                    "isBodyFatPercentageKnown": this.globalSer.userData.staOfBodyFatPer,
                    "bodyFatPercentage": this.apiBfValue,
                    "isWantsSimpleMeasurement": this.globalSer.userData.staOfSimpleMeasurement,
                    "waist": this.apiWaist,
                    "wrist": this.apiWrist,
                    "hip": this.apiHip,
                    "forearm": this.apiForearm,
                    "age": this.globalSer.currUser.dob,
                    "isActivityLevelKnown": this.globalSer.userData.activityStatus,
                    "activityLevelMeasurement": {
                        "workingDaysPerWeek": this.globalSer.userData.daysPerWeekValue==""?"":parseInt(this.globalSer.userData.daysPerWeekValue),
                        "workingHoursPerDay": this.globalSer.userData.hrsPerDayValue==""?"":parseInt(this.globalSer.userData.hrsPerDayValue),
                        "jobCategory": this.globalSer.userData.catOfJobs==""?"EMPTY":this.globalSer.userData.catOfJobs,
                        "exerciseDaysPerWeek": this.globalSer.userData.daysPerWeekActValue==""?"":parseInt(this.globalSer.userData.daysPerWeekActValue),
                        "exerciseHoursPerDay": this.globalSer.userData.hrsPerDayActValue==""?"":parseInt(this.globalSer.userData.hrsPerDayActValue),
                        "exerciseCategory": this.globalSer.userData.catOfTypesOfAct==""?"EMPTY":this.globalSer.userData.catOfTypesOfAct
                    },
                    "activityLevelID": this.globalSer.userData.activityLevel==""?"":parseInt(this.globalSer.userData.activityLevel),
                    "weightGoalID": parseInt(this.globalSer.userData.weightGoalValue),
                    "progressPaceID": parseInt(this.globalSer.userData.achWeightGoalValue),
                    "subscriptionPlanID": parseInt(this.globalSer.userData.subscriptionPlanID),
                    "isWorkoutReminder": this.globalSer.userData.workoutReminder,
                    "workoutReminderTime": this.globalSer.userData.remHrsValue
                }
                console.log("sub-data=> "+JSON.stringify(data));

                this.presentLoading();
                this.globalSer.postMethod(data,"subscriptionFlowUser").then(succ=>{
                    console.log("sub_succ*********=> ");
                    this.globalSer.serData = succ;
                    if(this.globalSer.serData.statusCode=="200"){
                        this.globalSer.userData.gender = "";
                        this.globalSer.userData.unitOfMeasure = "";
                        this.globalSer.userData.tallCMValue = "";
                        this.globalSer.userData.tallFtValue = "";
                        this.globalSer.userData.tallInchValue = "";
                        this.globalSer.userData.weighValue = "";
                        this.globalSer.userData.staOfBodyFatPer = "";
                        this.globalSer.userData.valOfBodyFatPer = "";
                        this.globalSer.userData.staOfSimpleMeasurement = "";
                        this.globalSer.userData.femaleWristVal = "";
                        this.globalSer.userData.femaleHipVal = "";
                        this.globalSer.userData.femaleforearmVal = "";
                        this.globalSer.userData.activityStatus = "";
                        this.globalSer.userData.daysPerWeekValue = "";
                        this.globalSer.userData.hrsPerDayValue = "";
                        this.globalSer.userData.catOfJobs = "";
                        this.globalSer.userData.daysPerWeekActValue = "";
                        this.globalSer.userData.hrsPerDayActValue = "";
                        this.globalSer.userData.catOfTypesOfAct = "";
                        this.globalSer.userData.activityLevel = "";
                        this.globalSer.userData.weightGoalValue = "";
                        this.globalSer.userData.achWeightGoalValue = "";
                        this.globalSer.userData.subscriptionPlan = "";
                        this.globalSer.userData.subscriptionPlanID = "";
                        this.globalSer.userData.workoutReminder = "";
                        this.globalSer.userData.remHrsValue = "";
                        this.db.insIntoUsersTbl(this.globalSer.serData.data).then(insSucc =>{                       
                            this.callFuncToStoreImg(this.globalSer.serData.data.progressPicArr,this.globalSer.serData.data.progressPicArr.length);
                        }).catch(insErr =>{
                            this.loading.dismiss();
                            console.log("insErr -> "+JSON.stringify(insErr));
                            this.db.deleteDB();
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
                }).catch(err=>{
                    this.loading.dismiss();
                    console.log("sub_err=> "+JSON.stringify(err));
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
        }else
            this.navCtrl.push(ReminderHoursPage);
    }

    backBtnFunc(){
        this.globalSer.userData.workoutReminder = "";
        this.navCtrl.pop();
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
        if(this.workoutDetInd<13){
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

    radioChecked(type){
        if(type=="YES")
            this.btnLabel="NEXT";
        else
            this.btnLabel="SUBMIT";
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
