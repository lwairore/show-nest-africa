import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module')
      .then(h => h.HomeModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module')
      .then(a => a.AuthModule),
  },
  {
    path: 'moments',
    loadChildren: () => import('./events/events.module')
      .then(e => e.EventsModule),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
