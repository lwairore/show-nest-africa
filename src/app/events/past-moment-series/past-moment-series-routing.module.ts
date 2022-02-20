import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PastMomentMainComponent } from './past-moment-main/past-moment-main.component';
import { PastMomentSeriesComponent } from './past-moment-series.component';


const routes: Routes = [
  {
    path: '',
    component: PastMomentSeriesComponent,
    children: [
      {
        path: '',
        component: PastMomentMainComponent,
      },
      {
        path: 'details',
        loadChildren: () => import('./past-event-details/past-event-details.module')
          .then(p => p.PastEventDetailsModule),
      },
    ]
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
export class PastMomentSeriesRoutingModule { }
