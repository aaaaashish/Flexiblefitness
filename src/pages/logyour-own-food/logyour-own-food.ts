import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Events } from 'ionic-angular';
import { LocalDbProvider } from '../../providers/local-db/local-db';
import { ServicesProvider } from '../../providers/services/services';

@IonicPage()
@Component({
    selector: 'page-logyour-own-food',
    templateUrl: 'logyour-own-food.html',
})
export class LogyourOwnFoodPage {
    searchText:any = "";
    preFoodArr:any = [];
    pageNo = 0;
    loading:any;
    searchObj:any;
    searchArr:any = [];
    latestCalObj:any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public db: LocalDbProvider, public globalSer: ServicesProvider, public toastCtrl: ToastController, public loader: LoadingController, public events: Events) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad LogyourOwnFoodPage');
    }

    ionViewWillEnter(){
        this.getDataForPreviousFood();
    }

    backBtnFunc(){
        this.navCtrl.pop();
    }

    getDataForPreviousFood(){
        this.db.fetchDataFromPreviousFoodTbl(localStorage.getItem("userID")).then(pFSucc =>{
            this.preFoodArr = pFSucc;
        }).catch(pFErr =>{
            console.log("pFErr -> "+JSON.stringify(pFErr));
        });
    }

    selectFoodFromPreFood(obj){
        let data = [{
            foodName: obj.foodName,
            foodCal: obj.foodCal,
            takenTime: new Date().getTime(),
            feedType: "own"
        }];
        this.db.insIntoLogYourOwnFoodTbl(parseInt(localStorage.getItem("userID")),data).then(inSucc =>{
            this.updateTodayCalorie(obj);
        }).catch(inErr =>{
            console.log("inErr -> "+JSON.stringify(inErr));
        });
    }

    searchLogFood(e) { 
        console.log("search text -> "+this.searchText);
        if(this.searchText.trim().length!=0){
            if(this.globalSer.networkStatus){
                this.searchArr = [];
                this.pageNo = 0;
                this.presentLoading();
                this.globalSer.getMethod("fetchLogFoods?query="+this.searchText+"&page="+this.pageNo+"&userID="+localStorage.getItem("userID")).then(apiSucc =>{
                    this.loading.dismiss();
                    this.searchObj = apiSucc;
                    if(this.searchObj.statusCode=="200"){
                        if(this.searchObj.data.searchFoodList.length!=0)
                            this.searchArr = this.searchObj.data.searchFoodList;
                        else
                            this.showErrToast("No result found.");
                    }
                }).catch(apiErr =>{
                    this.loading.dismiss();
                    console.log("search api err -> "+JSON.stringify(apiErr));
                });
            }else{
                this.showErrToast("Please check your internet connection.");
            }
        }else{
            this.showErrToast("Please enter something for search.");
        }
    }

    loadMore(infiniteScroll){
        if(this.searchArr.length!=0){
            if(this.pageNo==this.searchObj.data.totalPages){
                infiniteScroll.enable(false);
            }else if(this.pageNo<this.searchObj.data.totalPages){
                this.pageNo++;
                console.log("load more call -> "+this.pageNo);
                this.globalSer.getMethod("fetchLogFoods?query="+this.searchText+"&page="+this.pageNo+"&userID="+localStorage.getItem("userID")).then(apiSucc =>{
                    infiniteScroll.complete();
                    this.searchObj = apiSucc;
                    if(this.searchObj.statusCode=="200"){
                        if(this.searchObj.data.searchFoodList.length!=0){
                            for(var i=0; i<this.searchObj.data.searchFoodList.length; i++){
                                this.searchArr.push(this.searchObj.data.searchFoodList[i]);    
                            }
                        }
                        else
                            this.showErrToast("No result found.");
                    }
                }).catch(apiErr =>{
                    this.pageNo--;
                    infiniteScroll.complete();
                    console.log("search api err -> "+JSON.stringify(apiErr));
                });
            }
        }else{
            infiniteScroll.complete();
        }  
    }

    selectFoodFromList(obj){
        console.log("obj -> "+JSON.stringify(obj));
        let arr = [{
            foodName: obj.foodName,
            foodCal: obj.calories,
            takenTime: new Date().getTime(),
            feedType: "own"
        }];
        this.db.insIntoLogYourOwnFoodTbl(parseInt(localStorage.getItem("userID")),arr).then(insSucc =>{
            let preArr = [{
                foodName: arr[0].foodName,
                foodCal: arr[0].foodCal,
                takenTime: arr[0].takenTime
            }];
            this.db.insIntoPreviousFoodTbl(parseInt(localStorage.getItem("userID")),preArr).then(preInsSucc =>{
                this.updateTodayCalorie(arr[0]);
            }).catch(preInsErr =>{
                console.log("preInsErr => "+JSON.stringify(preInsErr));
            });
        }).catch(insErr =>{
            console.log("insErr => "+JSON.stringify(insErr));
        });
    }

    updateTodayCalorie(obj){
        this.db.fetchLatestRecordFromUserCaloriesTbl(localStorage.getItem("userID")).then(lCalSucc =>{
            this.latestCalObj = lCalSucc;
            console.log("latestCalObj_log_own_food => "+JSON.stringify(this.latestCalObj));
            let uniID = this.latestCalObj[0].uniID;
            //let calConsumed = (parseInt(this.latestCalObj[0].calorieConsumed)+parseInt(obj.foodCal));
            let calConsumed = parseFloat((this.latestCalObj[0].calorieConsumed+obj.foodCal).toFixed(2));
            let clmnArr = ['calorieConsumed','calorieDate'];
            let dataArr = [
                calConsumed,
                new Date().getTime(),
                parseInt(localStorage.getItem("userID")),
                uniID
            ];
            this.db.updateOfflineWorkoutTbl('userCaloriesTbl','userID','uniID',clmnArr,dataArr).then(uSucc =>{
                console.log("user calories updated");
                this.events.publish('logFoodInserted');
                this.navCtrl.pop();
            }).catch(uErr =>{
                console.log("uErr -> "+JSON.stringify(uErr));
            });
        }).catch(lCalErr =>{
            console.log("lCalErr => "+JSON.stringify(lCalErr));
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

    presentLoading(){
        this.loading = this.loader.create({
            spinner: "crescent",
            content: 'Please wait...',
            cssClass: "ff-loader"
        });
        this.loading.present();
    }
    
}
