import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { ActionSheet, ActionSheetOptions } from '@ionic-native/action-sheet';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { SocialSharing } from '@ionic-native/social-sharing';
import { LocalDbProvider } from '../../providers/local-db/local-db';
import { DomSanitizer} from '@angular/platform-browser';

@IonicPage()
@Component({
    selector: 'page-upload-progresspicture',
    templateUrl: 'upload-progresspicture.html',
})
export class UploadProgresspicturePage {
    loading:any;
    alertMsg:any;
    fetchArr:any = [];
    //currImg:any = "assets/imgs/body2.jpg";
    currImg:any = "";
    listOfImgArr:any = [];
    todayListArr:any = [];
    options: {
        maximumImagesCount: number;width: number;height: number;quality: number;
    };
    public base64Image: string;
    constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera, private alertCtrl: AlertController, private actionSheet: ActionSheet, private socialSharing: SocialSharing, public toastCtrl: ToastController, public db: LocalDbProvider, private domSanitizer: DomSanitizer, public loader: LoadingController)  {
    }

    ionViewWillEnter(){
        console.log("will enter called");
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad UploadProgresspicturePage');
        this.fetchProgressPic();
    }

    goBackFunc(){
        this.navCtrl.pop();
    }
    
    fetchProgressPic(){
        this.presentLoading();
        this.db.fetchDataFromProgressPicTbl(localStorage.getItem("userID")).then(fSucc =>{
            this.fetchArr = fSucc;
            //this.currImg = this.domSanitizer.bypassSecurityTrustResourceUrl(this.fetchArr[0].picture);
            if(this.fetchArr.length>0)
                this.currImg = this.fetchArr[0].picture;
            if(this.fetchArr.length>0){
                this.listOfImgArr = [];
                for(var i=0; i<this.fetchArr.length; i++){
                    this.listOfImgArr.push({
                        //img: this.domSanitizer.bypassSecurityTrustResourceUrl(this.fetchArr[i].picture)
                        img: this.fetchArr[i].picture
                    });
                }
            }
            this.loading.dismiss();
        }).catch(fErr =>{
            this.loading.dismiss();
            console.log("Home_fErr => "+JSON.stringify(fErr));
        });
    }

    uploadPhoto() {
        this.presentLoading();
        let count = 0;
        this.db.fetchUploadPicToday(localStorage.getItem("userID")).then(checkSucc =>{
            this.loading.dismiss();
            this.todayListArr = checkSucc;
            if(this.todayListArr.length==0){
                this.takePhotoFunc();
            }
            else{
                this.todayListArr.forEach((ele,ind) => {
                    let today = new Date();
                    let past = new Date(ele.progressPicUpdateTime);
                    today.toDateString()===past.toDateString()?count++:"";
                    if(ind==this.todayListArr.length-1){
                        if(count<5)
                            this.takePhotoFunc();
                        else{
                            let alert = this.alertCtrl.create({
                                title: 'FLEXIBLE FITNESS',            
                                subTitle: "You have already uploaded five pictures for the day.",
                                enableBackdropDismiss:false,
                                buttons: [{
                                    text: 'OK',
                                    handler: () => {
                                    }
                                }]        
                            });
                            alert.present();
                        }
                    }
                });
            }
        }).catch(checkErr =>{
            this.loading.dismiss();
            console.log("checkErr => "+JSON.stringify(checkErr));
        });
    }

    takePhotoFunc(){
        let buttonLabels = ['Camera', 'Gallery'];
        const options: ActionSheetOptions = {
            title: 'Choose image',
            buttonLabels: buttonLabels,
            addCancelButtonWithLabel: 'Cancel',
            androidTheme: this.actionSheet.ANDROID_THEMES.THEME_HOLO_DARK,
            destructiveButtonLast: true
        };
        this.actionSheet.show(options).then((buttonIndex: number) => {
            if (buttonIndex == 1) {
                const options: CameraOptions = {
                    quality: 50, // picture quality
                    destinationType: this.camera.DestinationType.DATA_URL,
                    //destinationType: this.camera.DestinationType.FILE_URI,
                    encodingType: this.camera.EncodingType.JPEG,
                    mediaType: this.camera.MediaType.PICTURE
                }
                this.camera.getPicture(options).then((imageData) => {
                    //this.currImg = "data:image/jpeg;base64," + imageData;
                    let bsData = "data:image/jpeg;base64," + imageData;
                    this.insertPicIntoDB(bsData);
                }, (err) => {
                    console.log(err);
                });
            }
            if (buttonIndex == 2) {
                const options: CameraOptions = {
                    quality: 50,
                    destinationType: this.camera.DestinationType.DATA_URL,
                    //destinationType: this.camera.DestinationType.FILE_URI,
                    encodingType: this.camera.EncodingType.JPEG,
                    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
                    mediaType: this.camera.MediaType.PICTURE
                }
                this.camera.getPicture(options).then((imageData) => {
                    //this.currImg = 'data:image/jpeg;base64,' + imageData;
                    let bsData = "data:image/jpeg;base64," + imageData;
                    this.insertPicIntoDB(bsData);
                }, (err) => {
                    // Handle error
                });
            }
        });
    }

    insertPicIntoDB(base64){
        this.presentLoading();
        this.db.insDataIntoProgressPicTbl(parseInt(localStorage.getItem("userID")),base64,new Date().getTime()).then(insSucc => {
            this.loading.dismiss();
            this.fetchProgressPic();
        }).catch(insErr =>{
            this.loading.dismiss();
            console.log("pic insErr => "+JSON.stringify(insErr));
        });
    }

    fbShare(){ 
        this.socialSharing.shareViaFacebook('Flexible Fitness picture', this.currImg,'url').then((Success) => {
            console.log("fb share succ");
        }).catch(() => {
            this.alertMsg = "Please install Facebook application on your device.";
            this.showErr();
        });
    }

    instaShare(){
        this.socialSharing.shareViaInstagram('Flexible Fitness picture', this.currImg).then(()=>{
            console.log("insta share succ");
        }).catch((error)=>{
            this.alertMsg = "Please install Instagram application on your device.";
            this.showErr();
        });
    }       
        
    showErr(){
        let toast = this.toastCtrl.create({
            message: this.alertMsg,
            duration: 3000,
            position: 'bottom',
            cssClass: "ff-toast"
        });
        toast.present();
    }

    setImg(obj){
        this.currImg = obj.img
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

    presentLoading(){
        this.loading = this.loader.create({
            spinner: "crescent",
            content: 'Please wait...',
            cssClass: "ff-loader"
        });
        this.loading.present();
    }
}
