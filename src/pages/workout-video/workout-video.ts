import { Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { AlertController, LoadingController, ToastController } from 'ionic-angular';
import { HowHardWorkoutScreenPage } from '../how-hard-workout-screen/how-hard-workout-screen';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import {DomSanitizer} from '@angular/platform-browser';
import { ServicesProvider } from '../../providers/services/services';
import { LocalDbProvider } from '../../providers/local-db/local-db';

@IonicPage()
@Component({
    selector: 'page-workout-video',
    templateUrl: 'workout-video.html',
})
export class WorkoutVideoPage {
    loading:any;
    videoURL1: any;
    buttondiv=false;
    currIndex = 0;
    btnLabel = "";
    videoURL:any;
    descContent:any;
    rulesContent:any;
    videoArr:any = [];
    watchApiObj:any;

    constructor(public navCtrl: NavController, public navParams: NavParams, 
        private camera: Camera, private alertCtrl: AlertController, private domSanitizer:DomSanitizer,
        private transfer: FileTransfer, private file: File, public viewCtrl: ViewController, 
        public events: Events, public loader: LoadingController, public toastCtrl: ToastController, public globalSer: ServicesProvider, public db: LocalDbProvider) {
        events.subscribe('tabClicked', () => {
            this.viewCtrl.dismiss();
        });
        let loading = this.loader.create({
            spinner: "crescent",
            content: 'Please wait...',
            cssClass: "ff-loader"
        });
        loading.present();
        setTimeout(function(){ 
            loading.dismiss();
        }, 5000);
    }

    ionViewWillEnter(){
        console.log("will enter called");
        this.currIndex = 0;
        this.setVideo();
    }

    goBackFunc(){
        this.navCtrl.pop();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad WorkoutVideoPage');
    }

    setVideo(){
        this.videoArr = this.globalSer.exercisesArr;
        let watchInd = 0;
        for(var i=0; i<this.videoArr.length; i++){
            if(this.videoArr[i].isWatched=="true" || this.videoArr[i].isWatched==true){
                watchInd = i;
            }
        }
        this.currIndex = watchInd;
        console.log("currIndex****** -> "+this.currIndex);
        if(this.currIndex==this.videoArr.length-1)
            this.btnLabel = "FINISH";
        else
            this.btnLabel = "NEXT";
        this.videoURL = this.domSanitizer.bypassSecurityTrustResourceUrl(this.videoArr[this.currIndex].exVideo);
        this.descContent = this.videoArr[this.currIndex].exDesc;
        this.rulesContent = this.videoArr[this.currIndex].exRules;
    }

    finish(){
        if(this.globalSer.networkStatus)
            this.callFuncForOnline();
        else
            this.callFuncForOffline();                
    }

    callFuncForOnline(){
        let data = {
            "userID": localStorage.getItem("userID"),
            "workoutID": this.videoArr[this.currIndex].workoutID,
            "feedBack": "EMPTY",
            "workoutType": this.globalSer.currWorkout.name,
            "isCompleted": false,
            "exerciseIDCompleted": this.videoArr[this.currIndex].exID.toString()
        }
        console.log("data => "+JSON.stringify(data)); 
        this.presentLoading();
        this.globalSer.postMethod(data,"saveWorkoutFeedBack").then(watchSucc =>{
            this.loading.dismiss();
            this.watchApiObj = watchSucc;
            if(this.watchApiObj.statusCode=="200"){
                if(this.currIndex==this.videoArr.length-1){
                    this.globalSer.currWorkout.ID = this.videoArr[this.currIndex].workoutID;
                    this.completeWorkoutOnline()
                }else{            
                    this.currIndex++;
                    this.videoURL = this.domSanitizer.bypassSecurityTrustResourceUrl(this.videoArr[this.currIndex].exVideo);
                    this.descContent = this.videoArr[this.currIndex].exDesc;
                    this.rulesContent = this.videoArr[this.currIndex].exRules;   
                    if(this.currIndex==this.videoArr.length-1)         
                        this.btnLabel = "FINISH";
                    else
                        this.btnLabel = "NEXT";
                }
            }else{
                console.log("watch api other response => "+JSON.stringify(this.watchApiObj));
            }
        }).catch(watchErr =>{
            this.loading.dismiss();
            console.log("watchErr => "+JSON.stringify(watchErr));
        });
    }

    callFuncForOffline(){
        if(this.currIndex==this.videoArr.length-1){
            let clmnArr = ['isWatched','watchedTime'];
            let dataArr = [
                true,
                new Date().getTime(),
                parseInt(localStorage.getItem("userID")),
                parseInt(this.videoArr[this.currIndex].uniID)
            ];
            this.db.updateOfflineWorkoutTbl('offlineSavedWorkoutTbl','userID','uniID',clmnArr,dataArr).then(uSucc =>{
                this.globalSer.currWorkout.ID = this.videoArr[this.currIndex].workoutID;
                this.completeWorkoutOffline();
            }).catch(uErr =>{
                console.log("uErr -> "+JSON.stringify(uErr));
            });
        }else{
            let clmnArr = ['isWatched','watchedTime'];
            let dataArr = [
                true,
                new Date().getTime(),
                parseInt(localStorage.getItem("userID")),
                parseInt(this.videoArr[this.currIndex].uniID)
            ];
            this.db.updateOfflineWorkoutTbl('offlineSavedWorkoutTbl','userID','uniID',clmnArr,dataArr).then(uSucc =>{
                this.currIndex++;
                this.videoURL = this.domSanitizer.bypassSecurityTrustResourceUrl(this.videoArr[this.currIndex].exVideo);
                this.descContent = this.videoArr[this.currIndex].exDesc;
                this.rulesContent = this.videoArr[this.currIndex].exRules;   
                if(this.currIndex==this.videoArr.length-1)         
                    this.btnLabel = "FINISH";
                else
                    this.btnLabel = "NEXT";
            }).catch(uErr =>{
                console.log("uErr -> "+JSON.stringify(uErr));
            });
        }
    }

    completeWorkoutOffline(){
        this.viewCtrl.dismiss();
        let data = {
            userID: parseInt(localStorage.getItem("userID")),
            wType: this.globalSer.currWorkout.name,
            wID: this.globalSer.currWorkout.ID,
            isCompleted: false,
            initDate: new Date().getTime()
        }
        console.log("data of offline cmplte => "+JSON.stringify(data));
        this.db.insIntoOfflineCmplteWorkoutTbl(data).then(cmSucc =>{
            let alert = this.alertCtrl.create({
                title: 'FLEXIBLE FITNESS',
                subTitle: 'You’re all done. Good work!',
                enableBackdropDismiss: false,            
                buttons: [{
                    text: 'OK',
                    handler: () => {
                        this.navCtrl.push(HowHardWorkoutScreenPage);
                    }
                }]        
            });
            alert.present();
        }).catch(cmErr =>{
            console.log("cmErr => "+JSON.stringify(cmErr));
        });
    }

    completeWorkoutOnline(){
        this.viewCtrl.dismiss();   
        let alert = this.alertCtrl.create({
            title: 'FLEXIBLE FITNESS',
            subTitle: 'You’re all done. Good work!',
            enableBackdropDismiss: false,            
            buttons: [{
                text: 'OK',
                handler: () => {
                    this.navCtrl.push(HowHardWorkoutScreenPage);
                }
            }]        
        });
        alert.present();
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
