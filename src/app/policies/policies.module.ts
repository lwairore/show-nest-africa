import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoliciesRoutingModule } from './policies-routing.module';
import { PoliciesComponent } from './policies.component';
import { PrivacyNoticeComponent } from './privacy-notice/privacy-notice.component';
import { SharedModule } from '@sharedModule/shared.module';
import { LibsModule } from '@libsModule/libs.module';
import { TermsOfUseComponent } from './terms-of-use/terms-of-use.component';


@NgModule({
  declarations: [
    PoliciesComponent,
    PrivacyNoticeComponent,
    TermsOfUseComponent,
  ],
  imports: [
    CommonModule,
    LibsModule,
    PoliciesRoutingModule,
    SharedModule,
  ]
})
export class PoliciesModule { }
