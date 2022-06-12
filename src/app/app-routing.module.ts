import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@sharedModule/guards';


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module')
      .then(h => h.HomeModule),
  },
  {
    path: 'policies',
    loadChildren: () => import('./policies/policies.module')
      .then(p => p.PoliciesModule),
  },
  {
    path: 'moments/:momentID/rtc',
    loadChildren: () => import('./rtc/rtc.module')
      .then(r => r.RtcModule),
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
    path: 'live-box',
    loadChildren: () => import('./live-box/live-box.module')
      .then(l => l.LiveBoxModule),
  },
  {
    path: 'manage-profile',
    loadChildren: () => import('./user-management/user-management.module')
      .then(u => u.UserManagementModule),
  },
  {
    path: 'library',
    loadChildren: () => import('./library/library.module')
      .then(l => l.LibraryModule),
    canActivate: [
      AuthGuard,
    ]
  },
  {
    path: 'faq',
    loadChildren: () => import('./faq/faq.module')
      .then(f => f.FaqModule),
  },
  {
    path: 'contact-us',
    loadChildren: () => import('./contact-us/contact-us.module')
      .then(c => c.ContactUsModule),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,
    { enableTracing: false }
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
