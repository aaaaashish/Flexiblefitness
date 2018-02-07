import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CategoryOfJobsPage } from './category-of-jobs';

@NgModule({
  declarations: [
    CategoryOfJobsPage,
  ],
  imports: [
    IonicPageModule.forChild(CategoryOfJobsPage),
  ],
})
export class CategoryOfJobsPageModule {}
