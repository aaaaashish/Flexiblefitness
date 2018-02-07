import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { App } from 'ionic-angular/components/app/app';
import { LogyourOwnFoodPage } from '../logyour-own-food/logyour-own-food';
import { ExercisesPage } from '../exercises/exercises';

@IonicPage()
@Component({
    selector: 'page-popover',
    templateUrl: 'popover.html',
})
export class PopoverPage {
    items = ["Log activity","Log meal"];
    constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public app : App) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad PopoverPage');
    }

    itemSelected(type){
        if(type=="Log activity")
            this.app.getRootNav().push(ExercisesPage);
        else
            this.app.getRootNav().push(LogyourOwnFoodPage);
        this.viewCtrl.dismiss();
    }
}
