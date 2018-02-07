import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { LoadingController, ToastController } from 'ionic-angular';
import { ServicesProvider } from '../services/services';
import { LocalDbProvider } from '../local-db/local-db';

@Injectable()
export class SyncProvider {
    localDB:any;
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
    apiCalObj:any;
    userCalObj:any;
    calSyncObj:any;
    logFoodObj:any;
    logFoodSyncObj:any;
    workoutCmpObj:any;
    workoutCmpSyncObj:any;

    constructor(public http: HttpClient, public loader: LoadingController, public globalSer: ServicesProvider, public db: LocalDbProvider, public toastCtrl: ToastController) {
        console.log('Hello SyncProvider Provider');
        this.localDB = new SQLite();
    }

    getLatestRecordFromDB(userID,tbl,cond){
        return new Promise((resolve,reject)=>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) =>{
                db.transaction(function(tx){
                    let dataArr = [];
                    let query = "select * from "+tbl+" where userID=? AND initDate>?";
                    //console.log("query -> "+query);
                    tx.executeSql(query, [parseInt(userID),cond], function(tx, rs){
                        if(rs.rows.length!=0){
                            for(var i=0; i<rs.rows.length; i++){
                                dataArr.push(rs.rows.item(i));
                                if(i==rs.rows.length-1)
                                    return resolve(dataArr);
                            }
                        }else
                            return resolve(dataArr);
                    },function(tx, error){
                        console.log('sync fetch error: ' + error.message);
                        reject(error);
                    });
                });
            }).catch(e =>{
                console.log("open_err-> "+JSON.stringify(e));
            });
        });
    }

    getRecordFromTbl(userID,tbl,clmn,cond){
        return new Promise((resolve,reject)=>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) =>{
                db.transaction(function(tx){
                    let dataArr = [];
                    let query = "select * from "+tbl+" where userID=? AND "+clmn+">?";
                    //console.log("query -> "+query);
                    tx.executeSql(query, [parseInt(userID),cond], function(tx, rs){
                        if(rs.rows.length!=0){
                            for(var i=0; i<rs.rows.length; i++){
                                dataArr.push(rs.rows.item(i));
                                if(i==rs.rows.length-1)
                                    return resolve(dataArr);
                            }
                        }else
                            return resolve(dataArr);
                    },function(tx, error){
                        console.log('sync fetch error: ' + error.message);
                        reject(error);
                    });
                });
            }).catch(e =>{
                console.log("open_err-> "+JSON.stringify(e));
            });
        });
    }

    syncDataToServer(){
        console.log("sync page call");
        this.showErrToast("Sync is in progress.");
        this.globalSer.getMethod("getSyncTime?userID="+localStorage.getItem("userID")).then(getSyncTSucc =>{
            console.log("getSyncTSucc -> "+JSON.stringify(getSyncTSucc));
            this.syncTimeObj = getSyncTSucc;
            if(this.syncTimeObj.statusCode=="200"){
                this.recurCallForSync(this.syncTimeObj.data);
            }else{
                console.log("getSync time other resp -> "+JSON.stringify(this.syncTimeObj));
            }
        }).catch(getSyncTErr =>{
            console.log("getSyncTErr -> "+JSON.stringify(getSyncTErr));        
        });
    }

    recurCallForSync(obj){
        if(this.syncInd<8){
            if(this.syncInd==0){
                this.getLatestRecordFromDB(localStorage.getItem("userID"),"WeightListDB",obj.lastWeightSyncTime).then(weSucc =>{
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
                                console.log("weight other response -> "+JSON.stringify(this.weSyncObj));
                            }
                        }).catch(wSyncErr =>{
                            console.log("wSyncErr -> "+JSON.stringify(wSyncErr));
                        });
                    }else{
                        this.syncInd++;
                        this.recurCallForSync(obj);
                    }
                }).catch(weErr =>{
                    console.log("weErr -> "+JSON.stringify(weErr));
                });
            }else if(this.syncInd==1){
                this.getLatestRecordFromDB(localStorage.getItem("userID"),"BodyfatListDB",obj.lastBodyFatSyncTime).then(bSucc =>{
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
                                console.log("bodyfat other response -> "+JSON.stringify(this.bodySyncObj));
                            }
                        }).catch(bSyncErr =>{
                            console.log("bSyncErr -> "+JSON.stringify(bSyncErr));
                        });
                    }else{
                        this.syncInd++;
                        this.recurCallForSync(obj);
                    }
                }).catch(bErr =>{
                    console.log("bErr -> "+JSON.stringify(bErr));
                });
            }else if(this.syncInd==2){
                this.getLatestRecordFromDB(localStorage.getItem("userID"),"ProgressPicTbl",obj.lastProfileImageSyncTime).then(picSucc =>{
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
                    console.log("uErr -> "+JSON.stringify(uErr));
                });
            }else if(this.syncInd==4){
                this.getLatestRecordFromDB(localStorage.getItem("userID"),"ActivityPerformDurationTbl",obj.lastActLogSyncTime).then(actSucc =>{
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
                                console.log("activity log other response -> "+JSON.stringify(this.actSyncObj));
                            }
                        }).catch(actSyncErr =>{
                            console.log("actSyncErr -> "+JSON.stringify(actSyncErr));
                        });
                    }else{
                        this.syncInd++;
                        this.recurCallForSync(obj);
                    }
                }).catch(actErr =>{
                    console.log("actErr -> "+JSON.stringify(actErr));
                });
            }else if(this.syncInd==5){
                this.getRecordFromTbl(localStorage.getItem("userID"),"userCaloriesTbl","calorieDate",obj.lastUserCalorieSyncTime).then(calSucc =>{
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
                                        console.log("user calorie other response -> "+JSON.stringify(this.calSyncObj));
                                    }
                                }).catch(calSyncErr =>{
                                    console.log("calSyncErr -> "+JSON.stringify(calSyncErr));
                                });
                            }
                        }
                    }else{
                        this.syncInd++;
                        this.recurCallForSync(obj);
                    }
                }).catch(calErr =>{
                    console.log("calErr -> "+JSON.stringify(calErr));
                });
            }else if(this.syncInd==6){
                this.getRecordFromTbl(localStorage.getItem("userID"),"LogYourOwnFoodTbl","takenTime",obj.lastUserOwnFeedSyncTime).then(logFoodSucc =>{
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
                                        console.log("user food log other response -> "+JSON.stringify(this.logFoodSyncObj));
                                    }
                                }).catch(logFoodSyncErr =>{
                                    console.log("logFoodSyncErr -> "+JSON.stringify(logFoodSyncErr));
                                });
                            }
                        }
                    }else{
                        this.syncInd++;
                        this.recurCallForSync(obj);
                    }
                }).catch(logFoodErr =>{
                    console.log("logFoodErr -> "+JSON.stringify(logFoodErr));
                });
            }else if(this.syncInd==7){
                this.getRecordFromTbl(localStorage.getItem("userID"),"offlineCmplteWorkoutTbl","initDate",obj.lastWorkoutSyncTime).then(wCmpSucc =>{
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
                                        console.log("workout comp other response -> "+JSON.stringify(this.workoutCmpSyncObj));
                                    }
                                }).catch(wSyncErr =>{
                                    console.log("workoutCmp sync err -> "+JSON.stringify(wSyncErr));
                                });
                            }
                        }
                    }else{
                        this.syncInd++;
                        this.recurCallForSync(obj);
                    }
                }).catch(wCmpErr =>{
                    console.log("workoutCompleteErr -> "+JSON.stringify(wCmpErr));
                });
            }
        }else{
            console.log("sync done");
            this.syncInd = 0;
            this.showErrToast("Data sync to the server successfully.");
        }
    }

    funCallForProgressPic(arr,obj){
        this.globalSer.postMethod(arr,"progressImageSync?userID="+localStorage.getItem("userID")).then(bSyncSucc =>{
            this.picSyncObj = bSyncSucc;
            if(this.picSyncObj.statusCode=="200"){
                this.syncInd++;
                this.recurCallForSync(obj);
            }else{
                console.log("pic other response -> "+JSON.stringify(this.picSyncObj));
            }
        }).catch(bSyncErr =>{
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
                console.log("pic other response -> "+JSON.stringify(this.userAPIObj));
            }
        }).catch(uApiErr =>{
            console.log("uApiErr -> "+JSON.stringify(uApiErr));
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
}
