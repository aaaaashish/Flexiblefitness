import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { ServicesProvider } from '../../providers/services/services';

@IonicPage()
@Component({
    selector: 'page-weekly-grocery-list-screen',
    templateUrl: 'weekly-grocery-list-screen.html',
})
export class WeeklyGroceryListScreenPage {
    loading: any;
    daysArr = [{value:"1"},{value:"2"},{value:"3"},{value:"4"},{value:"5"},{value:"6"},{value:"7"}];
    daysVal:any= "7";
    selArr:any = [];
    noListFound = false;
    groceryListArr:any = [];
    apiObj:any;    
    saveGObj:any;
    
    constructor(public navCtrl: NavController, public navParams: NavParams, public loader: LoadingController, public toastCtrl: ToastController, public globalSer: ServicesProvider, public alertCtrl: AlertController) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad WeeklyGroceryListScreenPage');
        this.callAPIFunc();
    }

    backBtnFunc(){
        //this.navCtrl.pop();
        this.submitFunc()
    }

    submitFunc(){
        if(this.groceryListArr.length!=0){
            this.selArr = [];
            for(var i=0; i<this.groceryListArr.length; i++){
                if(this.groceryListArr[i].selected==true){
                    this.selArr.push({
                        "ingredientID": this.groceryListArr[i].ingredientID,
                        "ingredientName": this.groceryListArr[i].ingredientName,
                        "unit": this.groceryListArr[i].unit,
                        "ingredientQty": (parseInt(this.daysVal)*(parseFloat(this.groceryListArr[i].ingredientQty))),
                        "recipeIngredientTime": new Date().getTime(),
                        "userID": localStorage.getItem("userID")
                    });
                }
                if(i==this.groceryListArr.length-1){
                    if(this.selArr.length==0)
                        this.navCtrl.pop();
                    else{
                        this.submitGroceryList();
                    }
                }
            }
        }else{
            this.navCtrl.pop();
        }
    }

    callAPIFunc(){
        this.presentLoading();
        this.globalSer.getMethod("getUserWeeklyGroceryList?userID="+localStorage.getItem("userID")).then(succ=>{
            this.loading.dismiss();  
            this.apiObj = succ;
            if(this.apiObj.statusCode=="200"){
                this.groceryListArr=this.apiObj.data;
                this.groceryListArr.length!=0?this.noListFound=false:this.noListFound=true;
            }else{
                console.log("other respomse => "+JSON.stringify(this.apiObj));
            }
        }).catch(err=>{
            this.loading.dismiss();
            console.log("getUserWeekly_err => "+JSON.stringify(err));
        });
    }

    submitGroceryList(){
        this.presentLoading();
        this.globalSer.postMethod(this.selArr,"saveUserWeeklyGroceryList").then(saveGSucc =>{
            this.loading.dismiss();
            this.saveGObj = saveGSucc;
            if(this.saveGObj.statusCode=="200"){
                let alert = this.alertCtrl.create({
                    title: 'FLEXIBLE FITNESS',            
                    subTitle: "Your weekly grocery list has been updated successfully.",
                    enableBackdropDismiss: false,
                    buttons: [{
                        text: 'OK',
                        handler: () => {
                            this.navCtrl.pop();
                        }
                    }]        
                });
                alert.present();
            }else{
                console.log("other res => "+JSON.stringify(this.saveGObj));   
            }
        }).catch(saveGErr =>{
            this.loading.dismiss();
            console.log("saveGErr => "+JSON.stringify(saveGErr));
        });
    }

    showErr(msg){
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
