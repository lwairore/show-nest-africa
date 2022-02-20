import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllMomentComponent } from './all-moment.component';


const routes: Routes = [
  {
    path: '',
    component: AllMomentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllMomentRoutingModule { }
