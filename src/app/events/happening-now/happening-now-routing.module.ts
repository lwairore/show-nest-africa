import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HappeningNowMainComponent } from './happening-now-main/happening-now-main.component';
import { HappeningNowComponent } from './happening-now.component';


const routes: Routes = [
  {
    path: '',
    component: HappeningNowComponent,
    children: [
      {
        path: '',
        component: HappeningNowMainComponent,
      },
      {
        path: 'details',
        loadChildren: () => import('./happening-now-event-details/happening-now-event-details.module')
          .then(h => h.HappeningNowEventDetailsModule),
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HappeningNowRoutingModule { }
