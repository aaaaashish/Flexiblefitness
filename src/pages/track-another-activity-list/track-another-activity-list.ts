import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, ToastController, LoadingController } from 'ionic-angular';
import { LocalDbProvider } from '../../providers/local-db/local-db';

@IonicPage()
@Component({
    selector: 'page-track-another-activity-list',
    templateUrl: 'track-another-activity-list.html',
})
export class TrackAnotherActivityListPage {
    loading:any;
    actDate:any;
    actName:any;
    actDuration:any;
    actIndex:any;
    numRegx = (/^[0-9]*$/);
    alertMsg = "";
    valActDuration:any;
    aID: any;
    aName: any;
    tblObj:any;
    searchText:any = "";
    copyOfActivityArr:any = [];
    activityArr:any = [];
    activityListArr:any = [];

    activityLogArr:any = [];
    actInd:any;

    constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, public modalCtrl: ModalController, public toastCtrl: ToastController, public loader: LoadingController, public db: LocalDbProvider) {
    }

    ionViewWillEnter(){
        this.getActivityForList();
        this.getActivityForTbl();
    }

    goBackFunc(){
        this.navCtrl.pop();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad TrackAnotherActivityListPage');
    }

    getActivityForList(){
        this.presentLoading();
        this.db.fetchDatafromAnotherActivityListTbl(localStorage.getItem("userID")).then(listSucc =>{
            this.loading.dismiss();
            console.log("listSucc -> ");
            this.activityArr = listSucc;
            this.copyOfActivityArr = listSucc;
        }).catch(listErr =>{
            this.loading.dismiss();
            console.log("listErr -> "+JSON.stringify(listErr));
        });
    }

    getActivityForTbl(){
        this.db.fetchDatafromActivityPerformDurationTbl(localStorage.getItem("userID")).then(fSucc =>{
            this.tblObj = fSucc;
            this.activityLogArr = [];
            for(var i=0; i<this.tblObj.length; i++){
                var logIndex = this.activityLogArr.findIndex((x) => new Date(x.date).toDateString()===new Date(this.tblObj[i].initDate).toDateString());
                if(logIndex == -1){
                    this.activityLogArr.push({
                        date: this.tblObj[i].initDate,
                        logArr: [{
                            activity: this.tblObj[i].actName,
                            duration: this.tblObj[i].duration,
                        }]
                    });
                }else{
                    this.activityLogArr[logIndex].logArr.push({
                        activity: this.tblObj[i].actName,
                        duration: this.tblObj[i].duration,
                    });
                }
                if(i == this.tblObj.length-1){
                    this.actInd = this.activityLogArr.length-1;
                }
            }
        }).catch(fErr =>{
            console.log("fErr -> "+JSON.stringify(fErr));
        }); 
    }

    addDuration(obj){
        console.log("obj -> "+JSON.stringify(obj));
        let alert = this.alertCtrl.create({
            title: 'How long did you perform this activity?',
            cssClass:"act-dur",
            inputs: [{
                type: 'text',
                name: 'time',
                placeholder: 'Minutes',
                value: ''
            }],
            buttons: [{
                text: 'Cancel',
                role: 'cancel',
                handler: data => {
                  console.log('Cancel clicked');
                }
            },{
                text: 'Submit',
                handler: data => {
                    if(data['time']!=""){
                        if(!this.numRegx.test(data['time'])){
                            this.alertMsg = "Enter valid activity duration.";
                            this.showErr();
                            return false;
                        }else if(parseFloat(data['time'])==0 || parseFloat(data['time'])>60){
                            this.alertMsg = "Enter activity duration from 1 and 60 minutes.";
                            this.showErr();
                            return false;
                        }else{
                            this.aID = obj.actID;
                            this.actName = obj.actName;
                            this.valActDuration = parseFloat(data['time']);
                            this.goodWorkFunc();
                        }
                    }else{
                        this.alertMsg = "Enter activity duration.";
                        this.showErr();
                        return false;
                    }
                }
            }]
        });
        alert.present();
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
    
    goodWorkFunc(){
        this.presentLoading();
        let data = [];
        data.push({
            activityID: this.aID,
            activityName: this.actName,
            duration: this.valActDuration,
            activityLogTime: new Date().getTime()
        });
        console.log("data=> "+JSON.stringify(data));
        this.db.insIntoActivityPerformDurationTbl(parseInt(localStorage.getItem("userID")),data).then(insSucc =>{
            this.loading.dismiss();
            let alert = this.alertCtrl.create({
                title: 'FLEXIBLE FITNESS',            
                subTitle: 'Good work!',
                enableBackdropDismiss: false,
                buttons: [{
                    text: 'OK',
                    handler: () => {
                        this.searchText = "";
                        this.activityArr = this.copyOfActivityArr;
                        this.getActivityForTbl();
                    }
                }]        
            });
            alert.present();
        }).catch(insErr =>{
            this.loading.dismiss();
            console.log("insErr => "+JSON.stringify(insErr));
        });
    }

    actChangeFunc(type){
        if(type==1){
            if(this.actInd>0)
                this.actInd--;
        }else{
            if(this.actInd!=this.activityLogArr.length-1)
                this.actInd++;
        }
    }

    searchFunc(ev: any){
        this.activityArr = this.filterItems(this.searchText);
    }

    filterItems(text) {
        return this.copyOfActivityArr.filter((item) => {
            return (item.actName.toLowerCase().indexOf(text.toLowerCase()) > -1);
        })
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
