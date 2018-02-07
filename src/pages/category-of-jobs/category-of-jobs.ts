import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ServicesProvider } from '../../providers/services/services';
import { PhysicalActivityPage } from '../physical-activity/physical-activity';

@IonicPage()
@Component({
  selector: 'page-category-of-jobs',
  templateUrl: 'category-of-jobs.html',
})
export class CategoryOfJobsPage {
    jobCategory : any = "Professional";
    constructor(public navCtrl: NavController, public navParams: NavParams, public globalSer: ServicesProvider) {
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad CategoryOfJobsPage');
    }
    backBtnFunc(){
        this.globalSer.userData.catOfJobs = "";
        this.navCtrl.pop();
    }
    nextFunc(){
        console.log("catOfJobs=> "+this.jobCategory);
        this.globalSer.userData.catOfJobs = this.jobCategory;
        this.navCtrl.push(PhysicalActivityPage);
    }
}
