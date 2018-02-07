import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, AlertController, LoadingController, Events, ToastController } from 'ionic-angular';
import { RecipeInstructionScreenPage } from '../recipe-instruction-screen/recipe-instruction-screen';
import { RecipeSelectionScreenPage } from '../recipe-selection-screen/recipe-selection-screen';
import { WeeklyGroceryListScreenPage } from '../weekly-grocery-list-screen/weekly-grocery-list-screen';
import { MealsDeliveredScreenPage } from '../meals-delivered-screen/meals-delivered-screen';
import { App } from 'ionic-angular/components/app/app';
import { ServicesProvider } from '../../providers/services/services';
import { LocalDbProvider } from '../../providers/local-db/local-db';

@IonicPage()
@Component({
    selector: 'page-todays-meals',
    templateUrl: 'todays-meals.html',
})
export class TodaysMealsPage {
    @ViewChild(Nav) nav: Nav;
    loading:any;
    userData:any;
    delToDoorStatus:any;
    noListFound = false;
    mealArr:any = []; 
    latestCalObj:any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public app: App, public globalSer: ServicesProvider, public db: LocalDbProvider, private alertCtrl: AlertController, public loader: LoadingController, public events: Events, public toastCtrl: ToastController) {
    }

    ionViewWillEnter(){
        console.log('ionViewWillEnter todays meal page');
        this.fetchDataFromUsersTbl();
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad TodaysMealsPage');
    }

    backBtnFunc(){
        //this.navCtrl.pop();
        this.navCtrl.popToRoot();
    }

    fetchDataFromUsersTbl(){
        this.db.fetchDataFromUsersTbl(localStorage.getItem("userID")).then(fSucc =>{
            //console.log("fUSucc=> "+JSON.stringify(fSucc));
            this.userData = fSucc;
            this.delToDoorStatus = this.userData.deliverdToDoorQuestionShown;
            this.getTodaysMealList();
        }).catch(fErr =>{
            console.log("fUErr=> "+JSON.stringify(fErr));
        });
    }

    getTodaysMealList(){
        this.presentLoading();
        this.db.fetchDataFromUserTodaysMealTbl(localStorage.getItem("userID")).then(tblMealSucc =>{
            this.mealArr = [];
            this.mealArr = tblMealSucc;
            if(this.mealArr.length!=0){
                for(var i=0; i<this.mealArr.length; i++){
                    this.mealArr[i].ateThis = false;
                    if(i==this.mealArr.length-1){
                        this.loading.dismiss();
                    }
                }
            }else{
                this.loading.dismiss();
                this.noListFound = true;
            }
        }).catch(tblMealErr =>{
            this.loading.dismiss();
            console.log("tblMealErr => "+JSON.stringify(tblMealErr));
        });
    }

    changeThisfunc(obj){
        if(this.globalSer.networkStatus){
            this.globalSer.changeRecipeObj.uniID = obj.uniID;
            this.globalSer.changeRecipeObj.rCat = obj.recipeCategory;
            this.globalSer.changeRecipeObj.rID = obj.recipeID;
            this.navCtrl.push(RecipeSelectionScreenPage);
        }else{
            this.showErrToast();
        }
    }

    ateThisFunc(obj){
        if(obj.ateThis==false){
            let alert = this.alertCtrl.create({
                title: 'FLEXIBLE FITNESS',
                message: 'Are you sure you ate this?',
                buttons: [{
                    text: 'NO',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'YES',
                    handler: () => {
                        console.log('YES clicked');
                        this.insIntoLogFoodTbl(obj);
                    }
                }]
            });
            alert.present();
        }
    }

    insIntoLogFoodTbl(obj){
        this.presentLoading();
        let data = [{
            foodName: obj.recipeName,
            foodCal: obj.calories,
            takenTime: new Date().getTime(),
            feedType: "recomended"
        }];
        this.db.insIntoLogYourOwnFoodTbl(parseInt(localStorage.getItem("userID")),data).then(inSucc =>{
            this.updateTodayCalorie(obj);
        }).catch(inErr =>{
            this.loading.dismiss();
            console.log("inErr -> "+JSON.stringify(inErr));
        });
    }

    updateTodayCalorie(obj){
        this.db.fetchLatestRecordFromUserCaloriesTbl(localStorage.getItem("userID")).then(lCalSucc =>{
            this.latestCalObj = lCalSucc;
            console.log("latestCalObj_log_own_food => "+JSON.stringify(this.latestCalObj));
            let uniID = this.latestCalObj[0].uniID;
            //let calConsumed = (Math.round(this.latestCalObj[0].calorieConsumed)+Math.round(obj.calories));
            let calConsumed = parseFloat((this.latestCalObj[0].calorieConsumed+obj.calories).toFixed(2));
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
                obj.ateThis = true;
                this.loading.dismiss();
            }).catch(uErr =>{
                this.loading.dismiss();
                console.log("uErr -> "+JSON.stringify(uErr));
            });
        }).catch(lCalErr =>{
            this.loading.dismiss();
            console.log("lCalErr => "+JSON.stringify(lCalErr));
        });
    }

    weekly(){
        if(this.globalSer.networkStatus)
            this.navCtrl.push(WeeklyGroceryListScreenPage);
        else
            this.showErrToast();
    }

    mealsDelivered(){
        //this.navCtrl.push(MealsDeliveredScreenPage)
    }

    viewRecipe(obj){
        this.globalSer.currTodaysMealObj.rID = obj.recipeID;
        this.globalSer.currTodaysMealObj.rName = obj.recipeName;
        this.globalSer.currTodaysMealObj.cal = obj.calories;
        this.globalSer.currTodaysMealObj.img = obj.foodImage;
        this.globalSer.currTodaysMealObj.instruction = obj.instructions;
        this.navCtrl.push(RecipeInstructionScreenPage);
    }

    presentLoading(){
        this.loading = this.loader.create({
            spinner: "crescent",
            content: 'Please wait...',
            cssClass: "ff-loader"
        });
        this.loading.present();
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
}
