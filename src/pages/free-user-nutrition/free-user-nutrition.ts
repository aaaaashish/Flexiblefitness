import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, App } from 'ionic-angular';
import { ServicesProvider } from '../../providers/services/services';
import { LocalDbProvider } from '../../providers/local-db/local-db';
import { NutritionGuidelinesPage } from '../nutrition-guidelines/nutrition-guidelines';
import { NutritionPage } from '../nutrition/nutrition';
import { NutritionSubCatPage } from '../nutrition-sub-cat/nutrition-sub-cat';

@IonicPage()
@Component({
    selector: 'page-free-user-nutrition',
    templateUrl: 'free-user-nutrition.html',
})
export class FreeUserNutritionPage {
    mealArr:any = [];
    loading:any;
    mealObj:any;
    userData:any;
    mealList = [{
        name:"Breakfast",
        img:"",
        listArr:[]
    },{
        name:"Lunch",
        img:"",
        listArr:[]
    },{
        name:"Snack",
        img:"",
        listArr:[]
    },{
        name:"Dinner",
        img:"",
        listArr:[]
    }]

    constructor(public navCtrl: NavController, public navParams: NavParams, public globalSer: ServicesProvider, public loader: LoadingController, public toastCtrl: ToastController, public db: LocalDbProvider, public app: App) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad FreeUserNutritionPage');
    }

    ionViewWillEnter(){
        console.log('free user nutri will enter called');
        this.getDataFromUsersTbl();
    }

    getDataFromUsersTbl(){
        this.db.fetchDataFromUsersTbl(localStorage.getItem("userID")).then(fNSucc =>{
            //console.log("fUSucc=> "+JSON.stringify(fNSucc));
            this.userData = fNSucc;
            if(this.userData.userType=="Free User"){
                this.getListFromTbl();
            }else{
                if(this.userData.isNutritionFlowSaved==false || this.userData.isNutritionFlowSaved=="false"){
                    this.navCtrl.push(NutritionGuidelinesPage);
                }else{
                    this.navCtrl.push(NutritionPage);
                }
            }
        }).catch(fNErr =>{
            console.log("fNErr=> "+JSON.stringify(fNErr));
        });
    }

    getListFromTbl(){
        this.presentLoading();
        this.db.fetchDataFromMealListForFreeUser().then(mealSucc =>{
            this.mealList = [{name:"Breakfast",img:"",listArr:[]},{name:"Lunch",img:"",listArr:[]},{name:"Snack",img:"",listArr:[]},{name:"Dinner",img:"",listArr:[]}];
            this.mealObj = mealSucc;
            for(var i=0; i<this.mealObj.length; i++){
                if(this.mealObj[i].recipeCategory=="Breakfast"){
                    var ind = this.mealList.findIndex((x) => x.name==this.mealObj[i].recipeCategory);
                    this.mealList[ind].img = this.mealObj[i].foodImage;
                    this.mealList[ind].listArr.push({
                        recipeName: this.mealObj[i].recipeName,
                        img: this.mealObj[i].foodImage
                    });
                }else if(this.mealObj[i].recipeCategory=="Lunch"){
                    var ind = this.mealList.findIndex((x) => x.name==this.mealObj[i].recipeCategory);
                    this.mealList[ind].img = this.mealObj[i].foodImage;
                    this.mealList[ind].listArr.push({
                        recipeName: this.mealObj[i].recipeName,
                        img: this.mealObj[i].foodImage
                    });
                }else if(this.mealObj[i].recipeCategory=="Snack"){
                    var ind = this.mealList.findIndex((x) => x.name==this.mealObj[i].recipeCategory);
                    this.mealList[ind].img = this.mealObj[i].foodImage;
                    this.mealList[ind].listArr.push({
                        recipeName: this.mealObj[i].recipeName,
                        img: this.mealObj[i].foodImage
                    });
                }else if(this.mealObj[i].recipeCategory=="Dinner"){
                    var ind = this.mealList.findIndex((x) => x.name==this.mealObj[i].recipeCategory);
                    this.mealList[ind].img = this.mealObj[i].foodImage;
                    this.mealList[ind].listArr.push({
                        recipeName: this.mealObj[i].recipeName,
                        img: this.mealObj[i].foodImage
                    });
                }
                if(i==this.mealObj.length-1){
                    this.loading.dismiss(); 
                }
            }
        }).catch(mealErr =>{
            this.loading.dismiss();
            console.log("mealErr -> "+JSON.stringify(mealErr));
        });
    }

    goToDetails(obj){
        //console.log("call api -> "+JSON.stringify(obj));
        this.globalSer.nutriSubCat = obj;
        this.app.getRootNav().push(NutritionSubCatPage);
    }

    presentLoading(){
        this.loading = this.loader.create({
            spinner: "crescent",
            content: 'Please wait...',
            cssClass: "ff-loader"
        });
        this.loading.present();
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
