import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { Chart } from 'chart.js';
import { App } from 'ionic-angular/components/app/app';
import { UploadProgresspicturePage } from '../upload-progresspicture/upload-progresspicture';
import { Slides, ToastController, LoadingController } from 'ionic-angular';
import { LocalDbProvider } from '../../providers/local-db/local-db';

@IonicPage()
@Component({
    selector: 'page-hoome',
    templateUrl: 'hoome.html',
})
export class HoomePage {
    loading:any;
    user = {
        "weight":"",
        "bodyFat":""
    }
    numRegxForDot = (/^(\d+)?([.]?\d{0,1})?$/);
    numRegx = (/^[0-9]*$/);
    weightErr = false;
    weightErrMsg = "";
    bodyFatErr = false;
    weightGrapgh = false;
    bodyFatGrapgh = false;
    unitOfWeight:any;
    userData:any;
    sliderImgArr:any = [];
    fwArr:any = [];
    fBodyArr:any = [];
    fetchArr:any = [];
    latestWeightArr:any = [];
    latestBFArr:any = [];
    @ViewChild(Slides) slides: Slides;
    @ViewChild('lineCanvas1') lineCanvas1;
    @ViewChild('lineCanvas2') lineCanvas2;
    lineChart: any;
    tooltipDiv = false;
    weightQueDiv = false;
    copyWeightArr:any = [];
    tipContent:any = "";
    tipSuccObj:any;
    latestCalObj:any;
    calUniID:any;
    calorieStatus:any = "";

    constructor(public navCtrl: NavController, public navParams: NavParams, public app: App, public events: Events, public db: LocalDbProvider, public loader: LoadingController, public toastCtrl: ToastController) {
        
    }
        
    ionViewWillEnter(){
        console.log('ionViewWillEnter HoomePage');
        this.funcToCheckLatestWeight();
        this.fetchProgressPic();
        this.fetchDataFromUsersTbl();
        //this.ionViewDidLoad()
        this.fetchWeight();
        this.fetchBodyfat();
        this.getDailyTipFromTbl();
        this.calorieStatus = "";
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad HoomePage');
    }

    funcToCheckLatestWeight(){
        this.db.fetchLatestWeight(localStorage.getItem("userID")).then(wlSucc =>{
            this.copyWeightArr = wlSucc;
            if(this.copyWeightArr.length==0)
                this.weightQueDiv=true;
            else{
                let today = new Date();
                let past = new Date(this.copyWeightArr[0].creationTime);
                today.toDateString()===past.toDateString()?this.weightQueDiv=false:this.weightQueDiv=true;
            }
        }).catch(wLErr =>{
            console.log("wLErr -> "+JSON.stringify(wLErr));
        });
    }

    fetchDataFromUsersTbl(){
        this.db.fetchDataFromUsersTbl(localStorage.getItem("userID")).then(fSucc =>{
            //console.log("fUSucc=> "+JSON.stringify(fSucc));
            this.userData = fSucc;
            this.userData.unitOfMeasurement==1?this.unitOfWeight="kg":this.unitOfWeight="lb";
            console.log("unitOfWeight -> "+this.unitOfWeight);
            if(this.userData.tooltipStatus=="false" || this.userData.tooltipStatus==false){
                let today = new Date();
                let past = new Date(parseInt(this.userData.tooltipTime));
                today.toDateString()===past.toDateString()?this.tooltipDiv=false:this.tooltipDiv=true;
            }else
                this.tooltipDiv=true;
        }).catch(fErr =>{
            console.log("fUErr=> "+JSON.stringify(fErr));
        });
    }

    fetchProgressPic(){
        this.presentLoading();
        this.db.fetchDataFromProgressPicTbl(localStorage.getItem("userID")).then(fSucc =>{
            this.fetchArr = fSucc;
            if(this.fetchArr.length!=0){
                this.sliderImgArr = [];
                for(var i=0; i<this.fetchArr.length; i++){
                    this.sliderImgArr.push({
                        img: this.fetchArr[i].picture
                    });
                    if(i==this.fetchArr.length-1)
                        this.loading.dismiss();
                }
            }else{
                this.loading.dismiss();
            }
        }).catch(fErr =>{
            this.loading.dismiss();
            console.log("Home_fErr => "+JSON.stringify(fErr));
        });
    }

    fetchWeight(){
        this.db.fetchDataFromWeightListDB(localStorage.getItem("userID")).then(fwSucc =>{
            console.log("fwSucc=> ");
            this.fwArr = fwSucc;
            if(this.fwArr.length!=0){
                this.weightGrapgh = true;
                let dataArr = [];
                let timeArr = [];
                for(var i=0; i<this.fwArr.length; i++){
                    dataArr.push(parseInt(this.fwArr[i].weight));
                    timeArr.push(new Date(this.fwArr[i].creationTime).toDateString().substr(4));
                    if(i==this.fwArr.length-1)
                        this.drawWeightGraph(dataArr,timeArr);
                }
            }else
                this.weightGrapgh = false;    
        }).catch(fwErr =>{
            console.log("fwErr=> "+JSON.stringify(fwErr));
        });
    }

    fetchBodyfat(){
        this.db.fetchDataFromBodyfatListDB(localStorage.getItem("userID")).then(fbSucc =>{
            this.fBodyArr = fbSucc;
            console.log("fbSucc=> ");
            if(this.fBodyArr.length!=0){
                this.bodyFatGrapgh = true;
                let dataArr = [];
                let timeArr = [];
                for(var i=0; i<this.fBodyArr.length; i++){
                    dataArr.push(parseFloat(this.fBodyArr[i].bfPercentage));
                    timeArr.push(new Date(parseInt(this.fBodyArr[i].bfPercentageCreationTime)).toDateString().substr(4));
                    if(i==this.fBodyArr.length-1)
                        this.drawBodyfatGraph(dataArr,timeArr);
                }
            }else
                this.bodyFatGrapgh = false;    
        }).catch(fbErr =>{
            console.log("fwErr=> "+JSON.stringify(fbErr));
        });
    }

    drawWeightGraph(data,time) {
        console.log("drawWeightGraph called");
        var weightConfig = {
            type: 'line',
            data: {
                labels: time,
                datasets: [{
                    label: "Bodyfat",
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: "#fff",
                    borderColor: "#D3D3D3",
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: "rgba(75,192,192,1)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 5,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(75,192,192,1)",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointHoverBorderWidth: 5,
                    pointRadius: 5,
                    pointHitRadius: 10,
                    data: data,
                    spanGaps: false,
                }]
            },
            options: {
                legend: {
                    display: false
                },
                tooltips: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return tooltipItem.yLabel;
                        }
                    }
                }
            }
        };
        setTimeout(function(){
            var weightCtx = document.getElementById("weightChart");
            new Chart(weightCtx, weightConfig);
        },1000);
    }

    drawBodyfatGraph(data,time) {
        console.log('drawBodyfatGraph called');
        var config = {
            type: 'line',
            data: {
                labels: time,
                datasets: [{
                    label: "Bodyfat",
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: "#fff",
                    borderColor: "#D3D3D3",
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: "rgba(75,192,192,1)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 5,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(75,192,192,1)",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointHoverBorderWidth: 5,
                    pointRadius: 5,
                    pointHitRadius: 10,
                    data: data,
                    spanGaps: false,
                }]
            },
            options: {
                legend: {
                    display: false
                },
                tooltips: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return tooltipItem.yLabel;
                        }
                    }
                }
            }
        };
        setTimeout(function(){
            var ctx = document.getElementById("bodyfatChart");
            new Chart(ctx, config);
        },1000);
    }

    getDailyTipFromTbl(){
        this.db.fetchDataFromDailyTipTbl().then(tipSucc =>{
            this.tipSuccObj = tipSucc;
            this.tipContent = this.tipSuccObj.dailyTip;
        }).catch(tipErr =>{
            console.log("tipErr -> "+JSON.stringify(tipErr));
        });
    }

    weightBlurFunc(){
        if(this.user.weight!=""){
            if(this.userData.unitOfMeasurement==1){
                if(parseFloat(this.user.weight)==0){
                    this.weightErr = true;
                    this.weightErrMsg = "Enter weight between 40 and 135 kg.";
                    return;
                }else if(!this.numRegx.test(this.user.weight) || parseFloat(this.user.weight)<40 || parseFloat(this.user.weight)>135){
                    this.weightErr = true;
                    this.weightErrMsg = "Enter weight between 40 and 135 kg.";
                    return;
                }else{
                    this.weightErr = false;
                    this.weightErrMsg = "";
                }
            }else if(this.userData.unitOfMeasurement==2){
                if(parseFloat(this.user.weight)==0){
                    this.weightErr = true;
                    this.weightErrMsg = "Enter weight between 90 and 300 lb.";
                    return;
                }else if(!this.numRegx.test(this.user.weight) || parseFloat(this.user.weight)<90 || parseFloat(this.user.weight)>300){
                    this.weightErr = true;
                    this.weightErrMsg = "Enter weight between 90 and 300 lb.";
                    return;
                }else{
                    this.weightErr = false;
                    this.weightErrMsg = "";
                }
            }else{
                console.log("noting find");
            }
        }else{
            this.weightErr = false;
            this.weightErrMsg = "";
        }
    }

    weightSaveFunc(){
        this.presentLoading();
        this.db.fetchLatestWeight(localStorage.getItem("userID")).then(feWSucc =>{
            console.log("feWSucc -> "+JSON.stringify(feWSucc));
            this.latestWeightArr = feWSucc;
            let weightArr = [{
                userID: parseInt(localStorage.getItem("userID")),
                weight: this.user.weight,
                creationTime: new Date().getTime()
            }];
            this.db.insIntoWeightListDB(parseInt(localStorage.getItem("userID")),weightArr).then(inSucc =>{
                console.log("weightinSucc => ");
                this.db.fetchLatestBodyfat(localStorage.getItem("userID")).then(feBfSucc =>{
                    console.log("feBfSucc -> "+JSON.stringify(feBfSucc));
                    this.latestBFArr = feBfSucc;
                    if(this.latestBFArr.length!=0){
                        // calculate body fat
                        let calculatedBFVal,latestWeight,previousWeight,weightDifference,daysDifference,previousBF,x;
                        previousWeight = parseFloat(this.latestWeightArr[0].weight);
                        latestWeight = parseFloat(this.user.weight);
                        previousBF = parseFloat(this.latestBFArr[0].bfPercentage);
                        //daysDifference = Math.round((new Date().getTime()-this.latestWeightArr[0].creationTime)/(24*60*60*1000));
                        var date1 = new Date(new Date(parseInt(this.latestWeightArr[0].creationTime)).getMonth()+1+'/'+new Date(parseInt(this.latestWeightArr[0].creationTime)).getDate()+'/'+new Date(parseInt(this.latestWeightArr[0].creationTime)).getFullYear());
                        var date2 = new Date(new Date().getMonth()+1+'/'+new Date().getDate()+'/'+new Date().getFullYear());
                        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
                        daysDifference = Math.ceil(timeDiff / (1000 * 3600 * 24));
                        console.log("daysDifference -> "+daysDifference);
                        weightDifference = previousWeight-latestWeight;
                        weightDifference = weightDifference/daysDifference;
                        console.log("weightDifference -> "+weightDifference);
                        if (weightDifference >= 0.15) {
                            x = 0.15;
                        } else {
                            x = weightDifference;
                        }
                        x = x * daysDifference;
                        x = x / previousWeight;
                        calculatedBFVal = previousBF / 100 - x;
                        calculatedBFVal = (calculatedBFVal.toFixed(4))*100;
                        console.log("calculatedBFVal -> "+calculatedBFVal);

                        let bfArr = [{
                            userID: parseInt(localStorage.getItem("userID")),
                            bfPercentage: calculatedBFVal,
                            bfPercentageCreationTime: new Date().getTime()
                        }];
                        this.db.insIntoBodyfatListDB(parseInt(localStorage.getItem("userID")),bfArr).then(insBFSucc =>{
                            this.loading.dismiss();
                            this.user.weight = "";
                            this.weightQueDiv = false;
                            this.fetchWeight();
                            this.fetchBodyfat();
                            this.funcToCheckTodayCalorie();
                        }).catch(insBFErr =>{
                            this.loading.dismiss();
                            console.log("insBFErr -> "+JSON.stringify(insBFErr));
                        });
                    }else{
                        this.loading.dismiss();
                        this.user.weight = "";
                        this.weightQueDiv = false;
                        this.fetchWeight();
                        this.fetchBodyfat();
                        this.funcToCheckTodayCalorie();
                    }
                }).catch(feBfErr =>{
                    this.loading.dismiss();
                    console.log("feBfErr -> "+JSON.stringify(feBfErr));    
                });
            }).catch(inErr =>{
                this.loading.dismiss();
                console.log("inErr => "+console.log(inErr));
            });
        }).catch(feWErr =>{
            this.loading.dismiss();
            console.log("feWErr -> "+JSON.stringify(feWErr));
        });
    }

    funcToCheckTodayCalorie(){
        this.db.fetchLatestRecordFromUserCaloriesTbl(localStorage.getItem("userID")).then(lCalSucc =>{
            this.latestCalObj = lCalSucc;
            console.log("latestCalObj => "+JSON.stringify(this.latestCalObj));
            this.calUniID = this.latestCalObj[0].uniID;
            let today = new Date();
            let last = new Date(parseInt(this.latestCalObj[0].calorieDate));
            today.toDateString()===last.toDateString()?this.calorieStatus="update":this.calorieStatus="insert";
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
        console.log("calorieStatus -> "+JSON.stringify(this.calorieStatus));
        if(this.calorieStatus=="update"){
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
        }else if(this.calorieStatus=="insert"){
            let arr = [{
                totalCal: totalCal,
                calConsumed: 0,
                calDate: new Date().getTime()
            }];
            this.db.insIntoUserCaloriesTbl(parseInt(localStorage.getItem("userID")),arr).then(insCalSucc =>{
            }).catch(insCalErr =>{
                console.log('insCalErr => '+JSON.stringify(insCalErr));
            });
        }else{
            console.log("wrong status for calorie.");
        }
    }
    
    uploadPicture(){
        this.navCtrl.push(UploadProgresspicturePage)
    }

    hidetooltip() {
        this.presentLoading();
        let clmnArr = ['tooltipStatus','tooltipTime','initDate'];
        let dataArr = [false, new Date().getTime(), new Date().getTime(), parseInt(localStorage.getItem("userID"))];
        this.db.updateTbl('Users','userID',clmnArr,dataArr).then(uSucc =>{
            this.loading.dismiss();
            //console.log("uSucc -> "+JSON.stringify(uSucc));
            this.tooltipDiv = false;
        }).catch(uErr =>{
            this.loading.dismiss();
            console.log("uErr -> "+JSON.stringify(uErr));
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
