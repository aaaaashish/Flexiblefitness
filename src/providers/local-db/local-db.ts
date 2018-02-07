import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServicesProvider } from '../services/services';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { LoadingController } from 'ionic-angular';

@Injectable()
export class LocalDbProvider {
    loading:any;
    tblArr:any;
    delDBArr:any;
    localDB:any;

    constructor(public http: HttpClient, public globalSer: ServicesProvider, public loader: LoadingController) {
        console.log('Hello LocalDbProvider Provider');
        this.localDB = new SQLite();
    }

    presentLoading(){
        this.loading = this.loader.create({
            spinner: "crescent",
            content: 'Please wait...',
            cssClass: "ff-loader"
        });
        this.loading.present();
    }

    createDB(){
        return new Promise((resolve,reject) =>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) => {        
                this.tblArr = [
                    'CREATE TABLE IF NOT EXISTS Users(uniID integer primary key autoincrement, userID, userType, socialId, emailAddress, firstName, lastName, country, notificationStatus, dob, gender, unitOfMeasurement, height, heightCM, heightFT, heightInch, isBodyFatPercentageKnown, wantsSimpleMeasurement, waist, wrist, hip, forearm, age, activityLevel, weightGoal, paceOfProgress, diet, subscriptionPlan, subscriptionPlanID, workoutReminder, workoutReminderTime, isNutritionFlowSaved, xValue, yValue, zValue, deliverdToDoorQuestionShown, tooltipStatus, tooltipTime, initDate)',
                    'CREATE TABLE IF NOT EXISTS ProgressPicTbl(uniID integer primary key autoincrement, userID, picture, progressPicUpdateTime, initDate)',
                    'CREATE TABLE IF NOT EXISTS WeightListDB(uniID integer primary key autoincrement, userID, weight, creationTime, initDate)',
                    'CREATE TABLE IF NOT EXISTS BodyfatListDB(uniID integer primary key autoincrement, userID, bfPercentage, bfPercentageCreationTime, initDate)',
                    'CREATE TABLE IF NOT EXISTS MainWorkoutList(uniID integer primary key autoincrement, userID, name, image, initDate)',
                    'CREATE TABLE IF NOT EXISTS WorkoutDetailsTbl(uniID integer primary key autoincrement, userID, wType, wName, wImage, wDesc, wRules, initDate)',
                    'CREATE TABLE IF NOT EXISTS AnotherActivityListTbl(uniID integer primary key autoincrement, userID, actID, actName, actCalPerPound, initDate)',
                    'CREATE TABLE IF NOT EXISTS ActivityPerformDurationTbl(uniID integer primary key autoincrement, userID, actID, actName, duration, initDate)',
                    'CREATE TABLE IF NOT EXISTS dailyTipTbl(uniID integer primary key autoincrement, dailyTipID, dailyTip, initDate)',
                    'CREATE TABLE IF NOT EXISTS allerganceListTbl(uniID integer primary key autoincrement, allergenID, allergenName, initDate)',
                    'CREATE TABLE IF NOT EXISTS nutritionSavedDataTbl(uniID integer primary key autoincrement, userID, dietID, allergicID, mealTypeID, switchMealID, mealsDeliverID, initDate)',
                    'CREATE TABLE IF NOT EXISTS offlineSavedWorkoutTbl(uniID integer primary key autoincrement, userID, workoutType, workoutID, exID, exName, exDesc, exRules, exVideo, isWatched DEFAULT false, watchedTime DEFAULT "", initDate)',
                    'CREATE TABLE IF NOT EXISTS offlineCmplteWorkoutTbl(uniID integer primary key autoincrement, userID, workoutID, workoutType, feedbackVal DEFAULT "", isCompleted, initDate)',
                    'CREATE TABLE IF NOT EXISTS mealListForFreeUser(uniID integer primary key autoincrement, recipeCategory, recipeName, foodImage)',
                    'CREATE TABLE IF NOT EXISTS previousFoodTbl(uniID integer primary key autoincrement, userID, foodName, foodCal, takenTime)',
                    'CREATE TABLE IF NOT EXISTS LogYourOwnFoodTbl(uniID integer primary key autoincrement, userID, foodName, foodCal, takenTime, feedType)',
                    'CREATE TABLE IF NOT EXISTS userCaloriesTbl(uniID integer primary key autoincrement, userID, totalCalorie, calorieConsumed, calorieDate)',
                    'CREATE TABLE IF NOT EXISTS userTodaysMealTbl(uniID integer primary key autoincrement, userID, recipeID, recipeName, recipeCategory, mealLabel, calories, foodImage, instructions)',
                    'CREATE TABLE IF NOT EXISTS recipeIngredientTbl(uniID integer primary key autoincrement, recipeID, ingredientID, ingredientName, unit, ingredientQty)' 
                ];
                this.tblArr.forEach((element,ind) => {
                    db.executeSql(element, []).then(succ=> {
                        if(ind==this.tblArr.length-1){
                            console.log('tables created');
                            return resolve("tables created");
                        }
                    }).catch(err => {
                        console.log("exe_err=> "+JSON.stringify(err));
                        reject(err);
                    });
                });                         
            }).catch(e => {
                console.log("createDB_err-> "+e);
                reject(e);
            });
        });
    }

    deleteDB(){
        return new Promise((resolve,reject)=>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) => {        
                this.delDBArr = [
                    'DELETE FROM Users',
                    'DELETE FROM ProgressPicTbl',
                    'DELETE FROM WeightListDB',
                    'DELETE FROM BodyfatListDB',
                    'DELETE FROM MainWorkoutList',
                    'DELETE FROM WorkoutDetailsTbl',
                    'DELETE FROM AnotherActivityListTbl',
                    'DELETE FROM ActivityPerformDurationTbl',
                    'DELETE FROM dailyTipTbl',
                    'DELETE FROM allerganceListTbl',
                    'DELETE FROM nutritionSavedDataTbl',
                    'DELETE FROM offlineSavedWorkoutTbl',
                    'DELETE FROM offlineCmplteWorkoutTbl',
                    'DELETE FROM mealListForFreeUser',
                    'DELETE FROM previousFoodTbl',
                    'DELETE FROM LogYourOwnFoodTbl',
                    'DELETE FROM userCaloriesTbl',
                    'DELETE FROM userTodaysMealTbl',
                    'DELETE FROM recipeIngredientTbl'
                ];
                this.delDBArr.forEach((element,ind) => {
                    db.executeSql(element, []).then(succ=> {
                        if(ind==this.delDBArr.length-1){
                            console.log('tables deleted');
                            return resolve("succ");
                        }
                    }).catch(err => {
                        console.log("exe_err=> "+JSON.stringify(err));
                        reject("err");
                    });
                });                         
            }).catch(e => {
                console.log("deleteDB_err-> "+e);
                reject("err");
            });
        });        
    }

    insIntoUsersTbl(obj){
        return new Promise((resolve,reject)=>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) =>{
                db.transaction(function(tx){
                    tx.executeSql("DELETE FROM Users",[],function(txScr,resScr){
                        let query = "insert into Users (userID, userType, socialId, emailAddress, firstName, lastName, country, notificationStatus, dob, gender, unitOfMeasurement, height, heightCM, heightFT, heightInch, isBodyFatPercentageKnown, wantsSimpleMeasurement, waist, wrist, hip, forearm, age, activityLevel, weightGoal, paceOfProgress, diet, subscriptionPlan, subscriptionPlanID, workoutReminder, workoutReminderTime, isNutritionFlowSaved, xValue, yValue, zValue, deliverdToDoorQuestionShown, tooltipStatus, tooltipTime, initDate) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                        //let userDOB = parseInt(obj.dob)+(24*60*60*1000);
                        tx.executeSql(query, [obj.userID, obj.userType, obj.socialId, obj.emailAddress, obj.firstName, obj.lastName, obj.country, obj.notificationStatus, obj.dob, obj.genderID, obj.unitOfMeasurementID, obj.height, obj.heightCM, obj.heightFT, obj.heightInch, obj.isBodyFatPercentageKnown, obj.isWantsSimpleMeasurement, obj.waist, obj.wrist, obj.hip, obj.forearm, obj.age, obj.activityLevelID, obj.weightGoalID, obj.progressPaceID, obj.dietID, "", obj.subscriptionPlanID, obj.isWorkoutReminder, obj.workoutReminderTime, obj.isNutritionFlowSaved, obj.x, obj.y, obj.z, obj.isDeliverdToDoorQuestionShown, obj.tooltipStatus, obj.tooltipTime, obj.updateTime], function(tx, rs){
                             console.log("db ins succ-> ");
                             return resolve(rs);
                        },function(tx, error){
                            console.log('ins error: ' + error.message);
                            reject(error);
                        });
                    });                    
                });
            }).catch(e =>{
                reject(e);
                console.log("open_err-> "+JSON.stringify(e));
            });
        });
    }

    insDataIntoProgressPicTbl(userID,pic,updateTime){
        return new Promise((resolve,reject)=>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) => {        
                db.transaction(function(tx){
                    let query = "insert into ProgressPicTbl (userID, picture, progressPicUpdateTime, initDate) values (?,?,?,?)";
                    //pic.includes("file:")?pic = pic.substr(7):pic = pic;
                    tx.executeSql(query, [parseInt(userID), pic, updateTime, updateTime], function(tx, rs){
                        console.log("db ins succ-> ");
                        return resolve(rs);
                    },function(tx, error){
                        console.log('ins error: ' + error.message);
                        reject(error);
                    });
                });      
            }).catch(e => {
                console.log("insErr-> "+e);
                reject("err");
            });
        });
    }

    fetchDataFromUsersTbl(userID){
        console.log("userID-> "+userID);
        return new Promise((resolve,reject)=>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) =>{
                db.transaction(function(tx){
                    let query = "select * from Users where userID=?";
                    tx.executeSql(query, [parseInt(userID)], function(tx, rs){
                        console.log('fetch succ: ');
                        return resolve(rs.rows.item(0));
                    },function(tx, error){
                        console.log('fetch error: ' + error.message);
                        reject(error);
                    });
                });
            }).catch(e =>{
                console.log("open_err-> "+JSON.stringify(e));
            });
        });
    }

    updateTbl(tableN,cond,columnNArr,ArrData){
        return new Promise((resolve,reject) =>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) =>{
                db.transaction(function(tx){
                    let setMltplData = '';
                    for(var i=0; i<columnNArr.length; i++) {
                        if(i==columnNArr.length-1) {
                            setMltplData = setMltplData + columnNArr[i]+'=?'
                        } else {
                            setMltplData = setMltplData + columnNArr[i]+'=?, '
                        }
                    }
                    let query="UPDATE "+tableN+" SET "+setMltplData+" where "+cond+"=?";
                    //console.log('query:-   '+query+'\n'+ArrData);
                    tx.executeSql(query,ArrData,function(tx,res){
                        return resolve("table updated successfully.");
                    },function(err){
                        console.log('updated_err-: '+err);
                        reject(err);
                    })
                });
            }).catch(e =>{
                console.log("open_err-> "+JSON.stringify(e));
                reject(e);
            });
        });
    }

    fetchDataFromProgressPicTbl(userID){
        return new Promise((resolve,reject)=>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) =>{
                db.transaction(function(tx){
                    let dataArr = [];
                    let query = "select * from ProgressPicTbl where userID=? ORDER BY progressPicUpdateTime DESC";
                    tx.executeSql(query, [parseInt(userID)], function(tx, rs){
                        if(rs.rows.length!=0){
                            for(var i=0; i<rs.rows.length; i++){
                                dataArr.push(rs.rows.item(i));
                                if(i==rs.rows.length-1)
                                    return resolve(dataArr);
                            }
                        }else
                            return resolve(dataArr);
                    },function(tx, error){
                        console.log('fetch error: ' + error.message);
                        reject(error);
                    });
                });
            }).catch(e =>{
                console.log("open_err-> "+JSON.stringify(e));
            });
        });
    }

    insIntoWeightListDB(userID,arr){
        return new Promise((resolve,reject)=>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) => {        
                db.transaction(function(tx){
                    if(arr.length>0){
                        for(var i=0; i<arr.length; i++){
                            let query = "insert into WeightListDB (userID, weight, creationTime, initDate) values (?,?,?,?)";
                            tx.executeSql(query, [userID, arr[i].weight, arr[i].creationTime, arr[i].creationTime], function(tx, rs){
                                return resolve(rs);
                            },function(tx, error){
                                console.log('ins error: ' + error.message);
                                reject(error);
                            });
                            if(i==arr.length-1)
                                console.log("complete weight inserted");
                        }
                    }else
                        return resolve("blank arr");
                });      
            }).catch(e => {
                console.log("insErr-> "+e);
                reject("err");
            });
        });
    }

    insIntoBodyfatListDB(userID,arr){
        return new Promise((resolve,reject)=>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) => {        
                db.transaction(function(tx){
                    if(arr.length>0){
                        for(var i=0; i<arr.length; i++){
                            let query = "insert into BodyfatListDB (userID, bfPercentage, bfPercentageCreationTime, initDate) values (?,?,?,?)";
                            tx.executeSql(query, [userID, arr[i].bfPercentage, arr[i].bfPercentageCreationTime, arr[i].bfPercentageCreationTime], function(tx, rs){
                                return resolve(rs);
                            },function(tx, error){
                                console.log('ins error: ' + error.message);
                                reject(error);
                            });
                            if(i==arr.length-1)
                                console.log("complete bodyfat inserted");
                        }
                    }else
                        return resolve("blank arr");
                });      
            }).catch(e => {
                console.log("insErr-> "+e);
                reject("err");
            });
        });
    }

    fetchDataFromWeightListDB(userID){
        return new Promise((resolve,reject)=>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) =>{
                db.transaction(function(tx){
                    let dataArr = [];
                    let query = "select * from WeightListDB where userID=? ORDER BY creationTime ASC";
                    tx.executeSql(query, [parseInt(userID)], function(tx, rs){
                        if(rs.rows.length==0){
                            return resolve(dataArr);
                        }else{
                            for(var i=0; i<rs.rows.length; i++){
                                dataArr.push(rs.rows.item(i));
                                if(i==rs.rows.length-1)
                                    return resolve(dataArr);
                            }
                        }
                    },function(tx, error){
                        console.log('fetch error: ' + error.message);
                        reject(error);
                    });
                });
            }).catch(e =>{
                console.log("open_err-> "+JSON.stringify(e));
            });
        });
    }

    fetchDataFromBodyfatListDB(userID){
        return new Promise((resolve,reject)=>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) =>{
                db.transaction(function(tx){
                    let bfArr = [];
                    let query = "select * from BodyfatListDB where userID=? ORDER BY bfPercentageCreationTime ASC";
                    tx.executeSql(query, [parseInt(userID)], function(tx, rs){
                        if(rs.rows.length==0){
                            return resolve(bfArr);
                        }else{
                            for(var i=0; i<rs.rows.length; i++){
                                bfArr.push(rs.rows.item(i));
                                if(i==rs.rows.length-1)
                                    return resolve(bfArr);
                            }
                        }
                    },function(tx, error){
                        console.log('fetch error: ' + error.message);
                        reject(error);
                    });
                });
            }).catch(e =>{
                console.log("open_err-> "+JSON.stringify(e));
            });
        });
    }

    fetchUploadPicToday(userID){
        return new Promise((resolve,reject)=>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) =>{
                db.transaction(function(tx){
                    let picArr = [];
                    let query = "select userID, progressPicUpdateTime from ProgressPicTbl where userID=? ORDER BY progressPicUpdateTime DESC";
                    tx.executeSql(query, [parseInt(userID)], function(tx, rs){
                        if(rs.rows.length==0){
                            return resolve(picArr);
                        }else{
                            for(var i=0; i<rs.rows.length; i++){
                                picArr.push(rs.rows.item(i));
                                if(i==rs.rows.length-1)
                                    return resolve(picArr);
                            }
                        }
                    },function(tx, error){
                        console.log('fetch upload pic error: ' + error.message);
                        reject(error);
                    });
                });
            }).catch(e =>{
                console.log("open_err-> "+JSON.stringify(e));
            });
        });
    }

    fetchLatestBodyfat(userID){
        return new Promise((resolve,reject)=>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) =>{
                db.transaction(function(tx){
                    let bofyFatArr = [];
                    let query = "select * from BodyfatListDB where userID=? ORDER BY bfPercentageCreationTime DESC";
                    tx.executeSql(query, [parseInt(userID)], function(tx, rs){
                        if(rs.rows.length==0){
                            return resolve(bofyFatArr);
                        }else{
                            bofyFatArr.push(rs.rows.item(0));
                            return resolve(bofyFatArr);
                        }
                    },function(tx, error){
                        console.log('fetch bf error: ' + error.message);
                        reject(error);
                    });
                });
            }).catch(e =>{
                console.log("open_err-> "+JSON.stringify(e));
            });
        });
    }

    fetchLatestWeight(userID){
        return new Promise((resolve,reject)=>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) =>{
                db.transaction(function(tx){
                    let weightArr = [];
                    let query = "select * from WeightListDB where userID=? ORDER BY creationTime DESC";
                    tx.executeSql(query, [parseInt(userID)], function(tx, rs){
                        if(rs.rows.length==0){
                            return resolve(weightArr);
                        }else{
                            weightArr.push(rs.rows.item(0));
                            return resolve(weightArr);
                        }
                    },function(tx, error){
                        console.log('fetch weight error: ' + error.message);
                        reject(error);
                    });
                });
            }).catch(e =>{
                console.log("open_err-> "+JSON.stringify(e));
            });
        });
    }

    insListIntoMainWorkoutList(userID,name,pic){
        return new Promise((resolve,reject)=>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) => {        
                db.transaction(function(tx){
                    let query = "insert into MainWorkoutList (userID, name, image, initDate) values (?,?,?,?)";
                    tx.executeSql(query, [userID, name, pic, new Date().getTime()], function(tx, rs){
                        console.log("workout ins succ-> ");
                        return resolve(rs);
                    },function(tx, error){
                        console.log('workout ins error: ' + error.message);
                        reject(error);
                    });
                });      
            }).catch(e => {
                console.log("insErr-> "+e);
                reject("err");
            });
        });
    }

    fetchDatafromMainWorkoutList(userID){
        return new Promise((resolve,reject)=>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) =>{
                db.transaction(function(tx){
                    let dataArr = [];
                    let query = "select * from MainWorkoutList where userID=?";
                    tx.executeSql(query, [parseInt(userID)], function(tx, rs){
                        if(rs.rows.length!=0){
                            for(var i=0; i<rs.rows.length; i++){
                                dataArr.push(rs.rows.item(i));
                                if(i==rs.rows.length-1)
                                    return resolve(dataArr);
                            }
                        }else
                            return resolve(dataArr);
                    },function(tx, error){
                        console.log('fetch error: ' + error.message);
                        reject(error);
                    });
                });
            }).catch(e =>{
                console.log("open_err-> "+JSON.stringify(e));
            });
        });
    }

    insIntoWorkoutDetailsTbl(obj){
        return new Promise((resolve,reject)=>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) => {        
                db.transaction(function(tx){
                    let query = "insert into WorkoutDetailsTbl (userID, wType, wName, wImage, wDesc, wRules, initDate) values (?,?,?,?,?,?,?)";
                    tx.executeSql(query, [obj.userID, obj.type, obj.name, obj.img, obj.desc, obj.rule, new Date().getTime()], function(tx, rs){
                        console.log("workout ins succ-> ");
                        return resolve(rs);
                    },function(tx, error){
                        console.log('workout ins error: ' + error.message);
                        reject(error);
                    });
                });      
            }).catch(e => {
                console.log("insErr-> "+e);
                reject("err");
            });
        });
    }

    insIntoAnotherActivityListTbl(userID,arr){
        return new Promise((resolve,reject)=>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) => {        
                db.transaction(function(tx){
                    if(arr.length>0){
                        for(var i=0; i<arr.length; i++){
                            let query = "insert into AnotherActivityListTbl (userID, actID, actName, actCalPerPound, initDate) values (?,?,?,?,?)";
                            tx.executeSql(query, [userID, arr[i].activityID, arr[i].activityName, arr[i].caloriesPerPound, new Date().getTime()], function(tx, rs){
                                return resolve(rs);
                            },function(tx, error){
                                console.log('ins error: ' + error.message);
                                reject(error);
                            });
                            if(i==arr.length-1)
                                console.log("complete activity inserted");
                        }
                    }else
                        return resolve("blank arr");
                });      
            }).catch(e => {
                console.log("insErr-> "+e);
                reject("err");
            });
        });
    }

    fetchDatafromWorkoutDetailsTbl(userID,type){
        return new Promise((resolve,reject)=>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) =>{
                db.transaction(function(tx){
                    let fetchArr = [];
                    let query = "select * from WorkoutDetailsTbl where userID=? AND wType=?";
                    tx.executeSql(query, [parseInt(userID),type], function(tx, rs){
                        if(rs.rows.length==0){
                            return resolve(fetchArr);
                        }else{
                            fetchArr.push(rs.rows.item(0));
                            return resolve(fetchArr);
                        }
                    },function(tx, error){
                        console.log('fetch data error: ' + error.message);
                        reject(error);
                    });
                });
            }).catch(e =>{
                console.log("open_err-> "+JSON.stringify(e));
            });
        });
    }

    fetchDatafromAnotherActivityListTbl(userID){
        return new Promise((resolve,reject)=>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) =>{
                db.transaction(function(tx){
                    let dataArr = [];
                    let query = "select * from AnotherActivityListTbl where userID=?";
                    tx.executeSql(query, [parseInt(userID)], function(tx, rs){
                        if(rs.rows.length!=0){
                            for(var i=0; i<rs.rows.length; i++){
                                dataArr.push(rs.rows.item(i));
                                if(i==rs.rows.length-1)
                                    return resolve(dataArr);
                            }
                        }else
                            return resolve(dataArr);
                    },function(tx, error){
                        console.log('fetch error: ' + error.message);
                        reject(error);
                    });
                });
            }).catch(e =>{
                console.log("open_err-> "+JSON.stringify(e));
            });
        });
    }

    insIntoActivityPerformDurationTbl(userID,arr){
        return new Promise((resolve,reject)=>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) =>{
                db.transaction(function(tx){
                    if(arr.length>0){
                        for(var i=0; i<arr.length; i++){
                            let query = "insert into ActivityPerformDurationTbl (userID, actID, actName, duration, initDate) values (?,?,?,?,?)";
                            tx.executeSql(query, [userID, arr[i].activityID, arr[i].activityName, arr[i].duration, arr[i].activityLogTime], function(tx, rs){
                                return resolve(rs);
                            },function(tx, error){
                                console.log('ins error: ' + error.message);
                                reject(error);
                            });
                            if(i==arr.length-1)
                                console.log("complete act log inserted");
                        }
                    }else
                        return resolve("blank arr");                    
                });
            }).catch(e =>{
                reject(e);
                console.log("open_err-> "+JSON.stringify(e));
            });
        });
    }

    fetchDatafromActivityPerformDurationTbl(userID){
        return new Promise((resolve,reject)=>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) =>{
                db.transaction(function(tx){
                    let dataArr = [];
                    let query = "select * from ActivityPerformDurationTbl where userID=? ORDER BY initDate ASC";
                    tx.executeSql(query, [parseInt(userID)], function(tx, rs){
                        if(rs.rows.length!=0){
                            for(var i=0; i<rs.rows.length; i++){
                                dataArr.push(rs.rows.item(i));
                                if(i==rs.rows.length-1)
                                    return resolve(dataArr);
                            }
                        }else
                            return resolve(dataArr);
                    },function(tx, error){
                        console.log('fetch error: ' + error.message);
                        reject(error);
                    });
                });
            }).catch(e =>{
                console.log("open_err-> "+JSON.stringify(e));
            });
        });
    }
    
    insIntoDailyTipTbl(obj){
        return new Promise((resolve,reject)=>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) => {        
                db.transaction(function(tx){
                    let query = "insert into dailyTipTbl (dailyTipID, dailyTip, initDate) values (?,?,?)";
                    tx.executeSql(query, [obj.tipID, obj.tipDesc, new Date().getTime()], function(tx, rs){
                        console.log("daliyTip ins succ-> ");
                        return resolve(rs);
                    },function(tx, error){
                        console.log('daliyTip ins error: ' + error.message);
                        reject(error);
                    });
                });      
            }).catch(e => {
                console.log("insErr-> "+e);
                reject("err");
            });
        });
    }

    fetchDataFromDailyTipTbl(){
        return new Promise((resolve,reject)=>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) =>{
                db.transaction(function(tx){
                    let query = "select * from dailyTipTbl";
                    tx.executeSql(query, [], function(tx, rs){
                         return resolve(rs.rows.item(0));
                    },function(tx, error){
                        console.log('fetch error: ' + error.message);
                        reject(error);
                    });
                });
            }).catch(e =>{
                console.log("open_err-> "+JSON.stringify(e));
            });
        });
    }

    insIntoAllerganceListTbl(arr){
        return new Promise((resolve,reject)=>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) => {        
                db.transaction(function(tx){
                    if(arr.length>0){
                        for(var i=0; i<arr.length; i++){
                            let query = "insert into allerganceListTbl (allergenID, allergenName, initDate) values (?,?,?)";
                            tx.executeSql(query, [arr[i].allergenID, arr[i].allergenName, new Date().getTime()], function(tx, rs){
                                return resolve(rs);
                            },function(tx, error){
                                console.log('ins error: ' + error.message);
                                reject(error);
                            });
                            if(i==arr.length-1)
                                console.log("complete activity inserted");
                        }
                    }else
                        return resolve("blank arr");
                });      
            }).catch(e => {
                console.log("insErr-> "+e);
                reject("err");
            });
        });
    }

    fetchDataFromAllerganceListTbl(){
        return new Promise((resolve,reject)=>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) =>{
                db.transaction(function(tx){
                    let dataArr = [];
                    let query = "select * from allerganceListTbl";
                    tx.executeSql(query, [], function(tx, rs){
                        if(rs.rows.length!=0){
                            for(var i=0; i<rs.rows.length; i++){
                                dataArr.push(rs.rows.item(i));
                                if(i==rs.rows.length-1)
                                    return resolve(dataArr);
                            }
                        }else
                            return resolve(dataArr);
                    },function(tx, error){
                        console.log('fetch error: ' + error.message);
                        reject(error);
                    });
                });
            }).catch(e =>{
                console.log("open_err-> "+JSON.stringify(e));
            });
        });
    }

    insIntoNutritionSavedDataTbl(obj){
        return new Promise((resolve,reject)=>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) =>{
                db.transaction(function(tx){
                    let query = "insert into nutritionSavedDataTbl (userID, dietID, allergicID, mealTypeID, switchMealID, mealsDeliverID, initDate) values (?,?,?,?,?,?,?)";
                    tx.executeSql(query, [parseInt(obj.userID), obj.kindOfDiat, obj.allergance, obj.howManyMeal, obj.switchMeals, obj.mealDeliverStatus, new Date().getTime()], function(tx, rs){
                            console.log("nutri_ins_succ-> ");
                            return resolve(rs);
                    },function(tx, error){
                        console.log('ins error: ' + error.message);
                        reject(error);
                    });                    
                });
            }).catch(e =>{
                reject(e);
                console.log("open_err-> "+JSON.stringify(e));
            });
        });
    }

    fetchDataFromNutritionSavedDataTbl(userID){
        return new Promise((resolve,reject)=>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) =>{
                db.transaction(function(tx){
                    let query = "select * from nutritionSavedDataTbl where userID=?";
                    let dataArr = [];
                    tx.executeSql(query, [parseInt(userID)], function(tx, rs){
                        if(rs.rows.length!=0){
                            dataArr.push(rs.rows.item(0));
                            return resolve(dataArr);
                        }else
                            return resolve(dataArr);
                    },function(tx, error){
                        console.log('fetch error: ' + error.message);
                        reject(error);
                    });
                });
            }).catch(e =>{
                console.log("open_err-> "+JSON.stringify(e));
            });
        });
    }

    delDataFromTooltipTbl(){
        return new Promise((resolve,reject)=>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) => {        
                this.delDBArr = [
                    'DELETE FROM dailyTipTbl'
                ];
                this.delDBArr.forEach((element,ind) => {
                    db.executeSql(element, []).then(succ=> {
                        if(ind==this.delDBArr.length-1){
                            console.log('dailyTipTbl table deleted');
                            return resolve("succ");
                        }
                    }).catch(err => {
                        console.log("exe_err=> "+JSON.stringify(err));
                        reject("err");
                    });
                });                         
            }).catch(e => {
                console.log("deleteDB_err-> "+e);
                reject("err");
            });
        });
    }
    
    insIntoOfflineSavedWorkoutTbl(obj){
        return new Promise((resolve,reject)=>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) => {        
                db.transaction(function(tx){
                    let query = "insert into offlineSavedWorkoutTbl (userID, workoutType, workoutID, exID, exName, exDesc, exRules, exVideo, initDate) values (?,?,?,?,?,?,?,?,?)";
                    tx.executeSql(query, [obj.userID,obj.wType,obj.wID,obj.exID,obj.exName,obj.exDesc,obj.exRules,obj.exVideo,obj.initDate], function(tx, rs){
                        console.log("offline ins succ-> ");
                        return resolve(rs);
                    },function(tx, error){
                        console.log('offline ins error: ' + error.message);
                        reject(error);
                    });
                });      
            }).catch(e => {
                console.log("insErr-> "+e);
                reject("err");
            });
        });
    }

    fetchDataFromOfflineSavedWorkoutTbl(userID){
        return new Promise((resolve,reject)=>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) =>{
                db.transaction(function(tx){
                    let dataArr = [];
                    let query = "select * from offlineSavedWorkoutTbl where userID=?";
                    tx.executeSql(query, [parseInt(userID)], function(tx, rs){
                        if(rs.rows.length!=0){
                            for(var i=0; i<rs.rows.length; i++){
                                dataArr.push(rs.rows.item(i));
                                if(i==rs.rows.length-1)
                                    return resolve(dataArr);
                            }
                        }else
                            return resolve(dataArr);
                    },function(tx, error){
                        console.log('fetch error: ' + error.message);
                        reject(error);
                    });
                });
            }).catch(e =>{
                console.log("open_err-> "+JSON.stringify(e));
            });
        });
    }

    updateOfflineWorkoutTbl(tableN,cond1,cond2,columnNArr,ArrData){
        return new Promise((resolve,reject) =>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) =>{
                db.transaction(function(tx){
                    let setMltplData = '';
                    for(var i=0; i<columnNArr.length; i++) {
                        if(i==columnNArr.length-1) {
                            setMltplData = setMltplData + columnNArr[i]+'=?'
                        } else {
                            setMltplData = setMltplData + columnNArr[i]+'=?, '
                        }
                    }
                    let query = "UPDATE "+tableN+" SET "+setMltplData+" where "+cond1+"=? AND "+cond2+"=?";
                    console.log('query:-   '+query+'\n'+ArrData);
                    tx.executeSql(query,ArrData,function(tx,res){
                        return resolve("table updated successfully.");
                    },function(err){
                        console.log('updated_err-: '+err);
                        reject(err);
                    })
                });
            }).catch(e =>{
                console.log("open_err-> "+JSON.stringify(e));
                reject(e);
            });
        });
    }

    insIntoOfflineCmplteWorkoutTbl(obj){
        return new Promise((resolve,reject)=>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) => {        
                db.transaction(function(tx){
                    let query = "insert into offlineCmplteWorkoutTbl (userID, workoutID, workoutType, isCompleted, initDate) values (?,?,?,?,?)";
                    tx.executeSql(query, [obj.userID,obj.wID,obj.wType,obj.isCompleted,obj.initDate], function(tx, rs){
                        console.log("cmplte workout ins succ-> ");
                        return resolve(rs);
                    },function(tx, error){
                        console.log('cmplte workout ins error: ' + error.message);
                        reject(error);
                    });
                });      
            }).catch(e => {
                console.log("insErr-> "+e);
                reject("err");
            });
        });
    }

    delDataFromofflineSavedWorkoutTbl(){
        return new Promise((resolve,reject)=>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) => {        
                this.delDBArr = [
                    'DELETE FROM offlineSavedWorkoutTbl'
                ];
                this.delDBArr.forEach((element,ind) => {
                    db.executeSql(element, []).then(succ=> {
                        if(ind==this.delDBArr.length-1){
                            console.log('offline save workout table deleted');
                            return resolve("succ");
                        }
                    }).catch(err => {
                        console.log("exe_err=> "+JSON.stringify(err));
                        reject("err");
                    });
                });                         
            }).catch(e => {
                console.log("deleteDB_err-> "+e);
                reject("err");
            });
        });
    }

    insIntoMealListForFreeUser(obj){
        return new Promise((resolve,reject)=>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) => {        
                db.transaction(function(tx){
                    let query = "insert into mealListForFreeUser (recipeCategory, recipeName, foodImage) values (?,?,?)";
                    tx.executeSql(query, [obj.cat, obj.catName, obj.img], function(tx, rs){
                        return resolve(rs);
                    },function(tx, error){
                        console.log('ins error: ' + error.message);
                        reject(error);
                    });
                });      
            }).catch(e => {
                console.log("insErr-> "+e);
                reject("err");
            });
        });
    }

    fetchDataFromMealListForFreeUser(){
        return new Promise((resolve,reject)=>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) =>{
                db.transaction(function(tx){
                    let dataArr = [];
                    let query = "select * from mealListForFreeUser";
                    tx.executeSql(query, [], function(tx, rs){
                        if(rs.rows.length!=0){
                            for(var i=0; i<rs.rows.length; i++){
                                dataArr.push(rs.rows.item(i));
                                if(i==rs.rows.length-1)
                                    return resolve(dataArr);
                            }
                        }else
                            return resolve(dataArr);
                    },function(tx, error){
                        console.log('fetch error: ' + error.message);
                        reject(error);
                    });
                });
            }).catch(e =>{
                console.log("open_err-> "+JSON.stringify(e));
            });
        });
    }

    insIntoPreviousFoodTbl(userID,arr){
        return new Promise((resolve,reject)=>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) =>{
                db.transaction(function(tx){
                    if(arr.length>0){
                        for(var i=0; i<arr.length; i++){
                            let query = "insert into previousFoodTbl (userID, foodName, foodCal, takenTime) values (?,?,?,?)";
                            tx.executeSql(query, [userID, arr[i].foodName, arr[i].foodCal, arr[i].takenTime], function(tx, rs){
                                return resolve(rs);
                            },function(tx, error){
                                console.log('ins error: ' + error.message);
                                reject(error);
                            });
                            if(i==arr.length-1)
                                console.log("complete pre food inserted");
                        }
                    }else
                        return resolve("blank arr");                    
                });
            }).catch(e =>{
                reject(e);
                console.log("open_err-> "+JSON.stringify(e));
            });
        });
    }

    fetchDataFromPreviousFoodTbl(userID){
        return new Promise((resolve,reject)=>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) =>{
                db.transaction(function(tx){
                    let dataArr = [];
                    let query = "select * from previousFoodTbl where userID=? ORDER BY takenTime DESC";
                    tx.executeSql(query, [parseInt(userID)], function(tx, rs){
                        if(rs.rows.length!=0){
                            for(var i=0; i<rs.rows.length; i++){
                                dataArr.push(rs.rows.item(i));
                                if(i==rs.rows.length-1)
                                    return resolve(dataArr);
                            }
                        }else
                            return resolve(dataArr);
                    },function(tx, error){
                        console.log('fetch error: ' + error.message);
                        reject(error);
                    });
                });
            }).catch(e =>{
                console.log("open_err-> "+JSON.stringify(e));
            });
        });
    }

    insIntoLogYourOwnFoodTbl(userID,arr){
        return new Promise((resolve,reject)=>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) =>{
                db.transaction(function(tx){
                    if(arr.length>0){
                        for(var i=0; i<arr.length; i++){
                            let query = "insert into LogYourOwnFoodTbl (userID, foodName, foodCal, takenTime, feedType) values (?,?,?,?,?)";
                            tx.executeSql(query, [userID, arr[i].foodName, arr[i].foodCal, arr[i].takenTime, arr[i].feedType], function(tx, rs){
                                return resolve(rs);
                            },function(tx, error){
                                console.log('ins error: ' + error.message);
                                reject(error);
                            });
                            if(i==arr.length-1)
                                console.log("complete pre food inserted");
                        }
                    }else
                        return resolve("blank arr");                    
                });
            }).catch(e =>{
                reject(e);
                console.log("open_err-> "+JSON.stringify(e));
            });
        });
    }

    fetchDataFromLogYourOwnFoodTbl(userID){
        return new Promise((resolve,reject)=>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) =>{
                db.transaction(function(tx){
                    let dataArr = [];
                    let query = "select * from LogYourOwnFoodTbl where userID=? ORDER BY takenTime ASC";
                    tx.executeSql(query, [parseInt(userID)], function(tx, rs){
                        if(rs.rows.length!=0){
                            for(var i=0; i<rs.rows.length; i++){
                                dataArr.push(rs.rows.item(i));
                                if(i==rs.rows.length-1)
                                    return resolve(dataArr);
                            }
                        }else
                            return resolve(dataArr);
                    },function(tx, error){
                        console.log('fetch error: ' + error.message);
                        reject(error);
                    });
                });
            }).catch(e =>{
                console.log("open_err-> "+JSON.stringify(e));
            });
        });
    }

    insIntoUserCaloriesTbl(userID,arr){
        return new Promise((resolve,reject)=>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) =>{
                db.transaction(function(tx){
                    if(arr.length>0){
                        for(var i=0; i<arr.length; i++){
                            let query = "insert into userCaloriesTbl (userID, totalCalorie, calorieConsumed, calorieDate) values (?,?,?,?)";
                            tx.executeSql(query, [userID, arr[i].totalCal, arr[i].calConsumed, arr[i].calDate], function(tx, rs){
                                return resolve(rs);
                            },function(tx, error){
                                console.log('ins error: ' + error.message);
                                reject(error);
                            });
                            if(i==arr.length-1)
                                console.log("user calories inserted");
                        }
                    }else
                        return resolve("blank arr");                    
                });
            }).catch(e =>{
                reject(e);
                console.log("open_err-> "+JSON.stringify(e));
            });
        });
    }

    fetchDataFromUserCaloriesTbl(userID){
        return new Promise((resolve,reject)=>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) =>{
                db.transaction(function(tx){
                    let dataArr = [];
                    let query = "select * from userCaloriesTbl where userID=? ORDER BY calorieDate ASC";
                    tx.executeSql(query, [parseInt(userID)], function(tx, rs){
                        if(rs.rows.length!=0){
                            for(var i=0; i<rs.rows.length; i++){
                                dataArr.push(rs.rows.item(i));
                                if(i==rs.rows.length-1)
                                    return resolve(dataArr);
                            }
                        }else
                            return resolve(dataArr);
                    },function(tx, error){
                        console.log('fetch error: ' + error.message);
                        reject(error);
                    });
                });
            }).catch(e =>{
                console.log("open_err-> "+JSON.stringify(e));
            });
        });
    }

    fetchLatestRecordFromUserCaloriesTbl(userID){
        return new Promise((resolve,reject)=>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) =>{
                db.transaction(function(tx){
                    let dataArr = [];
                    let query = "select * from userCaloriesTbl where userID=? ORDER BY calorieDate DESC";
                    tx.executeSql(query, [parseInt(userID)], function(tx, rs){
                        if(rs.rows.length==0){
                            return resolve(dataArr);
                        }else{
                            dataArr.push(rs.rows.item(0));
                            return resolve(dataArr);
                        }
                    },function(tx, error){
                        console.log('fetch user cal error: ' + error.message);
                        reject(error);
                    });
                });
            }).catch(e =>{
                console.log("open_err-> "+JSON.stringify(e));
            });
        });
    }

    delDataFromUserCaloriesTbl(){
        return new Promise((resolve,reject)=>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) => {        
                this.delDBArr = [
                    'DELETE FROM userCaloriesTbl'
                ];
                this.delDBArr.forEach((element,ind) => {
                    db.executeSql(element, []).then(succ=> {
                        if(ind==this.delDBArr.length-1){
                            console.log('userCaloriesTbl table deleted');
                            return resolve("succ");
                        }
                    }).catch(err => {
                        console.log("exe_err=> "+JSON.stringify(err));
                        reject("err");
                    });
                });                         
            }).catch(e => {
                console.log("deleteDB_err-> "+e);
                reject("err");
            });
        });
    }

    insIntoUserTodaysMealTbl(obj){
        return new Promise((resolve,reject)=>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) => {        
                db.transaction(function(tx){
                    let query = "insert into userTodaysMealTbl (userID, recipeID, recipeName, recipeCategory, mealLabel, calories, foodImage, instructions) values (?,?,?,?,?,?,?,?)";
                    tx.executeSql(query, [obj.userID, obj.recipeID, obj.recipeName, obj.recipeCategory, obj.mealLabel, obj.calories, obj.foodImage, obj.instructions], function(tx, rs){
                        console.log("todays meal ins succ-> ");
                        return resolve(rs);
                    },function(tx, error){
                        console.log('todays meal ins error: ' + error.message);
                        reject(error);
                    });
                });      
            }).catch(e => {
                console.log("insErr-> "+e);
                reject("err");
            });
        });
    }

    insIntoRecipeIngredientTbl(rID,arr){
        return new Promise((resolve,reject)=>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) =>{
                db.transaction(function(tx){
                    if(arr.length>0){
                        for(var i=0; i<arr.length; i++){
                            let query = "insert into recipeIngredientTbl (recipeID, ingredientID, ingredientName, unit, ingredientQty) values (?,?,?,?,?)";
                            tx.executeSql(query, [rID, arr[i].ingredientID, arr[i].ingredientName, arr[i].unit, arr[i].ingredientQty], function(tx, rs){
                                return resolve(rs);
                            },function(tx, error){
                                console.log('ins error: ' + error.message);
                                reject(error);
                            });
                            if(i==arr.length-1)
                                console.log("incredients inserted");
                        }
                    }else
                        return resolve("blank arr");                    
                });
            }).catch(e =>{
                reject(e);
                console.log("open_err-> "+JSON.stringify(e));
            });
        });
    }
    
    fetchDataFromUserTodaysMealTbl(userID){
        return new Promise((resolve,reject)=>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) =>{
                db.transaction(function(tx){
                    let dataArr = [];
                    let query = "select * from userTodaysMealTbl where userID=?";
                    tx.executeSql(query, [parseInt(userID)], function(tx, rs){
                        if(rs.rows.length==0){
                            return resolve(dataArr);
                        }else{
                            for(var i=0; i<rs.rows.length; i++){
                                dataArr.push(rs.rows.item(i));
                                if(i==rs.rows.length-1)
                                    return resolve(dataArr);
                            }
                        }
                    },function(tx, error){
                        console.log('fetch user todays meal error: ' + error.message);
                        reject(error);
                    });
                });
            }).catch(e =>{
                console.log("open_err-> "+JSON.stringify(e));
            });
        });
    }

    fetchDataFromRecipeIngredientTbl(rID){
        return new Promise((resolve,reject)=>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) =>{
                db.transaction(function(tx){
                    let dataArr = [];
                    let query = "select * from recipeIngredientTbl where recipeID=?";
                    tx.executeSql(query, [parseInt(rID)], function(tx, rs){
                        if(rs.rows.length==0){
                            return resolve(dataArr);
                        }else{
                            for(var i=0; i<rs.rows.length; i++){
                                dataArr.push(rs.rows.item(i));
                                if(i==rs.rows.length-1)
                                    return resolve(dataArr);
                            }
                        }
                    },function(tx, error){
                        console.log('fetch recipe ingredients error: ' + error.message);
                        reject(error);
                    });
                });
            }).catch(e =>{
                console.log("open_err-> "+JSON.stringify(e));
            });
        });
    }

    delTwoTbl(){
        return new Promise((resolve,reject)=>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) => {        
                this.delDBArr = [
                    'DELETE FROM userTodaysMealTbl',
                    'DELETE FROM recipeIngredientTbl'
                ];
                this.delDBArr.forEach((element,ind) => {
                    db.executeSql(element, []).then(succ=> {
                        if(ind==this.delDBArr.length-1){
                            console.log('two table deleted');
                            return resolve("succ");
                        }
                    }).catch(err => {
                        console.log("exe_err=> "+JSON.stringify(err));
                        reject("err");
                    });
                });                         
            }).catch(e => {
                console.log("deleteDB_err-> "+e);
                reject("err");
            });
        });
    }

    delFromRecipeIngredientTbl(rID){
        return new Promise((resolve,reject)=>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) => {        
                db.transaction(function(tx){
                    let query = "DELETE from recipeIngredientTbl where recipeID=?";
                    tx.executeSql(query, [parseInt(rID)], function(tx, rs){
                        return resolve("delete succ");
                    },function(tx, error){
                        console.log('delete error: ' + error.message);
                        reject(error);
                    });
                });                         
            }).catch(e => {
                console.log("deleteDB_err-> "+e);
                reject("err");
            });
        });
    }

    delTable(arr){
        return new Promise((resolve,reject)=>{
            this.localDB.create({
                name: 'FlexibleFitness.db',
                location: 'default'
            }).then((db: SQLiteObject) => {
                arr.forEach((element,ind) => {
                    db.executeSql(element, []).then(succ=> {
                        if(ind==arr.length-1){
                            console.log('tables deleted');
                            return resolve("succ");
                        }
                    }).catch(err => {
                        console.log("exe_err=> "+JSON.stringify(err));
                        reject("err");
                    });
                });                         
            }).catch(e => {
                console.log("deleteDB_err-> "+e);
                reject("err");
            });
        });
    }
}
