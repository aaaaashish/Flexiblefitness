import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ServicesProvider {
    baseUrl = "http://54.83.7.62:8080/FlexibleFitness/rest/";     
    //baseUrl = "http://172.16.1.133:8080/FlexibleFitness/rest/";
    header: any = {
        'Content-Type': 'application/json',
        "Authorization": "Basic " + btoa('mobiloitte' + ":" + 'Mobiloitte1')
    }
    signupUserName:any;
    serData:any;
    networkStatus:any;
    currUser:any = {};
    sqlObj:any;
    userData = {
        gender:"",
        unitOfMeasure:"",
        tallFtValue:"",
        tallInchValue:"",
        tallCMValue:"",
        weighValue:"",
        staOfBodyFatPer:"",
        valOfBodyFatPer:"",
        staOfSimpleMeasurement:"",
        maleWaistVal:"",
        femaleWaistVal:"",
        femaleWristVal:"",
        femaleHipVal:"",
        femaleforearmVal:"",
        ageValue:"",
        activityStatus :"",
        activityLevel:"",
        phyActStatus:"",
        daysPerWeekValue:"",
        weightGoalValue:"",
        hrsPerDayValue:"",
        catOfJobs:"",
        daysPerWeekActValue:"",
        hrsPerDayActValue:"",
        catOfTypesOfAct:"",
        staOfTimeConsToLoseWeight:"",
        staOfTimeConsToGainWeight:"",
        weightLoseValue:"",
        weightGainValue:"",
        timeHaveValue:"",
        timeHaveUnit:"",
        dietsValue:"",
        fitnessGoal:"",
        subscriptionPlan:"",
        subscriptionPlanID:"",
        proPlan:"",
        personalizedPlan:"",
        workoutReminder:"",
        skindOfDiet:"",
        sallergicStatus:"",
        showmanyMeals:"",
        SswitchMeals:"",
        smealsdeliverStatus:"",
        achWeightGoalValue:"",
        remHrsValue:"",
        proSubCatValue:"",
        persSubCatValue:"",
    };
    currWorkout = {
        name: "",
        ID:""
    };
    nutriSaveObj = {
        userID:"",
        kindOfDiat:"",
        allergance:"",
        howManyMeal:"",
        switchMeals:"",
        mealDeliverStatus:""
    }
    nutritionQueStatus = false;
    changePlanID = "";
    deviceUUID = "";
    devicePlatform = "";
    exercisesArr:any = [];
    currTodaysMealObj = {
        rID:"",
        rName:"",
        cal:"",
        img:"",
        instruction:""
    }
    changeRecipeObj = {
        uniID:"",
        rCat:"",
        rID:"",
    }
    apiViewRecipeObj:any;
    nutriSubCat:any;
    
    constructor(public http: HttpClient) {
        console.log('Hello ServicesProvider Provider');
    }    

    postMethod(data,apiName){
        return new Promise((resolve, reject) => {
            let url = this.baseUrl + apiName;
            this.http.post(url, data, { headers: this.header }).toPromise()
            .then((response) => {
                resolve(response);
            }).catch((error) => {
                reject(error);
            })
        });
    }

    getMethod(apiName){
        return new Promise((resolve, reject) => {
            let url = this.baseUrl + apiName;
            this.http.get(url, { headers: this.header }).toPromise()
            .then((response) => {
                resolve(response);
            }).catch((error) => {
                reject(error);
            })
        });
    }
}
