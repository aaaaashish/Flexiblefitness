import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ServicesProvider } from '../../providers/services/services';

@IonicPage()
@Component({
    selector: 'page-api-view-recipe',
    templateUrl: 'api-view-recipe.html',
})
export class ApiViewRecipePage {
    loading:any;
    recipeObj = {
        name:"",
        img:"",
        cal:"",
        ins:""
    }
    ingListArr:any = [];

    constructor(public navCtrl: NavController, public navParams: NavParams, public loader: LoadingController, public globalSer: ServicesProvider) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ApiViewRecipePage');
    }

    ionViewWillEnter(){
        this.setData();
    }

    setData(){
        this.recipeObj.name = this.globalSer.apiViewRecipeObj.recipeName;
        this.recipeObj.img = this.globalSer.apiViewRecipeObj.foodImage;
        this.recipeObj.cal = this.globalSer.apiViewRecipeObj.calories;
        this.recipeObj.ins = this.globalSer.apiViewRecipeObj.instructions;
        this.ingListArr = this.globalSer.apiViewRecipeObj.ingredientsList;
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
