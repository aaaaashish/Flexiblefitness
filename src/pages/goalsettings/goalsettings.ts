import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { ServicesProvider } from '../../providers/services/services';
import { LocalDbProvider } from '../../providers/local-db/local-db';

@IonicPage()
@Component({
    selector: 'page-goalsettings',
    templateUrl: 'goalsettings.html',
})
export class GoalsettingsPage {
    loading: any;
    userData:any;
    numRegxForDot = (/^(\d+)?([.]?\d{0,1})?$/);
    alertMsg = "";
    bodyFatDiv = false;
    bodyFatErr = false;
    activityLevelDiv = false;
    weightGoalDiv = false;
    paceOfProgressDiv = false;
    workoutRemDiv = false;
    user = {
        bodyfatValue:"",
        actLevel:"1",
        weightGoalVal:"1",
        paceOfProgressVal:"1",
        hrValue:null
    };
    copyWeightArr:any;
    latestCalObj:any;
    calUniID = 0; 


    constructor(public navCtrl: NavController, public navParams: NavParams, public nav: Nav, public globalSer: ServicesProvider, public toastCtrl: ToastController, public db: LocalDbProvider, public loader: LoadingController, public alertCtrl: AlertController) {
        this.presentLoading();
        this.db.fetchDataFromUsersTbl(localStorage.getItem("userID")).then(fSucc =>{
            this.loading.dismiss();
            //console.log("fUSucc=> "+JSON.stringify(fSucc));
            this.userData = fSucc;
            this.userData.activityLevel==0?this.user.actLevel="1":this.user.actLevel=this.userData.activityLevel;
            this.userData.weightGoal==0?this.user.weightGoalVal="1":this.user.weightGoalVal=this.userData.weightGoal;
            this.userData.paceOfProgress==0?this.user.paceOfProgressVal="1":this.user.paceOfProgressVal=this.userData.paceOfProgress;
        }).catch(fErr =>{
            this.loading.dismiss();
            console.log("fUErr=> "+JSON.stringify(fErr));
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad GoalsettingsPage');
    }

    backBtnFunc(){
        this.navCtrl.pop();
    }

    bodyFatClick(type){
        type==1?this.bodyFatDiv=true:this.bodyFatDiv=false;
    }

    actLevelClickFunc(type){
        type==1?this.activityLevelDiv=true:this.activityLevelDiv=false;
    }

    weightGoalClickFunc(type){
        type==1?this.weightGoalDiv=true:this.weightGoalDiv=false;
    }

    paceProClickFunc(type){
        type==1?this.paceOfProgressDiv=true:this.paceOfProgressDiv=false;
    }

    workOutRemClickFunc(type){
        type==1?this.workoutRemDiv=true:this.workoutRemDiv=false;
    }

    showErr(){
        let toast = this.toastCtrl.create({
            message: this.alertMsg,
            duration: 3000,
            position: 'bottom',
            cssClass: "ff-toast"
        });
        toast.present();
    }

    checkValueFunc(){
        if(this.user.bodyfatValue!=""){
            if(parseFloat(this.user.bodyfatValue)==0){
                this.bodyFatErr = true;
                return;
            }else if(this.user.bodyfatValue=="."){
                this.bodyFatErr = true;
                return;
            }else if(!this.numRegxForDot.test(this.user.bodyfatValue)){
                this.bodyFatErr = true;
                return;
            }else if(parseFloat(this.user.bodyfatValue)>100){
                this.bodyFatErr = true;
                return;
            }else{
                this.bodyFatErr = false;
            }
        }else{
            this.bodyFatErr = false;
        }
    }

    updateFunc(){
        if(this.bodyFatDiv==false && this.activityLevelDiv==false && this.weightGoalDiv==false && this.paceOfProgressDiv==false && this.workoutRemDiv==false){
            console.log("nothing will be updated");
            this.navCtrl.pop();
        }else{
            console.log("else called");
            let clmnArr = [];
            let valueArr = [];
            if(this.bodyFatDiv==true){
                if(this.user.bodyfatValue!=""){
                    if(this.bodyFatErr==true){
                        this.alertMsg = "Enter valid bodyfat percentage.";
                        this.showErr();
                        return;
                    }else{
                        clmnArr.push('isBodyFatPercentageKnown');
                        valueArr.push(true);
                    }
                }
            }
            if(this.activityLevelDiv==true){
                clmnArr.push('activityLevel');
                valueArr.push(this.user.actLevel);
            }
            if(this.weightGoalDiv==true){
                clmnArr.push('weightGoal');
                valueArr.push(this.user.weightGoalVal);
            }
            if(this.paceOfProgressDiv==true){
                clmnArr.push('paceOfProgress');
                valueArr.push(this.user.paceOfProgressVal);
            }
            if(this.workoutRemDiv==true){
                if(this.user.hrValue!=null){
                    clmnArr.push('workoutReminder','workoutReminderTime');
                    valueArr.push(true,this.user.hrValue);
                }
            }
            if(clmnArr.length>0){
                clmnArr.push('initDate');
                valueArr.push(new Date().getTime(),parseInt(localStorage.getItem("userID")));
                this.updateGoalSetting(clmnArr,valueArr);
            }else{
                console.log("nothing will be updated");
                this.navCtrl.pop();
            }
        }
    }

    updateGoalSetting(clmn,val){
        this.presentLoading();
        this.db.updateTbl("Users","userID",clmn,val).then(upSucc =>{
            console.log("upSucc -> "+JSON.stringify(upSucc));
            if(this.activityLevelDiv==true || this.weightGoalDiv==true || this.paceOfProgressDiv==true)
                this.updateTodayCalorie();
            if(this.user.bodyfatValue!=""){
                this.insIntoBodyfatTbl();
            }else{
                this.loading.dismiss();
                let upAlert = this.alertCtrl.create({
                    title: 'FLEXIBLE FITNESS',            
                    subTitle: "Your goal setting has been updated successfully.",
                    enableBackdropDismiss: false,
                    buttons: [{
                        text: 'OK',
                        handler: () => {
                            this.navCtrl.pop();
                        }
                    }]        
                });
                upAlert.present();
            }
        }).catch(upErr =>{
            this.loading.dismiss();
            console.log("upErr -> "+JSON.stringify(upErr));
        });
    }

    updateTodayCalorie(){
        this.db.fetchLatestRecordFromUserCaloriesTbl(localStorage.getItem("userID")).then(lCalSucc =>{
            this.latestCalObj = lCalSucc;
            console.log("latestCalObj => "+JSON.stringify(this.latestCalObj));
            this.calUniID = this.latestCalObj[0].uniID;
            this.getLatestWeight();
        }).catch(lCalErr =>{
            console.log("lCalErr => "+JSON.stringify(lCalErr));
        });
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
        if(parseInt(this.user.actLevel)==1){
            this.calculateTotalCal(bmr*1.2);
        }else if(parseInt(this.user.actLevel)==2){
            this.calculateTotalCal(bmr*1.375);
        }else if(parseInt(this.user.actLevel)==3){
            this.calculateTotalCal(bmr*1.55);
        }else if(parseInt(this.user.actLevel)==4){
            this.calculateTotalCal(bmr*1.725);
        }else if(parseInt(this.user.actLevel)==5){
            this.calculateTotalCal(bmr*1.9);
        }
    }

    calculateTotalCal(tdee){
        tdee = Math.round(tdee);
        console.log("TDEE -> "+tdee);
        if(parseInt(this.user.weightGoalVal)==1){
            if(parseInt(this.user.paceOfProgressVal)==1){
                this.insTodayCalorieIntoTbl(tdee-300);
            }else if(parseInt(this.user.paceOfProgressVal)==2){
                this.insTodayCalorieIntoTbl(tdee-500);
            }else if(parseInt(this.user.paceOfProgressVal)==3){
                this.insTodayCalorieIntoTbl(tdee-750);
            }
        }else if(parseInt(this.user.weightGoalVal)==2){
            if(parseInt(this.user.paceOfProgressVal)==1){
                this.insTodayCalorieIntoTbl(tdee+300);
            }else if(parseInt(this.user.paceOfProgressVal)==2){
                this.insTodayCalorieIntoTbl(tdee+500);
            }else if(parseInt(this.user.paceOfProgressVal)==3){
                this.insTodayCalorieIntoTbl(tdee+750);
            }
        }else if(parseInt(this.user.weightGoalVal)==3){
            this.insTodayCalorieIntoTbl(tdee);
        }
    }

    insTodayCalorieIntoTbl(totalCal){
        console.log("totalCal -> "+JSON.stringify(totalCal));
        let clmnArr = ['totalCalorie','calorieDate'];
        let dataArr = [
            totalCal,
            new Date().getTime(),
            parseInt(localStorage.getItem("userID")),
            this.calUniID
        ];
        this.db.updateOfflineWorkoutTbl('userCaloriesTbl','userID','uniID',clmnArr,dataArr).then(uSucc =>{
            console.log("user calories updated");
        }).catch(uErr =>{
            console.log("uErr -> "+JSON.stringify(uErr));
        });
    }

    insIntoBodyfatTbl(){
        let arr = [{
            userID: parseInt(localStorage.getItem("userID")),
            bfPercentage: this.user.bodyfatValue,
            bfPercentageCreationTime: new Date().getTime()
        }];
        this.db.insIntoBodyfatListDB(parseInt(localStorage.getItem("userID")),arr).then(insBSucc =>{
            console.log("insBSucc -> "+JSON.stringify(insBSucc));
            this.loading.dismiss();
            let upAlert = this.alertCtrl.create({
                title: 'FLEXIBLE FITNESS',            
                subTitle: "Your goal setting has been updated successfully.",
                enableBackdropDismiss: false,
                buttons: [{
                    text: 'OK',
                    handler: () => {
                        this.navCtrl.pop();
                    }
                }]        
            });
            upAlert.present();
        }).catch(insBErr =>{
            this.loading.dismiss();
            console.log("insBErr -> "+JSON.stringify(insBErr));
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
}
