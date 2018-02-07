import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { WorkoutListPage } from '../workout-list/workout-list';
import { App } from 'ionic-angular/components/app/app';
import { ExercisesPage } from '../exercises/exercises';

@IonicPage()
@Component({
    selector: 'page-workoutscreen',
    templateUrl: 'workoutscreen.html',
})
export class WorkoutscreenPage {
    constructor(public navCtrl: NavController, public navParams: NavParams, public app: App) {
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad WorkoutscreenPage');
    }
    goToWorkoutList(){
        this.app.getRootNav().push(WorkoutListPage);
    }

    goToExerciseList(){
        this.app.getRootNav().push(ExercisesPage);
    }
}
