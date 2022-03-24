import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthenticationService } from '@sharedModule/services';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    @Inject(DOCUMENT) private document: Document,
  ) { }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authenticationService.currentUserToken) {
      // authorised so return true
      if (this.document.body.classList.contains('modal-open')) {
        this.document.body.classList.remove('modal-open');
      }
      return true;
    }
    // not logged in so redirect to login page with the return url
    if (state.url.startsWith('/auth/log-out')) {
      this.router.navigate(['/']);
    }
    else {
      this.router.navigate(['/auth/log-in'], {
        queryParams: { returnUrl: state.url }
      });
    }

    return false;
  }
}
