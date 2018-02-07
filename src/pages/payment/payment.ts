import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav } from 'ionic-angular';
import { ServicesProvider } from '../../providers/services/services';
import { AddPaymentPage } from '../add-payment/add-payment';

@IonicPage()
@Component({
    selector: 'page-payment',
    templateUrl: 'payment.html',
})
export class PaymentPage {
    constructor(public navCtrl: NavController, public navParams: NavParams, public nav: Nav, public globalSer: ServicesProvider) {
    }
    ionViewDidLoad() {
      console.log('ionViewDidLoad PaymentPage');
    }
    backBtnFunc(){
        console.log("called");
        this.navCtrl.pop();
    }
    addFunc(){
        this.navCtrl.push(AddPaymentPage);
    }
}
