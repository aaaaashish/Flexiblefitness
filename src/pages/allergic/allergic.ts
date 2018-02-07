import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { HowManyMealsPage } from '../how-many-meals/how-many-meals';
import { ServicesProvider } from '../../providers/services/services';
import { LocalDbProvider } from '../../providers/local-db/local-db';

@IonicPage()
@Component({
    selector: 'page-allergic',
    templateUrl: 'allergic.html',
})
export class AllergicPage {
    loading:any;
    notSelected = false;
    allerganceObj:any;
    allergicArr:any = [];

    constructor(public navCtrl: NavController, public navParams: NavParams,  public globalSer: ServicesProvider, public toastCtrl: ToastController, public loader: LoadingController, public db: LocalDbProvider) {
    }

    ionViewWillEnter(){
        this.getAllAllergance();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad AllergicPage');
    }

    getAllAllergance(){
        this.presentLoading();
        this.db.fetchDataFromAllerganceListTbl().then(feSucc =>{
            this.loading.dismiss();
            this.allerganceObj = feSucc;
            this.allergicArr = [];
            for(var i=0; i<this.allerganceObj.length; i++){
                this.allergicArr.push({
                    name: this.allerganceObj[i].allergenName,
                    id: this.allerganceObj[i].allergenID,
                    selected: false
                });
            }
        }).catch(feErr =>{
            this.loading.dismiss();
            console.log("feErr -> "+JSON.stringify(feErr));
        });
    }

    nextFunc(type){
        if(type==1){
            for(var i=0; i<this.allergicArr.length; i++){
                if(this.allergicArr[i].selected==true){
                    this.notSelected = true;
                    break;
                }else
                this.notSelected = false;
            }
            if(this.notSelected == true){
                let statement = "";
                for(var j=0; j<this.allergicArr.length; j++){
                    if(this.allergicArr[j].selected==true)
                        statement = statement + this.allergicArr[j].id+",";
                }    
                statement = statement.substring(0,statement.length-1);
                console.log("statement -> "+statement);
                this.globalSer.nutriSaveObj.allergance = statement;
                this.navCtrl.push(HowManyMealsPage);
            }else
                this.showErr();
        }else{
            console.log("skiped");
            this.globalSer.nutriSaveObj.allergance = "";
            this.navCtrl.push(HowManyMealsPage);
        }              
    }

    showErr(){
        let toast = this.toastCtrl.create({
            message: "Select any option.",
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
