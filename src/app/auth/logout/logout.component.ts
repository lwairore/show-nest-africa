import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { AuthenticationService } from '@sharedModule/services';
import { convertItemToString } from '@sharedModule/utilities';
import { Subscription } from 'rxjs';
import { LoadingScreenService } from '@libsModule/loading-screen/loading-screen.service';

@Component({
  selector: 'snap-logout',
  templateUrl: './logout.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoutComponent implements OnInit, AfterViewInit, OnDestroy {
  routeSubscription: Subscription | undefined;

  logoutSubscription: Subscription | undefined;

  constructor(
    private _router: Router,
    private activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private _loadingScreenService: LoadingScreenService,
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.logout();
  }

  ngOnDestroy() {
    this._unsubscribeRouteSubscription();

    this._unsubscribeLogoutSubscription();
  }

  private _startLoading() {
    this._loadingScreenService.startLoading();
  }

  private _stopLoading() {
    this._loadingScreenService.stopLoading();
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

  logout() {

    this._startLoading();

    this.logoutSubscription = this.authenticationService
      .logout()
      .subscribe((result) => {
        this._stopLoading();

        this._router.navigate(['/']);
      }, err => {
        console.error(err);

        this.authenticationService
          .clearCredentials();

        this._stopLoading();

        this._router.navigate(['/']);
      });
  }

  tryAgainToSignout() {
    this.logout();
  }
}
