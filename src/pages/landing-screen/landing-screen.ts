import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';


@IonicPage()
@Component({
    selector: 'page-landing-screen',
    templateUrl: 'landing-screen.html',
})
export class LandingScreenPage {
    images=['assets/imgs/slide1.jpg','assets/imgs/slide2.jpg','assets/imgs/slide3.jpg','assets/imgs/slide4.jpg']
    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad LandingScreenPage');
    }
    nextFunc(){
        this.navCtrl.push(LoginPage);
    }
}