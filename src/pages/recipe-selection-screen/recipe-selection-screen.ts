import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { TodaysMealsPage } from '../todays-meals/todays-meals';
import { ServicesProvider } from '../../providers/services/services';
import { LocalDbProvider } from '../../providers/local-db/local-db';
import { ApiViewRecipePage } from '../api-view-recipe/api-view-recipe';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

@IonicPage()
@Component({
    selector: 'page-recipe-selection-screen',
    templateUrl: 'recipe-selection-screen.html',
})
export class RecipeSelectionScreenPage {
    loading:any;
    recipeArr:any = [];
    apiObj:any;
    rsObj:any;
    noListFound = false;

    constructor(public navCtrl: NavController, public navParams: NavParams, public globalSer: ServicesProvider, public db: LocalDbProvider, private alertCtrl: AlertController, public loader: LoadingController) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad RecipeSelectionScreenPage');
    }
    
    ionViewWillEnter(){
        console.log("uniID -> "+this.globalSer.changeRecipeObj.uniID);
        this.callApiForRecipeList();
    }

    backBtnFunc(){
        this.navCtrl.pop();
    }

    callApiForRecipeList(){
        this.presentLoading();
        let rID = this.globalSer.changeRecipeObj.rID;
        let rCat = this.globalSer.changeRecipeObj.rCat;
        this.globalSer.getMethod("getChangeRecipeList?recipieCategory="+rCat+"&recipieID="+rID+"&userID="+localStorage.getItem("userID")).then(apiSucc =>{
            this.loading.dismiss();
            this.apiObj = apiSucc;
            this.recipeArr = [];
            if(this.apiObj.statusCode=="200"){
                this.recipeArr = this.apiObj.data;
                this.recipeArr.length!=0?this.noListFound=false:this.noListFound=true;
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
            console.log("apiErr -> "+JSON.stringify(apiErr));
        });
    }

    viewRecipe(obj){
        this.globalSer.apiViewRecipeObj = obj;
        this.navCtrl.push(ApiViewRecipePage);
    }

    selectFunc(obj){
        this.presentLoading();
        let data = {
            "recipeCategory": obj.recipeCategory,
            "recipeID": obj.recipeID,
            "userID": localStorage.getItem("userID")
        }
        this.globalSer.postMethod(data,"selectRecipe").then(selRecSucc =>{
            this.rsObj = selRecSucc;
            if(this.rsObj.statusCode=="200"){
                this.getBase64ImageFromURL(obj.foodImage).subscribe(base64data => {
                    let bsData = 'data:image/jpg;base64,'+base64data;
                    this.db.delFromRecipeIngredientTbl(obj.recipeID).then(reDelSucc =>{
                        this.db.insIntoRecipeIngredientTbl(obj.recipeID,obj.ingredientsList).then(increInsSucc =>{
                            let clmnArr = ['recipeID', 'recipeName', 'recipeCategory', 'mealLabel', 'calories', 'foodImage', 'instructions'];
                            let dataArr = [
                                obj.recipeID,
                                obj.recipeName,
                                obj.recipeCategory,
                                obj.mealLabel,
                                obj.calories,
                                bsData,
                                obj.instructions,
                                parseInt(this.globalSer.changeRecipeObj.uniID)
                            ];
                            this.db.updateTbl('userTodaysMealTbl','uniID',clmnArr,dataArr).then(uSucc =>{
                                this.loading.dismiss();
                                console.log("uSucc -> "+JSON.stringify(uSucc));
                                this.navCtrl.push(TodaysMealsPage);
                            }).catch(uErr =>{
                                this.loading.dismiss();
                                console.log("uErr -> "+JSON.stringify(uErr));
                            });
                        }).catch(increInsErr =>{
                            this.loading.dismiss();
                            console.log("increInsErr => "+JSON.stringify(increInsErr));
                        });
                    }).catch(reDelErr =>{
                        this.loading.dismiss();
                        console.log("reDelErr => "+JSON.stringify(reDelErr));
                    });
                });
            }else{
                this.loading.dismiss();
                console.log("other res => "+JSON.stringify(this.rsObj));
            }
        }).catch(selRecErr =>{
            this.loading.dismiss();
            console.log("selRecErr => "+JSON.stringify(selRecErr));
        });
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

    presentLoading(){
        this.loading = this.loader.create({
            spinner: "crescent",
            content: 'Please wait...',
            cssClass: "ff-loader"
        });
        this.loading.present();
    }
}
