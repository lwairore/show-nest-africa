import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, NotAuthenticatedGuard } from '@sharedModule/guards';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { RegisterComponent } from './register/register.component';


const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'register',
        component: RegisterComponent,
        canActivate: [
          NotAuthenticatedGuard,
        ]
      },
      {
        path: 'log-in',
        component: LoginComponent,
        canActivate: [
          NotAuthenticatedGuard,
        ]
      },
      {
        path: 'log-out',
        component: LogoutComponent,
        canActivate: [
          AuthGuard,
        ]
      },
      {
        path: 'recover-password',
        component: RecoverPasswordComponent,
        canActivate: [
          NotAuthenticatedGuard,
        ]
      },
      {
        path: '**', redirectTo: 'signin',
        pathMatch: 'full'
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'log-in',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
