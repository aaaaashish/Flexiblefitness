import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { LocalDbProvider } from '../../providers/local-db/local-db';
import { ServicesProvider } from '../../providers/services/services';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

@IonicPage()
@Component({
    selector: 'page-nutrition-update',
    templateUrl: 'nutrition-update.html',
})
export class NutritionUpdatePage {
    loading:any;
    userObj:any;
    dietDiv:any = false;
    allergicDiv:any = false;
    typesOfMealDiv:any = false;
    switchMealDiv: any = false;
    mealsDeliverDiv: any = false;
    user:any = {
        diet:"",
        mealsType:"",
        switchMeal:"",
        mealsdeliverStatus:""
    }
    allerObj:any;
    nutriObj:any;
    allergicArr:any = [];
    mealsDeliverStatus:any;
    apiObj:any;
    recipeInd = 0;
    
    constructor(public navCtrl: NavController, public navParams: NavParams, public db: LocalDbProvider, public loader: LoadingController, public alertCtrl: AlertController,  public globalSer: ServicesProvider, public toastCtrl: ToastController) {
    }

    ionViewWillEnter(){
        this.recipeInd = 0;
        this.fetchDataFromUsersTbl();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad NutritionUpdatePage');
    }

    backBtnFunc(){
        this.navCtrl.pop();
    }

    fetchDataFromUsersTbl(){
        this.presentLoading();
        this.db.fetchDataFromUsersTbl(localStorage.getItem("userID")).then(uSucc =>{
            this.loading.dismiss();
            this.userObj = uSucc;
            console.log("deliverdToDoorQuestionShown -> "+this.userObj.deliverdToDoorQuestionShown);
            this.userObj.deliverdToDoorQuestionShown=="true"?this.mealsDeliverStatus=true:this.mealsDeliverStatus=false;
            this.fetchAllerganceFromTbl();
        }).catch(uErr =>{
            this.loading.dismiss();
            console.log("uErr => "+JSON.stringify(uErr));
        });
    }

    fetchAllerganceFromTbl(){
        this.db.fetchDataFromAllerganceListTbl().then(alSucc =>{
            this.allerObj = alSucc;
            this.allergicArr = [];
            for(var i=0; i<this.allerObj.length; i++){
                this.allergicArr.push({
                    name: this.allerObj[i].allergenName,
                    id: this.allerObj[i].allergenID,
                    selected: false
                });
                if(i==this.allerObj.length-1)
                    this.setDataFunc();
            }
        }).catch(alErr =>{
            this.loading.dismiss();
            console.log("alErr -> "+JSON.stringify(alErr));
        });
    }

    setDataFunc(){
        this.db.fetchDataFromNutritionSavedDataTbl(localStorage.getItem("userID")).then(feSucc =>{
            this.loading.dismiss();
            this.nutriObj = feSucc;            
            console.log("nutriObj -> "+JSON.stringify(this.nutriObj));
            if(this.nutriObj.length==0){
                this.user.diet="5";
                this.user.mealsType="1";
                this.user.switchMeal="1";
                this.user.mealsdeliverStatus="YES";
            }else{
                this.user.diet = this.nutriObj[0].dietID;
                this.user.mealsType = this.nutriObj[0].mealTypeID;
                this.user.switchMeal = this.nutriObj[0].switchMealID;
                this.nutriObj[0].mealsDeliverID=="0"?this.user.mealsdeliverStatus="NO":this.user.mealsdeliverStatus="YES";
                this.nutriObj[0].allergicID!=""?this.setAllergic():"";
            }
        }).catch(feErr =>{
            this.loading.dismiss();
            console.log("feErr -> "+JSON.stringify(feErr));
        });
    }

    setAllergic(){
        let allergicSaveArr = this.nutriObj[0].allergicID.split(',');
        for(var i=0; i<allergicSaveArr.length; i++){
            var index = this.allergicArr.findIndex(x => parseInt(x.id)==parseInt(allergicSaveArr[i]));
            this.allergicArr[index].selected=true;
        }
    }

    updateClickFunc(type){
        switch(type){
            case 'diet':
                this.dietDiv = true;
                break;
            case 'allergic':
                this.allergicDiv = true;
                break;
            case 'mealTypes':
                this.typesOfMealDiv = true;
                break;
            case 'meals':
                this.switchMealDiv = true;
                break;
            case 'mealsDeliver':
                this.mealsDeliverDiv = true;
                break;
            default:
				break;
        }
    }

    updateFunc(){
        if(this.globalSer.networkStatus){
            this.presentLoading();
            console.log("user -> "+JSON.stringify(this.user));
            let statement = "";
            for(var j=0; j<this.allergicArr.length; j++){
                if(this.allergicArr[j].selected==true)
                    statement = statement + this.allergicArr[j].id+",";
            }    
            statement = statement.substring(0,statement.length-1);
            console.log("statement -> "+statement);
            let delStatus = this.user.mealsdeliverStatus=="YES"?"1":"0";
            let data = {
                "userID": localStorage.getItem("userID"),
                "dietID": parseInt(this.user.diet),
                "allergens": statement,
                "mealFrequency": parseInt(this.user.mealsType),
                "mealChangeFrequecyID": parseInt(this.user.switchMeal),
                "mealDelivery": parseInt(delStatus)
            }
            console.log("nutri data -> "+JSON.stringify(data));
            this.globalSer.postMethod(data,"nutritionFlow").then(apiSucc =>{
                this.apiObj = apiSucc;
                if(this.apiObj.statusCode=="200"){
                    this.db.delTwoTbl().then(delSucc =>{
                        this.insDataIntoTodaysMeal(this.apiObj.data,this.apiObj.data.length,statement,delStatus);
                    }).catch(delErr =>{
                        this.loading.dismiss();
                        console.log("delErr => "+JSON.stringify(delErr));
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

    insDataIntoTodaysMeal(recipeArr,total,allergic,delSta){
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
                        this.insDataIntoTodaysMeal(recipeArr,total,allergic,delSta);
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
            let clmnArr = ['dietID','allergicID','mealTypeID','switchMealID', 'mealsDeliverID'];
            let dataArr = [
                this.user.diet,
                allergic,
                this.user.mealsType,
                this.user.switchMeal,
                delSta,
                parseInt(localStorage.getItem("userID"))
            ];
            this.db.updateTbl('nutritionSavedDataTbl','userID',clmnArr,dataArr).then(uSucc =>{
                this.loading.dismiss();
                console.log("uSucc -> "+JSON.stringify(uSucc));
                let upAlert = this.alertCtrl.create({
                    title: 'FLEXIBLE FITNESS',            
                    subTitle: "Your nutrition setting has been updated successfully.",
                    enableBackdropDismiss: false,
                    buttons: [{
                        text: 'OK',
                        handler: () => {
                            this.navCtrl.pop();
                        }
                    }]        
                });
                upAlert.present();
            }).catch(uErr =>{
                this.loading.dismiss();
                console.log("uErr -> "+JSON.stringify(uErr));
            });
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
