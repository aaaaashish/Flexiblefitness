import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { WorkoutVideoPage } from '../workout-video/workout-video';
import { ServicesProvider } from '../../providers/services/services';
import { LocalDbProvider } from '../../providers/local-db/local-db';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

@IonicPage()
@Component({
    selector: 'page-workout-detail',
    templateUrl: 'workout-detail.html',
})
export class WorkoutDetailPage {
    loading:any;
    dwnLoading:any;
    workoutImg:any = "";
    workoutName:any = "";
    workoutDesc:any = "";
    workoutRule:any = "";
    fetObj:any;
    workoutTblObj:any;
    exeApiObj:any;
    userData:any;
    downloadObj:any;
    dwnInd = 0;
    currUserType:any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public globalSer: ServicesProvider, public loader: LoadingController, public toastCtrl: ToastController, public db: LocalDbProvider, public transfer: FileTransfer, public file: File) {
    }

    ionViewWillEnter(){
        console.log("workout detail will enter called");
        this.fetchDetails();
        this.fetchDataFromUsersTbl();
    }

    ionViewDidLoad() {
      console.log('ionViewDidLoad WorkoutDetailPage');
    }

    goBackFunc(){
        this.navCtrl.pop();
    }

    fetchDataFromUsersTbl(){
        this.db.fetchDataFromUsersTbl(localStorage.getItem("userID")).then(fSucc =>{
            //console.log("fUSucc=> "+JSON.stringify(fSucc));
            this.userData = fSucc;
            this.userData.userType=="Free User"?this.currUserType="Free":this.currUserType="Paid";
        }).catch(fErr =>{
            console.log("fUErr=> "+JSON.stringify(fErr));
        });
    }

    fetchDetails(){
        console.log("type=> "+this.globalSer.currWorkout.name);
        this.presentLoading();
        this.db.fetchDatafromWorkoutDetailsTbl(parseInt(localStorage.getItem("userID")),this.globalSer.currWorkout.name).then(feSucc =>{
            console.log("feSucc -> ");
            this.fetObj = feSucc[0];
            this.workoutImg = this.fetObj.wImage;
            this.workoutName = this.fetObj.wName;
            this.workoutDesc = this.fetObj.wDesc;
            this.workoutRule = this.fetObj.wRules;
            this.loading.dismiss();
        }).catch(feErr =>{
            this.loading.dismiss();
            console.log("feErr -> "+JSON.stringify(feErr));
        });
    }

    startWorkoutFunc(){
        console.log("WIP -> "+this.globalSer.currWorkout.name);
        if(this.globalSer.networkStatus){
            if(this.globalSer.currWorkout.name=="CARDIO"){            
                this.getExerciseFromAPI("getCardioWorkoutList?userID=","CARDIO");
            }else if(this.globalSer.currWorkout.name=="GYM"){
                this.getExerciseFromAPI("getGymWorkoutList?userID=","GYM");
            }else if(this.globalSer.currWorkout.name=="OTG"){
               this.getExerciseFromAPI("getOtgWorkoutList?userID=","OTG");
            }else if(this.globalSer.currWorkout.name=="SELF"){     
               this.getExerciseFromAPI("getSelfDefenceWorkoutList?userID=","SELF");
            }
        }else{
            this.presentLoading();
            this.db.fetchDataFromOfflineSavedWorkoutTbl(localStorage.getItem("userID")).then(fwSucc =>{
                this.workoutTblObj = fwSucc;
                if(this.workoutTblObj.length!=0){
                    this.loading.dismiss();
                    if(this.workoutTblObj[0].workoutType==this.globalSer.currWorkout.name){
                        this.globalSer.exercisesArr = this.workoutTblObj;
                        this.navCtrl.push(WorkoutVideoPage);
                    }else{
                        this.showErrToast("You still have some exercises pending for other workout. Complete it and then start new workout in offline mode.");
                    }
                }else{
                    this.loading.dismiss();
                    this.showErrToast("Currently you are in offline mode. To start workout, download workout in online mode.");
                }
            }).catch(fwErr =>{
                this.loading.dismiss();
                console.log("fwErr => "+JSON.stringify(fwErr));
            });
        }
    }

    getExerciseFromAPI(api,type){
        this.presentLoading();
        this.globalSer.getMethod(api+localStorage.getItem("userID")).then(apiSucc =>{
            //console.log("apiSucc => "+JSON.stringify(apiSucc));
            this.exeApiObj = apiSucc;
            if(this.exeApiObj.statusCode=="200"){
                let wID;
                if(type=="CARDIO"){
                    wID = this.exeApiObj.data[0].cardioWorkoutID
                }else if(type=="GYM"){
                    wID = this.exeApiObj.data[0].gymWorkoutID
                }else if(type=="OTG"){
                    wID = this.exeApiObj.data[0].oTGWorkoutID
                }else if(type=="SELF"){
                    wID = this.exeApiObj.data[0].selfDefenceWorkoutID
                }
                this.exeApiObj = this.exeApiObj.data[0].exercises;
                this.globalSer.exercisesArr = [];
                for(var i=0; i<this.exeApiObj.length; i++){
                    this.globalSer.exercisesArr.push({
                        workoutID: wID,
                        workoutType: type,
                        exID: this.exeApiObj[i].exerciseID,
                        exName: this.exeApiObj[i].exerciseName,
                        exDesc: this.exeApiObj[i].description,
                        exRules: this.exeApiObj[i].rules,
                        exVideo: parseInt(this.userData.gender)==1?this.exeApiObj[i].exerciseVideo_Male:this.exeApiObj[i].exerciseVideo_Female,
                        isWatched: this.exeApiObj[i].isWatched
                    });
                    if(i==this.exeApiObj.length-1){
                        this.loading.dismiss();
                        //console.log("exercisesArr => "+JSON.stringify(this.globalSer.exercisesArr));
                        this.navCtrl.push(WorkoutVideoPage);
                    }
                }
            }else{
                this.loading.dismiss();
                console.log("other resp for get exe => "+JSON.stringify(this.exeApiObj));
            }
        }).catch(apiErr =>{
            this.loading.dismiss();
            console.log("apiErr => "+JSON.stringify(apiErr));
        });
    }

    downloadVideo(){
        this.presentLoading();
        this.db.fetchDataFromOfflineSavedWorkoutTbl(localStorage.getItem("userID")).then(fwSucc =>{
            this.workoutTblObj = fwSucc;
            if(this.workoutTblObj.length!=0){
                this.loading.dismiss();
                this.showErrToast("Currently exercises of one workout is available in offline mode. Firstly, complete it and then download other.");
            }else{
                if(this.globalSer.networkStatus){
                    if(this.globalSer.currWorkout.name=="CARDIO"){            
                        this.downloadVideoForOffline("getCardioWorkoutList?userID=","CARDIO");
                    }else if(this.globalSer.currWorkout.name=="GYM"){
                        this.downloadVideoForOffline("getGymWorkoutList?userID=","GYM");
                    }else if(this.globalSer.currWorkout.name=="OTG"){
                       this.downloadVideoForOffline("getOtgWorkoutList?userID=","OTG");
                    }else if(this.globalSer.currWorkout.name=="SELF"){     
                       this.downloadVideoForOffline("getSelfDefenceWorkoutList?userID=","SELF");
                    }
                }else{
                    this.loading.dismiss();
                    this.showErrToast("Please check your internet connection.");
                }
            }
        }).catch(fwErr =>{
            this.loading.dismiss();
            console.log("fwErr => "+JSON.stringify(fwErr));
        });
    }

    downloadVideoForOffline(api,type){
        this.globalSer.getMethod(api+localStorage.getItem("userID")).then(dwSucc =>{
            this.downloadObj = dwSucc;
            if(this.downloadObj.statusCode=="200"){
                this.loading.dismiss();
                let wID;
                if(type=="CARDIO"){
                    wID = this.downloadObj.data[0].cardioWorkoutID
                }else if(type=="GYM"){
                    wID = this.downloadObj.data[0].gymWorkoutID
                }else if(type=="OTG"){
                    wID = this.downloadObj.data[0].oTGWorkoutID
                }else if(type=="SELF"){
                    wID = this.downloadObj.data[0].selfDefenceWorkoutID
                }
                this.recurCallForDownload(wID,this.downloadObj.data[0].exercises,this.downloadObj.data[0].exercises.length,type);
                this.dwnLoader();
                this.dwnLoading.data.content = '('+(this.dwnInd+1)+'/'+this.downloadObj.data[0].exercises.length+') downloading...';
            }else{
                this.loading.dismiss();
                console.log("other response for download => "+JSON.stringify(this.downloadObj));
            }
        }).catch(dwErr =>{
            this.loading.dismiss();
            console.log("dwErr => "+JSON.stringify(dwErr));
        });
    }

    recurCallForDownload(wID,arr,total,type){
        if(this.dwnInd<total){
            const fileTransfer: FileTransferObject = this.transfer.create();
            const url = parseInt(this.userData.gender)==1?arr[this.dwnInd].exerciseVideo_Male:arr[this.dwnInd].exerciseVideo_Female;
            const name = new Date().getTime()+".mp4"
            fileTransfer.download(url, this.file.dataDirectory + name).then((entry) => {
                console.log('download complete for ->  ' + this.dwnInd);
                //this.videoURL1=this.domSanitizer.bypassSecurityTrustResourceUrl(entry.nativeURL.substr(7));
                let data = {
                    userID: parseInt(localStorage.getItem("userID")),
                    wID: wID,
                    wType: type,
                    exID: arr[this.dwnInd].exerciseID,
                    exName: arr[this.dwnInd].exerciseName,
                    exDesc: arr[this.dwnInd].description,
                    exRules: arr[this.dwnInd].rules,
                    exVideo: entry.nativeURL.substr(7),
                    initDate: new Date().getTime()
                }
                this.db.insIntoOfflineSavedWorkoutTbl(data).then(wInsSucc =>{
                    this.dwnInd++;
                    if(this.dwnInd<total)
                        this.dwnLoading.data.content = '('+(this.dwnInd+1)+'/'+total+') downloading...';
                    if(this.dwnInd==total)
                        this.dwnLoading.data.content = '('+(this.dwnInd)+'/'+total+') downloading...';
                    this.recurCallForDownload(wID,arr,total,type);
                }).catch(wInsErr =>{
                    console.log('wInsErr -> ' + JSON.stringify(wInsErr));
                    this.dwnLoading.dismiss();
                });
            }, (error) => {
                console.log('download error -> ' + JSON.stringify(error));
                this.dwnLoading.dismiss();
            });
        }else{
            this.dwnLoading.dismiss();
            console.log("recur done for download video");
            this.dwnInd = 0;
            this.showErrToast("Your workout exercises have been downloaded successfully.");
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

    dwnLoader(){
        this.dwnLoading = this.loader.create({
            spinner: "crescent",
            //content: '('+curr+'/'+total+') downloading...',
            content: "",
            cssClass: "ff-loader"
        });
        this.dwnLoading.present();
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
