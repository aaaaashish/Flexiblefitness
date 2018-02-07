import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ItemSliding } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-notificationscreen',
    templateUrl: 'notificationscreen.html',
})
export class NotificationscreenPage {
    logins: any[];
    constructor(public navCtrl: NavController, public navParams: NavParams,) {        
        this.logins = [
        {
            time: '1 min ago',
            text: 'Have you gotten a workout in today? Remember that you can work out anywhere, anytime!',
        }, {
            time: '1 min ago',
            text: 'Have you gotten a workout in today? Remember that you can work out anywhere, anytime!',
        },{
            time: '1 min ago',
            text: 'Have you gotten a workout in today? Remember that you can work out anywhere, anytime!',
        },{
            time: '1 min ago',
            text: 'Have you gotten a workout in today? Remember that you can work out anywhere, anytime!',
        },{
            time: '1 min ago',
            text: 'Have you gotten a workout in today? Remember that you can work out anywhere, anytime!',
        },{
            time: '1 min ago',
            text: 'Have you gotten a workout in today? Remember that you can work out anywhere, anytime!',
        }];
    }          
        
    delete(item: ItemSliding) {
        console.log('Delete');
        item.close();
    }        
    ionViewDidLoad() {
        console.log('ionViewDidLoad NotificationscreenPage');
    }
    backBtnFunc(){
        this.navCtrl.pop();
    }

}
