import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: 'past',
    loadChildren: () => import('./past-moment/past-moment.module')
      .then(p => p.PastMomentModule)
  },
  {
    path: 'upcoming',
    loadChildren: () => import('./upcoming-moment/upcoming-moment.module')
      .then(u => u.UpcomingMomentModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SinglesRoutingModule { }
