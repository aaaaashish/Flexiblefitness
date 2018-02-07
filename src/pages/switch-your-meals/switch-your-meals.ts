import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { MealsDeliveredPage } from '../meals-delivered/meals-delivered';
import { ServicesProvider } from '../../providers/services/services';
import { LocalDbProvider } from '../../providers/local-db/local-db';
import { NutritionPage } from '../nutrition/nutrition';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

@IonicPage()
@Component({
    selector: 'page-switch-your-meals',
    templateUrl: 'switch-your-meals.html',
})
export class SwitchYourMealsPage {
    loading:any;
    switchMeals:any= "1";
    userObj:any;
    btnText:any = "NEXT";
    apiObj:any;
    recipeInd = 0;

    constructor(public navCtrl: NavController, public navParams: NavParams,  public globalSer: ServicesProvider, public loader: LoadingController, public db: LocalDbProvider, public toastCtrl: ToastController, public alertCtrl: AlertController) {
    }

    ionViewWillEnter(){
        this.fetchDataFromUsersTbl();
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad SwitchYourMealsPage');
    }

    fetchDataFromUsersTbl(){
        this.presentLoading();
        this.db.fetchDataFromUsersTbl(localStorage.getItem("userID")).then(uSucc =>{
            this.loading.dismiss();
            this.userObj = uSucc;
            if(this.userObj.deliverdToDoorQuestionShown=="true" || this.userObj.deliverdToDoorQuestionShown==true){
                this.btnText = "NEXT";
            }else if(this.userObj.deliverdToDoorQuestionShown=="false" || this.userObj.deliverdToDoorQuestionShown==false){
                this.btnText = "SUBMIT";
            }else{
                this.btnText = "Not Found";
            }
        }).catch(uErr =>{
            this.loading.dismiss();
            console.log("uErr => "+JSON.stringify(uErr));
        });
    }

    onSubmit(type){
        console.log("type -> "+type);
        this.globalSer.nutriSaveObj.switchMeals = this.switchMeals;
        if(type=="NEXT"){
            this.navCtrl.push(MealsDeliveredPage);
        }else if(type=="SUBMIT"){
            this.callNutriSaveApi();
        }else{
            console.log("some thing went wrong");
        }
    }

    callNutriSaveApi(){
        if(this.globalSer.networkStatus){
            this.globalSer.nutriSaveObj.mealDeliverStatus = "0";
            let data = {
                "userID": localStorage.getItem("userID"),
                "dietID": parseInt(this.globalSer.nutriSaveObj.kindOfDiat),
                "allergens": this.globalSer.nutriSaveObj.allergance,
                "mealFrequency": parseInt(this.globalSer.nutriSaveObj.howManyMeal),
                "mealChangeFrequecyID": parseInt(this.globalSer.nutriSaveObj.switchMeals),
                "mealDelivery": parseInt(this.globalSer.nutriSaveObj.mealDeliverStatus)
            }
            console.log("nutri data -> "+JSON.stringify(data));
            this.presentLoading();
            this.globalSer.postMethod(data,"nutritionFlow").then(apiSucc =>{
                //console.log("apiSucc => "+JSON.stringify(apiSucc));
                this.apiObj = apiSucc;
                if(this.apiObj.statusCode=="200"){     
                    this.globalSer.nutriSaveObj.userID = localStorage.getItem("userID");               
                    this.db.insIntoNutritionSavedDataTbl(this.globalSer.nutriSaveObj).then(nutriInsSucc =>{
                        let clmnArr = ['isNutritionFlowSaved','initDate'];
                        let valueArr = [true, new Date().getTime(), parseInt(localStorage.getItem("userID"))];
                        this.db.updateTbl("Users","userID",clmnArr,valueArr).then(uSucc =>{
                            console.log("uSucc -> "+JSON.stringify(uSucc));
                            let arr = ['DELETE FROM userTodaysMealTbl'];
                            this.db.delTable(arr).then(delSucc =>{
                                this.insDataIntoTodaysMeal(this.apiObj.data,this.apiObj.data.length);
                            }).catch(delErr =>{
                                this.loading.dismiss();
                                console.log("delErr -> "+JSON.stringify(delErr));
                            });
                        }).catch(uErr =>{
                            this.loading.dismiss();
                            console.log("uErr -> "+JSON.stringify(uErr));
                        });
                    }).catch(nutriInsErr =>{
                        this.loading.dismiss();
                        console.log("nutriInsErr -> "+JSON.stringify(nutriInsErr));
                    });
                }else{
                    this.loading.dismiss();
                    let alert = this.alertCtrl.create({
                        title: 'FLEXIBLE FITNESS',            
                        subTitle: this.apiObj.message,
                        buttons: [{
                            text: 'OK',
                            handler: () => {
                            }
                        }]        
                    });
                    alert.present();
                }
            }).catch(apiErr =>{
                this.loading.dismiss();
                console.log("apiErr => "+JSON.stringify(apiErr));
            });
        }else{
            let toast = this.toastCtrl.create({
                message: "Please check your internet connection.",
                duration: 3000,
                position: 'bottom',
                cssClass: "ff-toast"
            });
            toast.present();
        }
    }

    insDataIntoTodaysMeal(recipeArr,total){
        if(this.recipeInd<total){
            this.getBase64ImageFromURL(recipeArr[this.recipeInd].foodImage).subscribe(base64data => {
                let bsData = 'data:image/jpg;base64,'+base64data;
                let recipeObj = {
                    userID: parseInt(localStorage.getItem("userID")),
                    recipeID: recipeArr[this.recipeInd].recipeID,
                    recipeName: recipeArr[this.recipeInd].recipeName,
                    recipeCategory: recipeArr[this.recipeInd].recipeCategory,
                    mealLabel: recipeArr[this.recipeInd].mealLabel,
                    calories: recipeArr[this.recipeInd].calories,
                    foodImage: bsData,
                    instructions: recipeArr[this.recipeInd].instructions
                }
                this.db.insIntoUserTodaysMealTbl(recipeObj).then(mealSucc =>{
                    this.db.insIntoRecipeIngredientTbl(recipeArr[this.recipeInd].recipeID,recipeArr[this.recipeInd].ingredientsList).then(increInsSucc =>{
                        this.recipeInd++;
                        this.insDataIntoTodaysMeal(recipeArr,total);
                    }).catch(increInsErr =>{
                        this.loading.dismiss();
                        console.log("increInsErr => "+JSON.stringify(increInsErr));
                    });
                }).catch(mealErr => {
                    this.loading.dismiss();
                    console.log("imgErr => "+JSON.stringify(mealErr));
                });
            });
        }else{
            console.log("recur done for todays meal");
            this.recipeInd = 0;
            this.loading.dismiss();
            this.navCtrl.setRoot(NutritionPage);
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

    getBase64ImageFromURL(url: string) {
        return Observable.create((observer: Observer<string>) => {
            let img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = url;
            if (!img.complete) {
                img.onload = () => {
                    observer.next(this.getBase64Image(img));
                    observer.complete();
                };
                img.onerror = (err) => {
                    observer.error(err);
                };
            } else {
                observer.next(this.getBase64Image(img));
                observer.complete();
            }
        }); 
    }
    
    getBase64Image(img: HTMLImageElement) {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    }
    
}
