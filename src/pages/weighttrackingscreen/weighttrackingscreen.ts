import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';
import { CalorieMacroTargetPage } from '../calorie-macro-target/calorie-macro-target';
import { App } from 'ionic-angular/components/app/app';

@IonicPage()
@Component({
    selector: 'page-weighttrackingscreen',
    templateUrl: 'weighttrackingscreen.html',
})
export class WeighttrackingscreenPage {
    user = {
        "weight":""
    }
    //numRegxForDot = (/^[0-9.]*$/);
    numRegxForDot = (/^(\d+)?([.]?\d{0,1})?$/);
    weightErr = false;
    @ViewChild('lineCanvas') lineCanvas;
    lineChart: any;
    constructor(public navCtrl: NavController, public navParams: NavParams, public app: App) {
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad WeightPage');
        this.lineChart = this.getLineChart();
    }
    getChart(context, chartType, data, options?) {
        return new Chart(context, {
            type: chartType,
            data: data,
            options: options
        });
    }
    getLineChart() {
        var data = {
            labels: ["January", "February", "March", "April", "May", "June", "July", "August"],
            datasets: [{
                label: "GRAPH",
                fill: false,
                lineTension: 0.1,
                backgroundColor: "#fff",
                borderColor: "#D3D3D3",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 5,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 5,
                pointRadius: 5,
                pointHitRadius: 10,
                data: [65, 59, 80, 81, 56, 55, 40, 32],
                spanGaps: false,},]
        };
        return this.getChart(this.lineCanvas.nativeElement, "line", data);
    }
    
    weightBlurFunc(){
        if(this.user.weight!=""){
            if(parseFloat(this.user.weight)==0){
                this.weightErr = true;
                return;
            }else if(!this.numRegxForDot.test(this.user.weight) || parseFloat(this.user.weight)>100){
                this.weightErr = true;
                return;
            }else{
                this.weightErr = false;
            }
        }else{
            this.weightErr = false;
        }
    }

    saveFunc(){
        this.user.weight = "";
        this.app.getRootNav().push(CalorieMacroTargetPage);
    }

    cancelFunc(){
        this.user.weight = "";
        this.weightErr = false;
    }
}
