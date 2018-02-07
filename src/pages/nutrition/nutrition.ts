import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import { TodaysMealsPage } from '../todays-meals/todays-meals';
import { LogyourOwnFoodPage } from '../logyour-own-food/logyour-own-food';
import { App } from 'ionic-angular/components/app/app';
import { ServicesProvider } from '../../providers/services/services';
import { NutritionGuidelinesPage } from '../nutrition-guidelines/nutrition-guidelines';
import { DatePipe } from '@angular/common';
import { LocalDbProvider } from '../../providers/local-db/local-db';
import { FreeUserNutritionPage } from '../free-user-nutrition/free-user-nutrition';

@IonicPage()
@Component({
    selector: 'page-nutrition',
    templateUrl: 'nutrition.html',
})
export class NutritionPage {
    loading:any;
    userData:any;
    nutriDate:any;
    nutriTotalCal:any;
    nutriCalConsumed:any;
    nutriCalRem:any;
    nutriInd:any;
    currInd:any;
    foodVal:any;
    calVal:any;
    hisTime:any;
    foodHisTblArr:any;
    calTblArr:any = [];
    latestCalObj:any;
    copyWeightArr:any;
    calListArr:any = [];

    logFoodTblArr:any = [];
    logInd:any;


    constructor(public navCtrl: NavController, public navParams: NavParams, public app: App, public globalSer: ServicesProvider, public db: LocalDbProvider, public loader: LoadingController, public events: Events) {
        events.subscribe("logFoodInserted",() =>{
            this.funcForFoodLogHis();
            this.fetchNutiDataFromUsersTbl();
        })
    }

    ionViewWillEnter(){
        console.log("nutition ionViewWillEnter call");
        this.fetchNutiDataFromUsersTbl();
        this.funcForFoodLogHis();
    }

    fetchNutiDataFromUsersTbl(){
        this.db.fetchDataFromUsersTbl(localStorage.getItem("userID")).then(fNSucc =>{
            //console.log("fUSucc=> "+JSON.stringify(fNSucc));
            this.userData = fNSucc;
            if(this.userData.userType=="Free User"){
                this.navCtrl.push(FreeUserNutritionPage);
            }else{
                this.calculateTodayCalories();
                console.log("isNutritionFlowSaved => "+this.userData.isNutritionFlowSaved);
                if(this.userData.isNutritionFlowSaved==false || this.userData.isNutritionFlowSaved=="false"){
                    this.navCtrl.push(NutritionGuidelinesPage);
                }
            }
        }).catch(fNErr =>{
            console.log("fNErr=> "+JSON.stringify(fNErr));
        });
    }

    calculateTodayCalories(){
        this.db.fetchDataFromUserCaloriesTbl(localStorage.getItem("userID")).then(calSucc =>{
            this.calTblArr = calSucc;
            if(this.calTblArr.length==0)
                this.getLatestWeight();
            else{
                this.db.fetchLatestRecordFromUserCaloriesTbl(localStorage.getItem("userID")).then(lCalSucc =>{
                    this.latestCalObj = lCalSucc;
                    console.log("latestCalObj => "+JSON.stringify(this.latestCalObj));
                    //let totalDays = Math.round((new Date().getTime() - parseInt(this.latestCalObj[0].calorieDate))/(24*60*60*1000));
                    var date1 = new Date(new Date(parseInt(this.latestCalObj[0].calorieDate)).getMonth()+1+'/'+new Date(parseInt(this.latestCalObj[0].calorieDate)).getDate()+'/'+new Date(parseInt(this.latestCalObj[0].calorieDate)).getFullYear());
                    var date2 = new Date(new Date().getMonth()+1+'/'+new Date().getDate()+'/'+new Date().getFullYear());
                    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
                    let totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                    console.log("totalDays => "+totalDays);
                    totalDays==0?this.fetchCalRecordFromTbl():this.calculateAllDaysCalorie(this.latestCalObj,totalDays);
                }).catch(lCalErr =>{
                    console.log("lCalErr => "+JSON.stringify(lCalErr));
                });
            }
        }).catch(calErr =>{
            console.log("calErr => "+JSON.stringify(calErr));
        });
    }

    calculateAllDaysCalorie(arr,totalD){
        for(var i=1; i<=totalD; i++){
            let calArr = [{
                totalCal: arr[0].totalCalorie,
                calConsumed: 0,
                calDate: (parseInt(arr[0].calorieDate)+(i*(24*60*60*1000)))
            }];
            this.db.insIntoUserCaloriesTbl(parseInt(localStorage.getItem("userID")),calArr).then(insCalSucc =>{
                console.log("user cal inserted for -> "+i);
            }).catch(insCalErr =>{
                console.log('insCalErr => '+JSON.stringify(insCalErr));
            });
            if(i==totalD){
                this.fetchCalRecordFromTbl();
            }
        }
    }

    getLatestWeight(){
        this.db.fetchLatestWeight(localStorage.getItem("userID")).then(wlSucc =>{
            this.copyWeightArr = wlSucc;
            if(this.copyWeightArr.length==0)
                this.calculateAllData(0);
            else{
                console.log("weight -> "+parseInt(this.copyWeightArr[0].weight));
                this.calculateAllData(parseInt(this.copyWeightArr[0].weight));
            }
        }).catch(wLErr =>{
            console.log("wLErr -> "+JSON.stringify(wLErr));
            return 0;
        });
    }

    calculateAllData(weight){
        let BMR = 0;
        let age = this.calcDate(new Date().getTime(),parseInt(this.userData.dob));
        let height = this.userData.height;
        console.log("weight -> "+weight+" age -> "+age+" height -> "+height);
        if(parseInt(this.userData.gender)==1){
            if(parseInt(this.userData.unitOfMeasurement)==1){
                // metric calculation
                BMR = Math.round((88.3 + (13.4*weight) + (4.8*height))-(5.7*age));
                this.calculateTDEE(BMR);
            }else if(parseInt(this.userData.unitOfMeasurement)==2){
                // imprerial calculation
                BMR = Math.round((88.3 + (13.4*(weight/2.2)) + (4.8*(height*2.54)))-(5.7*age));
                this.calculateTDEE(BMR);
            }
        }else if(parseInt(this.userData.gender)==2){
            if(parseInt(this.userData.unitOfMeasurement)==1){
                // metric calculation
                BMR = Math.round((447.6 + (9.2*weight) + (3.1*height))-(4.3*age));
                this.calculateTDEE(BMR);
            }else if(parseInt(this.userData.unitOfMeasurement)==2){
                // imprerial calculation
                BMR = Math.round((447.6 + (9.2*(weight/2.2)) + (3.1*(height*2.54)))-(4.3*age));
                this.calculateTDEE(BMR);
            }
        }
    }

    calcDate(today,past) {
        var diff = Math.round(today - past);
        var day = 1000 * 60 * 60 * 24;    
        var days = Math.round(diff/day);
        var months = Math.round(days/31);
        var years = Math.round(months/12);    
        return years
    }

    calculateTDEE(bmr){
        console.log("BMR -> "+bmr);
        if(parseInt(this.userData.activityLevel)==1){
            this.calculateTotalCal(bmr*1.2);
        }else if(parseInt(this.userData.activityLevel)==2){
            this.calculateTotalCal(bmr*1.375);
        }else if(parseInt(this.userData.activityLevel)==3){
            this.calculateTotalCal(bmr*1.55);
        }else if(parseInt(this.userData.activityLevel)==4){
            this.calculateTotalCal(bmr*1.725);
        }else if(parseInt(this.userData.activityLevel)==5){
            this.calculateTotalCal(bmr*1.9);
        }
    }

    calculateTotalCal(tdee){
        tdee = Math.round(tdee);
        console.log("TDEE -> "+tdee);
        if(parseInt(this.userData.weightGoal)==1){
            if(parseInt(this.userData.paceOfProgress)==1){
                this.insTodayCalorieIntoTbl(tdee-300);
            }else if(parseInt(this.userData.paceOfProgress)==2){
                this.insTodayCalorieIntoTbl(tdee-500);
            }else if(parseInt(this.userData.paceOfProgress)==3){
                this.insTodayCalorieIntoTbl(tdee-750);
            }
        }else if(parseInt(this.userData.weightGoal)==2){
            if(parseInt(this.userData.paceOfProgress)==1){
                this.insTodayCalorieIntoTbl(tdee+300);
            }else if(parseInt(this.userData.paceOfProgress)==2){
                this.insTodayCalorieIntoTbl(tdee+500);
            }else if(parseInt(this.userData.paceOfProgress)==3){
                this.insTodayCalorieIntoTbl(tdee+750);
            }
        }else if(parseInt(this.userData.weightGoal)==3){
            this.insTodayCalorieIntoTbl(tdee);
        }
    }

    insTodayCalorieIntoTbl(totalCal){
        console.log("totalCal -> "+JSON.stringify(totalCal));
        let arr = [{
            totalCal: totalCal,
            calConsumed: 0,
            calDate: new Date().getTime()
        }];
        this.db.insIntoUserCaloriesTbl(parseInt(localStorage.getItem("userID")),arr).then(insCalSucc =>{
            this.fetchCalRecordFromTbl();
        }).catch(insCalErr =>{
            console.log('insCalErr => '+JSON.stringify(insCalErr));
        });
    }   
    
    funcForFoodLogHis(){
        this.db.fetchDataFromLogYourOwnFoodTbl(parseInt(localStorage.getItem("userID"))).then(logHisSucc =>{
            this.foodHisTblArr = logHisSucc;
            this.logFoodTblArr = [];
            for(var i=0; i<this.foodHisTblArr.length; i++){
                var logIndex = this.logFoodTblArr.findIndex((x) => new Date(x.date).toDateString()===new Date(this.foodHisTblArr[i].takenTime).toDateString());
                if(logIndex == -1){
                    this.logFoodTblArr.push({
                        date: this.foodHisTblArr[i].takenTime,
                        logArr: [{
                            food: this.foodHisTblArr[i].foodName,
                            calorie: this.foodHisTblArr[i].foodCal,
                        }]
                    });
                }else{
                    this.logFoodTblArr[logIndex].logArr.push({food: this.foodHisTblArr[i].foodName,calorie: this.foodHisTblArr[i].foodCal});
                }
                if(i == this.foodHisTblArr.length-1){
                    this.logInd = this.logFoodTblArr.length-1;
                }
            }
        }).catch(logHisErr =>{
            console.log("logHisErr => "+JSON.stringify(logHisErr));
        });
    }   
    
    fetchCalRecordFromTbl(){
        this.db.fetchDataFromUserCaloriesTbl(localStorage.getItem("userID")).then(calSucc =>{
            this.calTblArr = calSucc;
            this.calListArr = [];
            for(var i=0; i<this.calTblArr.length; i++){
                this.calListArr.push({
                    date: this.calTblArr[i].calorieDate,
                    totalCal: this.calTblArr[i].totalCalorie,
                    calConsumed: this.calTblArr[i].calorieConsumed
                });
                if(i==this.calTblArr.length-1){
                    if(this.calListArr.length>0){
                        this.nutriInd = this.calListArr.length-1;
                        this.nutriDate = this.calListArr[this.nutriInd].date;
                        this.nutriTotalCal = this.calListArr[this.nutriInd].totalCal;
                        this.nutriCalConsumed = this.calListArr[this.nutriInd].calConsumed;
                        (this.calListArr[this.nutriInd].totalCal - this.calListArr[this.nutriInd].calConsumed)>0?this.nutriCalRem = parseFloat((this.calListArr[this.nutriInd].totalCal - this.calListArr[this.nutriInd].calConsumed).toFixed(2)):this.nutriCalRem = 0;
                    }
                }
            }
        }).catch(calErr =>{
            console.log("calErr => "+JSON.stringify(calErr));
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad NutritionPage');
    }

    todaymeal(){
        this.app.getRootNav().push(TodaysMealsPage);
    }
    
    logFood(){
        this.app.getRootNav().push(LogyourOwnFoodPage);
    }

    nutriChangeFunc(type){
        if(type==1){
            if(this.nutriInd>0){
                this.nutriInd--;
                this.nutriDate = this.calListArr[this.nutriInd].date;
                this.nutriTotalCal = this.calListArr[this.nutriInd].totalCal;
                this.nutriCalConsumed = this.calListArr[this.nutriInd].calConsumed;
                (this.calListArr[this.nutriInd].totalCal - this.calListArr[this.nutriInd].calConsumed)>0?this.nutriCalRem = parseFloat((this.calListArr[this.nutriInd].totalCal - this.calListArr[this.nutriInd].calConsumed).toFixed(2)):this.nutriCalRem = 0;
            }
        }
        if(type==2){
            if(this.nutriInd<this.calListArr.length-1){
                this.nutriInd++;
                this.nutriDate = this.calListArr[this.nutriInd].date;
                this.nutriTotalCal = this.calListArr[this.nutriInd].totalCal;
                this.nutriCalConsumed = this.calListArr[this.nutriInd].calConsumed;
                (this.calListArr[this.nutriInd].totalCal - this.calListArr[this.nutriInd].calConsumed)>0?this.nutriCalRem = parseFloat((this.calListArr[this.nutriInd].totalCal - this.calListArr[this.nutriInd].calConsumed).toFixed(2)):this.nutriCalRem = 0;
            }
        }
    }

    foodLogDateChangeFunc(type){
        if(type==1){
            if(this.logInd>0)
                this.logInd--;
        }else{
            if(this.logInd!=this.logFoodTblArr.length-1)
                this.logInd++;
        }
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
