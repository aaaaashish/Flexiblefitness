import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { WorkoutListPage } from '../workout-list/workout-list';
import { LocalDbProvider } from '../../providers/local-db/local-db';
import { ServicesProvider } from '../../providers/services/services';

@IonicPage()
@Component({
  selector: 'page-how-hard-workout-screen',
  templateUrl: 'how-hard-workout-screen.html',
})
export class HowHardWorkoutScreenPage {
    loading:any;
    whardness : any = "Piece_of_cake";
    feedSubObj:any;

    constructor(public navCtrl: NavController, public navParams: NavParams,private alertCtrl: AlertController, public loader: LoadingController, public db: LocalDbProvider, public globalSer: ServicesProvider) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad HowHardWorkoutScreenPage');
    }
    
    submitFunc(){
        if(this.globalSer.networkStatus){
            this.callFeedbackSubmitAPI();
        }else{
            this.presentLoading();
            let clmnArr = ['feedbackVal','isCompleted','initDate'];
            let dataArr = [
                this.whardness,
                true,
                new Date().getTime(),
                parseInt(localStorage.getItem("userID"))
            ];
            console.log("clmnArr -> "+JSON.stringify(clmnArr)+"\n dataArr -> "+JSON.stringify(dataArr));
            this.db.updateTbl('offlineCmplteWorkoutTbl','userID',clmnArr,dataArr).then(uSucc =>{
                this.loading.dismiss();
                console.log("uSucc -> "+JSON.stringify(uSucc));
                this.db.delDataFromofflineSavedWorkoutTbl().then(delSucc =>{
                    let alert = this.alertCtrl.create({
                        title: 'FLEXIBLE FITNESS',
                        subTitle: 'Got it, thanks for your feedback.',
                        enableBackdropDismiss: false,
                        buttons: [{
                            text: 'OK',
                            handler: () => {
                                this.globalSer.currWorkout.ID = "";
                                this.globalSer.currWorkout.name = "";
                                this.navCtrl.setRoot(WorkoutListPage);
                            }
                        }]
                    });
                    alert.present();
                }).catch(delErr =>{
                    this.loading.dismiss();
                    console.log("delErr -> "+JSON.stringify(delErr));
                });
            }).catch(uErr =>{
                this.loading.dismiss();
                console.log("uErr -> "+JSON.stringify(uErr));
            });
        }        
    }

    callFeedbackSubmitAPI(){
        let data = {
            "userID": localStorage.getItem("userID"),
            "workoutID": parseInt(this.globalSer.currWorkout.ID),
            "feedBack": this.whardness,
            "workoutType": this.globalSer.currWorkout.name,
            "isCompleted": true,
            "exerciseIDCompleted": ""
        }
        console.log("feedback submit data => "+JSON.stringify(data));
        this.presentLoading();
        this.globalSer.postMethod(data,"saveWorkoutFeedBack").then(feedSucc =>{
            this.loading.dismiss();
            this.feedSubObj = feedSucc;
            if(this.feedSubObj.statusCode=="200"){
                let alert = this.alertCtrl.create({
                    title: 'FLEXIBLE FITNESS',
                    subTitle: 'Got it, thanks for your feedback.',
                    enableBackdropDismiss: false,
                    buttons: [{
                        text: 'OK',
                        handler: () => {
                            this.globalSer.currWorkout.ID = "";
                            this.globalSer.currWorkout.name = "";
                            this.navCtrl.setRoot(WorkoutListPage);
                        }
                    }]
                });
                alert.present();
            }else{
                console.log("other response for feedback submit => "+JSON.stringify(this.feedSubObj));
            }
        }).catch(feedErr =>{
            this.loading.dismiss();
            console.log("feedErr => "+JSON.stringify(feedErr));
        });
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
