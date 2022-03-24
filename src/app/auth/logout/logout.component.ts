import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { AuthenticationService } from '@sharedModule/services';
import { convertItemToString } from '@sharedModule/utilities';
import { Subscription } from 'rxjs';

@Component({
  selector: 'snap-logout',
  templateUrl: './logout.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoutComponent implements OnInit, OnDestroy {
  routeSubscription: Subscription | undefined;

  logoutSubscription: Subscription | undefined;

  signingOut = false;

  signoutPermitted = true;

  errorOccuredWhenSigningOut = false;

  signedOutSuccessfully = false;

  signedOutUser: {
    firstName: string;
  } = {
      firstName: ''
    }

  constructor(
    private activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.loadRouteData();
  }

  ngOnDestroy(): void {
    this._unsubscribeRouteSubscription();

    this._unsubscribeLogoutSubscription();
  }

  private _unsubscribeLogoutSubscription() {
    if (this.logoutSubscription instanceof Subscription) {
      this.logoutSubscription.unsubscribe();
    }
  }

  private _unsubscribeRouteSubscription() {
    if (this.routeSubscription instanceof Subscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  loadRouteData(): void {
    this.routeSubscription = this.activatedRoute.data
      .subscribe((data: Data) => {
        this.signoutPermitted = data?.signoutPermitted;
      }, err => console.error(err));
  }

  private _resetErrorOccuredWhenSignIngOut() {
    if (this.errorOccuredWhenSigningOut) {
      this.errorOccuredWhenSigningOut = false;
    }
  }

  logout(): void {
    if (!this.signingOut) {
      this.signingOut = true;
    }

    this._resetErrorOccuredWhenSignIngOut();

    this.logoutSubscription = this.authenticationService.logout().subscribe(
      (result: {
        firstName: string;
      }) => {
        this.signedOutSuccessfully = true;

        this.signedOutUser.firstName = result.firstName;

        this.signingOut = false;
      }, err => {
        this.signedOutUser.firstName = convertItemToString(
          this.authenticationService
            .clearCredentials()?.firstName);
        console.error(err);
        // this.errorOccuredWhenSigningOut = true;
        this.signedOutSuccessfully = true;

        this.signingOut = false;
      }
    );
  }

  tryAgainToSignout(): void {
    this.logout();
  }
}
