import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PastMomentComponent } from './past-moment.component';


const routes: Routes = [
  {
    path: '',
    component: PastMomentComponent,
  },
  {
    path: '**',
    redirectTo: ''
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PastMomentRoutingModule { }
