import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { LocalDbProvider } from '../../providers/local-db/local-db';
import { ServicesProvider } from '../../providers/services/services';

@IonicPage()
@Component({
    selector: 'page-recipe-instruction-screen',
    templateUrl: 'recipe-instruction-screen.html',
})
export class RecipeInstructionScreenPage {
    loading:any;
    recipeObj = {
        img:"",
        name:"",
        cal:"",
        ins:""
    }
    ingTblArr:any = [];

    constructor(public navCtrl: NavController, public navParams: NavParams, public db: LocalDbProvider, public loader: LoadingController, public globalSer: ServicesProvider) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad RecipeInstructionScreenPage');
    }

    ionViewWillEnter(){
        console.log('will enter called');
        this.getIngredients();
    }

    getIngredients(){
        this.presentLoading();
        this.db.fetchDataFromRecipeIngredientTbl(this.globalSer.currTodaysMealObj.rID).then(ingSucc =>{
            this.ingTblArr = ingSucc;
            this.recipeObj.name = this.globalSer.currTodaysMealObj.rName;
            this.recipeObj.img = this.globalSer.currTodaysMealObj.img;
            this.recipeObj.cal = this.globalSer.currTodaysMealObj.cal;
            this.recipeObj.ins = this.globalSer.currTodaysMealObj.instruction;
            this.loading.dismiss();
        }).catch(ingErr =>{
            this.loading.dismiss();
            console.log("ingErr => "+JSON.stringify(ingErr));
        });
    }

    backBtnFunc(){
        this.navCtrl.pop();
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
