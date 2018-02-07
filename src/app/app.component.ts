import { Component, ViewChild } from '@angular/core';
import { Platform, AlertController, Nav, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';
import { Network } from '@ionic-native/network';
import { SQLite } from '@ionic-native/sqlite';
import { Device } from '@ionic-native/device';

import { LoginPage } from '../pages/login/login';
import{ LandingScreenPage } from '../pages/landing-screen/landing-screen';
import { ServicesProvider } from '../providers/services/services';
import { TabsPage } from '../pages/tabs/tabs';
import { LocalDbProvider } from '../providers/local-db/local-db';
import { SyncProvider } from '../providers/sync/sync';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    //rootPage: any = LandingScreenPage;
    tipObj:any;
    rootPage: any;
    @ViewChild(Nav) nav: Nav;
    constructor(public platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, keyboard: Keyboard, public alertCtrl: AlertController, public network: Network, public globalSer: ServicesProvider, public sqlite: SQLite, public db: LocalDbProvider, public loader: LoadingController, private device: Device, public sync: SyncProvider) {
        platform.ready().then(() => {
            this.globalSer.deviceUUID = this.device.uuid;
            this.globalSer.devicePlatform = this.device.platform;
            console.log("UUID -> "+this.globalSer.deviceUUID+" platform -> "+this.globalSer.devicePlatform);
            if (platform.is("ios")) {
                statusBar.overlaysWebView(true);
            }
            statusBar.styleDefault();
            splashScreen.hide();
            keyboard.hideKeyboardAccessoryBar(false);
            platform.registerBackButtonAction((e)=>this.handleHWBackBtn(e));
            console.log("network=> "+navigator.onLine);
            globalSer.networkStatus = navigator.onLine;
            this.network.onConnect().subscribe(() => {
                console.log('network connected');
                globalSer.networkStatus = true;
                if(localStorage.getItem('userID')!=null && localStorage.getItem('userID')!=""){
                    this.globalSer.getMethod("tipForTheDay").then(tipSucc =>{
                        this.tipObj = tipSucc;
                        if(this.tipObj.statusCode=="200"){
                            this.db.delDataFromTooltipTbl().then(dSucc =>{
                                let data = {
                                    tipID: this.tipObj.data.dailyTipID,
                                    tipDesc: this.tipObj.data.dailyTip
                                }
                                this.db.insIntoDailyTipTbl(data).then(tipInsSucc =>{
                                }).catch(tipInsErr =>{
                                    console.log("tipInsErr -> "+JSON.stringify(tipInsErr));
                                });
                            }).catch(dErr =>{
                                console.log("dErr -> "+JSON.stringify(dErr));
                            });
                        }
                    }).catch(tipErr =>{
                        console.log("tipErr -> "+JSON.stringify(tipErr));
                    });
                }else
                    console.log("user not logged in.");
            });
            this.network.onDisconnect().subscribe(() => {
                console.log('network was disconnected');
                globalSer.networkStatus = false;
            });

            let loading = loader.create({
                spinner: "crescent",
                content: 'Please wait...',
                cssClass: "ff-loader"
            });
            loading.present();
            db.createDB().then(dbSucc =>{
                console.log("db create succ -> "+JSON.stringify(dbSucc));
                loading.dismiss();
                if(localStorage.getItem('first_launch')==null){
                    this.nav.setRoot(LandingScreenPage);                
                    localStorage.setItem('first_launch','false');
                }else{
                    console.log("userID-> "+localStorage.getItem('userID'));
                    if(localStorage.getItem('userID')!=null && localStorage.getItem('userID')!=""){
                        this.nav.setRoot(TabsPage);
                    }
                    else
                        this.nav.setRoot(LoginPage);
                }
            }).catch(dbErr =>{
                loading.dismiss();
                console.log("db create err -> "+JSON.stringify(dbErr));
            });
        });

        /**** Function to sync data to server ****/
        setInterval(function () {
            if(globalSer.networkStatus){
                if(localStorage.getItem('userID')!=null && localStorage.getItem('userID')!="")
                    sync.syncDataToServer();
                else
                    console.log("user not logged in.");
            }
            else
                console.log("no network for sync");
        }, 120000);
    }

    handleHWBackBtn(e){
        let alert = this.alertCtrl.create({
            title: 'FLEXIBLE FITNESS',            
            subTitle: 'Would you like to exit from application?',
            buttons: [{
                text: 'OK',
                handler: () => {
                    this.platform.exitApp();
                }
            },{
                text: 'Cancel',
                handler: () => {
                    console.log("cancel");
                }
            }]        
        });
        alert.present();
    }
}

