import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileRoutingModule } from './user-profile-routing.module';
import { UserProfileComponent } from './user-profile.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ProfileInfoComponent } from './profile-info/profile-info.component';


@NgModule({
  declarations: [
    UserProfileComponent,
    ChangePasswordComponent,
    ProfileInfoComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UserProfileRoutingModule,
    SharedModule,
  ]
})
export class UserProfileModule { }
