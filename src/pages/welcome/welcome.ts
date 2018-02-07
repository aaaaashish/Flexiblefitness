import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { ActionSheet, ActionSheetOptions } from '@ionic-native/action-sheet';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { GenderScreenPage } from '../gender-screen/gender-screen';
import { ServicesProvider } from '../../providers/services/services';

@IonicPage()
@Component({
    selector: 'page-welcome',
    templateUrl: 'welcome.html',
})
export class WelcomePage {
    name:any;
    usersignup: Object={};
    index: any;
    //imgSrc : string = "assets/imgs/proPic.png";
    imgSrc : string = "assets/imgs/profile_picNew.png";
    constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera,private actionSheet: ActionSheet, public globalSer: ServicesProvider, public alertCtrl: AlertController, public loader: LoadingController, public toastCtrl: ToastController) {      
        this.name =  this.globalSer.signupUserName;  
        //console.log("currUser=> "+JSON.stringify(this.globalSer.currUser));
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad WelcomePage');
    }

    upload(){
        let buttonLabels = ['Take a Picture', 'From Gallery'];
        const options: ActionSheetOptions = {
            title: 'CHOOSE PICTURE',
            subtitle: 'Choose an action',
            buttonLabels: buttonLabels,
            addCancelButtonWithLabel: 'Cancel',
            //addDestructiveButtonWithLabel: 'Delete',
            androidTheme: this.actionSheet.ANDROID_THEMES.THEME_HOLO_DARK,
            destructiveButtonLast: true
        };
        this.actionSheet.show(options).then((buttonIndex: number) => {
            var index=buttonIndex;
            console.log(index)
            if(index==1){
                this.camerafnc();
                console.log('camera selected')
            }else if(index==2){
                this.galleryfnc();
                console.log('gallery selected')
            }
        });
    }

    camerafnc(){
        const options: CameraOptions = {
            quality: 50,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            allowEdit: true
        }
        this.camera.getPicture(options).then((imageData) => {
            // imageData is either a base64 encoded string or a file URI
            // If it's base64:
            let base64Image = 'data:image/jpeg;base64,' + imageData;
            this.imgSrc = "";
            this.imgSrc = base64Image;
        }, (err) => {
            // Handle error
        });
    }

    galleryfnc(){
        const options: CameraOptions = {
            quality: 50,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            mediaType: this.camera.MediaType.PICTURE,
            allowEdit: true
        }
        this.camera.getPicture(options).then((imageData) => {
            // imageData is either a base64 encoded string or a file URI
            // If it's base64:
            let base64Image = 'data:image/jpeg;base64,' + imageData;
            this.imgSrc = "";
            this.imgSrc = base64Image;
        }, (err) => {
            // Handle error
        });
    }

    getStarted(){
        if(this.imgSrc == "assets/imgs/profile_picNew.png"){
            let alert = this.alertCtrl.create({
                title: 'FLEXIBLE FITNESS',            
                subTitle: 'Would you like to proceed without setting profile picture?',
                buttons: [{
                    text: 'OK',
                    handler: () => {
                        this.navCtrl.push(GenderScreenPage);
                    }
                },{
                    text: 'Cancel',
                    role: 'Cancel',
                    handler: () => {
                        console.log("cancel");
                    }
                }]        
            });
            alert.present();
        }else{
            this.apiCallFunc();
            //this.navCtrl.push(GenderScreenPage);
        }
    }

    apiCallFunc(){
        if(this.globalSer.networkStatus){
            //console.log("currUser=> "+JSON.stringify(this.globalSer.currUser));
            let data = {
                "users": {
                    "userID": this.globalSer.currUser.userID
                },            
                "picture": this.imgSrc.split(',')[1]      
            }
            let loading = this.loader.create({
                spinner: "crescent",
                content: 'Please wait...',
                cssClass: "ff-loader"
            });
            loading.present();
            this.globalSer.postMethod(data,"uploadProgressImage").then(succ=>{
                loading.dismiss();
                console.log("uploadPic_succ=> "+JSON.stringify(succ));
                this.globalSer.serData = succ;
                if(this.globalSer.serData.statusCode=="200"){
                    this.navCtrl.push(GenderScreenPage);
                }else{
                    let alert = this.alertCtrl.create({
                        title: 'FLEXIBLE FITNESS',            
                        subTitle: this.globalSer.serData.message,
                        enableBackdropDismiss: false,
                        buttons: [{
                            text: 'OK',
                            handler: () => {
                                this.navCtrl.push(GenderScreenPage);
                            }
                        }]        
                    });
                    alert.present();
                }
            }).catch(err=>{
                loading.dismiss();
                console.log("uploadPic_err=> "+JSON.stringify(err));
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
}
