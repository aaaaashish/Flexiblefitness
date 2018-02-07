import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Keyboard } from '@ionic-native/keyboard';
import { ActionSheet } from '@ionic-native/action-sheet';
import { Camera } from '@ionic-native/camera';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Network } from '@ionic-native/network';
import { Stripe } from '@ionic-native/stripe';
import { Facebook } from '@ionic-native/facebook';
import { SQLite } from '@ionic-native/sqlite';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Device } from '@ionic-native/device';



import { MyApp } from './app.component';
import { LoginPageModule } from '../pages/login/login.module';
import { SignupPageModule } from '../pages/signup/signup.module';
import { WelcomePageModule } from '../pages/welcome/welcome.module';
import { UnitOfMeasurementPageModule } from '../pages/unit-of-measurement/unit-of-measurement.module';
import { TallMeasurePageModule } from '../pages/tall-measure/tall-measure.module';
import { WeightMeasurePageModule } from '../pages/weight-measure/weight-measure.module';
import { BodyFatPercentagePageModule } from '../pages/body-fat-percentage/body-fat-percentage.module';
import { EnterBodyFatPageModule } from '../pages/enter-body-fat/enter-body-fat.module';
import { SimpleMeasurementPageModule } from '../pages/simple-measurement/simple-measurement.module';
import { AgeMeasurementPageModule } from '../pages/age-measurement/age-measurement.module';
import { SimpleMeasurementYesPageModule } from '../pages/simple-measurement-yes/simple-measurement-yes.module';
import { ActivityLevelPageModule } from '../pages/activity-level/activity-level.module';
import { WeightGoalPageModule } from '../pages/weight-goal/weight-goal.module';
import { DaysOfWorkPageModule } from '../pages/days-of-work/days-of-work.module';
import { HoursOfWorkPageModule } from '../pages/hours-of-work/hours-of-work.module';
import { CategoryOfJobsPageModule } from '../pages/category-of-jobs/category-of-jobs.module';
import { TypeOfExercisePageModule } from '../pages/type-of-exercise/type-of-exercise.module';
import { LandingScreenPageModule } from '../pages/landing-screen/landing-screen.module';
import { ServicesProvider } from '../providers/services/services';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { GenderScreenPageModule } from '../pages/gender-screen/gender-screen.module';
import { DatePipe } from '@angular/common';
import { ForgotPasswordPageModule } from '../pages/forgot-password/forgot-password.module';
import { FitnessGoalPageModule } from '../pages/fitness-goal/fitness-goal.module';
import { TermConditionPageModule } from '../pages/term-condition/term-condition.module';
import { PrivacyPolicyPageModule } from '../pages/privacy-policy/privacy-policy.module';
import { TabsPageModule } from '../pages/tabs/tabs.module';
import { WorkoutscreenPageModule } from '../pages/workoutscreen/workoutscreen.module';
import { SettingPageModule } from '../pages/setting/setting.module';
import { NutritionPageModule } from '../pages/nutrition/nutrition.module';
import { FoodtrackingscreenPageModule } from '../pages/foodtrackingscreen/foodtrackingscreen.module';
import { WeighttrackingscreenPageModule } from '../pages/weighttrackingscreen/weighttrackingscreen.module';
import { NotificationscreenPageModule } from '../pages/notificationscreen/notificationscreen.module';
import { GoalsettingsPageModule } from '../pages/goalsettings/goalsettings.module';
import { PaymentPageModule } from '../pages/payment/payment.module';
import { SocialmediaPageModule } from '../pages/socialmedia/socialmedia.module';
import { MyaccountPageModule } from '../pages/myaccount/myaccount.module';
import { ChangePasswordPageModule } from '../pages/change-password/change-password.module';
import { ExercisesPageModule } from '../pages/exercises/exercises.module';
import { ExerciseDetailPageModule } from '../pages/exercise-detail/exercise-detail.module';
import { AddPaymentPageModule } from '../pages/add-payment/add-payment.module';
import { WorkoutListPageModule } from '../pages/workout-list/workout-list.module';
import { WorkoutDetailPageModule } from '../pages/workout-detail/workout-detail.module';
import { AddFoodPageModule } from '../pages/add-food/add-food.module';
import { CalorieMacroTargetPageModule } from '../pages/calorie-macro-target/calorie-macro-target.module';
import { HoomePageModule } from '../pages/hoome/hoome.module';
import { KindOfDietPageModule } from '../pages/kind-of-diet/kind-of-diet.module';
import { AllergicPageModule } from '../pages/allergic/allergic.module';
import { HowManyMealsPageModule } from '../pages/how-many-meals/how-many-meals.module';
import { SwitchYourMealsPageModule } from '../pages/switch-your-meals/switch-your-meals.module';
import { MealsDeliveredPageModule } from '../pages/meals-delivered/meals-delivered.module';
import { UploadProgresspicturePageModule } from '../pages/upload-progresspicture/upload-progresspicture.module';
import { TodaysMealsPageModule } from '../pages/todays-meals/todays-meals.module';
import { LogyourOwnFoodPageModule } from '../pages/logyour-own-food/logyour-own-food.module';
import { RecipeInstructionScreenPageModule } from '../pages/recipe-instruction-screen/recipe-instruction-screen.module';
import { RecipeSelectionScreenPageModule } from '../pages/recipe-selection-screen/recipe-selection-screen.module';
import { WeeklyGroceryListScreenPageModule } from '../pages/weekly-grocery-list-screen/weekly-grocery-list-screen.module';
import { MealsDeliveredScreenPageModule } from '../pages/meals-delivered-screen/meals-delivered-screen.module';
import { SubscriptionPlanScreenPageModule } from '../pages/subscription-plan-screen/subscription-plan-screen.module';
import { WorkoutReminderScreenPageModule } from '../pages/workout-reminder-screen/workout-reminder-screen.module';
import { ProScreenPageModule } from '../pages/pro-screen/pro-screen.module';
import { PersonalizedScreenPageModule } from '../pages/personalized-screen/personalized-screen.module';
import { WorkoutVideoPageModule } from '../pages/workout-video/workout-video.module';

import { HowHardWorkoutScreenPageModule } from '../pages/how-hard-workout-screen/how-hard-workout-screen.module';
import { ActivityLevelStatusPageModule } from '../pages/activity-level-status/activity-level-status.module';
import { PhysicalActivityPageModule } from '../pages/physical-activity/physical-activity.module';
import { ActivityPerWeekPageModule } from '../pages/activity-per-week/activity-per-week.module';
import { ActivityPerDayPageModule } from '../pages/activity-per-day/activity-per-day.module';
import { AchieveWeightGoalPageModule } from '../pages/achieve-weight-goal/achieve-weight-goal.module';
import { PopoverPageModule } from '../pages/popover/popover.module';
import { TrackAnotherActivityListPageModule } from '../pages/track-another-activity-list/track-another-activity-list.module';
import { ReminderHoursPageModule } from '../pages/reminder-hours/reminder-hours.module';
import { ChangeSubscriptionPageModule } from '../pages/change-subscription/change-subscription.module';
import { NutritionGuidelinesPageModule } from '../pages/nutrition-guidelines/nutrition-guidelines.module';
import { LocalDbProvider } from '../providers/local-db/local-db';
import { NutritionUpdatePageModule } from '../pages/nutrition-update/nutrition-update.module';
import { SyncProvider } from '../providers/sync/sync';
import { FreeUserNutritionPageModule } from '../pages/free-user-nutrition/free-user-nutrition.module';
import { PaymentForChangePlanPageModule } from '../pages/payment-for-change-plan/payment-for-change-plan.module';
import { ApiViewRecipePageModule } from '../pages/api-view-recipe/api-view-recipe.module';
import { NutritionSubCatPageModule } from '../pages/nutrition-sub-cat/nutrition-sub-cat.module';
import { BrowserTab } from '@ionic-native/browser-tab';
import { AdMobFree } from '@ionic-native/admob-free';



@NgModule({
    declarations: [
        MyApp
    ],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        IonicModule.forRoot(MyApp,{ 
            tabsPlacement:'top',             
            scrollAssist: true,
            platforms:{
                ios:{
                    scrollPadding: true,
                    statusbarPadding: true,
                    autoFocusAssist: true,
                },
                android: {
                    scrollPadding: false,
                    autoFocusAssist: false,
                }
            }
        }),
        LoginPageModule,
        SignupPageModule,
        WelcomePageModule,
        UnitOfMeasurementPageModule,
        TallMeasurePageModule,
        WeightMeasurePageModule,
        BodyFatPercentagePageModule,
        EnterBodyFatPageModule,
        SimpleMeasurementPageModule,
        AgeMeasurementPageModule,
        SimpleMeasurementYesPageModule,
        ActivityLevelPageModule,
        WeightGoalPageModule,
        DaysOfWorkPageModule,
        HoursOfWorkPageModule,
        CategoryOfJobsPageModule,
        TypeOfExercisePageModule,
        LandingScreenPageModule,
        GenderScreenPageModule,
        ForgotPasswordPageModule,
        FitnessGoalPageModule,
        TermConditionPageModule,
        PrivacyPolicyPageModule,
        TabsPageModule,
        WorkoutscreenPageModule,
        SettingPageModule,
        NutritionPageModule,
        FoodtrackingscreenPageModule,
        WeighttrackingscreenPageModule,
        NotificationscreenPageModule,
        GoalsettingsPageModule,
        PaymentPageModule,
        SocialmediaPageModule,
        MyaccountPageModule,
        ChangePasswordPageModule,
        ExercisesPageModule,
        ExerciseDetailPageModule,
        AddPaymentPageModule,
        WorkoutListPageModule,
        WorkoutDetailPageModule,
        AddFoodPageModule,
        CalorieMacroTargetPageModule,
        HoomePageModule,
        KindOfDietPageModule,
        AllergicPageModule,
        HowManyMealsPageModule,
        SwitchYourMealsPageModule,
        UploadProgresspicturePageModule,
        TodaysMealsPageModule,
        LogyourOwnFoodPageModule,
        RecipeInstructionScreenPageModule,
        RecipeSelectionScreenPageModule,
        WeeklyGroceryListScreenPageModule,
        MealsDeliveredPageModule,
        MealsDeliveredScreenPageModule,
        SubscriptionPlanScreenPageModule,
        WorkoutReminderScreenPageModule,
        ProScreenPageModule,
        PersonalizedScreenPageModule,
        WorkoutVideoPageModule,
        HowHardWorkoutScreenPageModule,
        ActivityLevelStatusPageModule,
        PhysicalActivityPageModule,
        ActivityPerWeekPageModule,
        ActivityPerDayPageModule,
        AchieveWeightGoalPageModule,
        PopoverPageModule,
        TrackAnotherActivityListPageModule,
        ReminderHoursPageModule,
        ChangeSubscriptionPageModule,
        NutritionGuidelinesPageModule,
        NutritionUpdatePageModule,
        FreeUserNutritionPageModule,
        PaymentForChangePlanPageModule,
        ApiViewRecipePageModule,
        NutritionSubCatPageModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp
    ],
    providers: [
        StatusBar,
        SplashScreen,
        Keyboard,
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        Camera,
        ActionSheet,
        ServicesProvider,
        DatePipe,
        SocialSharing,
        Network,
        Stripe,
        Facebook,
        LocalDbProvider,
        SQLite,
        FileTransfer,
        File,
        Device,
        SyncProvider,
        BrowserTab,
        AdMobFree
    ]
})
export class AppModule { }
