import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PoliciesComponent } from './policies.component';
import { PrivacyNoticeComponent } from './privacy-notice/privacy-notice.component';
import { TermsOfUseComponent } from './terms-of-use/terms-of-use.component';


const routes: Routes = [
  {
    path: '',
    component: PoliciesComponent,
    children: [
      {
        path: 'privacy-notice',
        component: PrivacyNoticeComponent,
      },
      {
        path: 'terms-of-use',
        component: TermsOfUseComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PoliciesRoutingModule { }
