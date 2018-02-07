import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { WorkoutDetailPage } from '../workout-detail/workout-detail';
import { ServicesProvider } from '../../providers/services/services';
import { TrackAnotherActivityListPage } from '../track-another-activity-list/track-another-activity-list';
import { LocalDbProvider } from '../../providers/local-db/local-db';

@IonicPage()
@Component({
    selector: 'page-workout-list',
    templateUrl: 'workout-list.html',
})
export class WorkoutListPage {
    loading:any;
    userData:any;
    xValue:any;
    yValue:any;
    zValue:any;
    workoutListArr:any = [];
    constructor(public navCtrl: NavController, public navParams: NavParams, public globalSer: ServicesProvider, public loader: LoadingController, public toastCtrl: ToastController, public db: LocalDbProvider) {
    }

    ionViewWillEnter(){
        console.log("workout list ionViewWillEnter called");
        this.fetchDataFromUsersTbl();
    }

    fetchDataFromUsersTbl(){
        this.presentLoading();
        this.db.fetchDataFromUsersTbl(localStorage.getItem("userID")).then(fSucc =>{
            //console.log("fUSucc=> "+JSON.stringify(fSucc));
            this.userData = fSucc;
            this.xValue = this.userData.xValue;
            this.yValue = this.userData.yValue;
            this.zValue = this.userData.zValue;
            this.fetchWorkoutList();
        }).catch(fErr =>{
            this.loading.dismiss();
            console.log("fUErr=> "+JSON.stringify(fErr));
        });
    }

    fetchWorkoutList(){
        this.db.fetchDatafromMainWorkoutList(localStorage.getItem("userID")).then(wSucc =>{
            this.loading.dismiss();
            console.log("workout succ => ");
            this.workoutListArr = [];
            this.workoutListArr = wSucc;
            if(this.userData.userType=="Free User"){
                let ind = this.workoutListArr.findIndex(x => x.name=="ACTIVITY");
                this.workoutListArr.splice(ind);
            }
        }).catch(wErr =>{
            this.loading.dismiss();
            console.log("wErr=> "+JSON.stringify(wErr));
        });
    }   

    ionViewDidLoad() {
       console.log('ionViewDidLoad WorkoutListPage');
    }

    backBtnFunc(){
        this.navCtrl.pop();
    }

    goToDetail(type){
        console.log("type=> "+type);
        switch(type){
            case "CARDIO":
                this.globalSer.currWorkout.name = "CARDIO";
                this.navCtrl.push(WorkoutDetailPage);
                break;
            case "GYM":
                this.globalSer.currWorkout.name = "GYM";
                this.navCtrl.push(WorkoutDetailPage);
                break;
            case "OTG":
                this.globalSer.currWorkout.name = "OTG";
                this.navCtrl.push(WorkoutDetailPage);
                break;
            case "SELF":
                this.globalSer.currWorkout.name = "SELF";
                this.navCtrl.push(WorkoutDetailPage);
                break;
            case "ACTIVITY":
                this.navCtrl.push(TrackAnotherActivityListPage);
                break;
            default: 
                break;
        }
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
