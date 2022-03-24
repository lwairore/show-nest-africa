import { Inject, Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { EMPTY, Observable, of, throwError } from "rxjs";
import { catchError, map } from 'rxjs/operators';
import { Router } from "@angular/router";
import { DOCUMENT } from "@angular/common";
import { AuthenticationService } from "./services";

@Injectable()
export class GlobalHttpInterceptorService implements HttpInterceptor {

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    @Inject(DOCUMENT) private document: Document
  ) {
  }

  private handleAuthError(error: HttpErrorResponse): Observable<any> {
    if (error instanceof HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
        console.error("Error Event");
      }
      else {
        console.log(`error status : ${error.status} ${error.statusText}`);
        switch (error.status) {
          case 401:
            this.authenticationService.clearCredentials();
            if (this.document.body.classList.contains('modal-open')) {
              this.document.body.classList.remove('modal-open');
              this.document.body.style.paddingRight = '';
            }

            Array.from(this.document.getElementsByClassName('modal-backdrop fade show'))
              .forEach(el => el.remove());


            this.router.navigate(['/auth/signin'], {
              queryParams: { returnUrl: this.router.url, reason: 'something went wrong' }
            });
            // return EMPTY;
            return EMPTY;

          case 403:
            this.authenticationService.clearCredentials();
            if (this.document.body.classList.contains('modal-open')) {
              this.document.body.classList.remove('modal-open');
              this.document.body.style.paddingRight = '';
            }

            Array.from(this.document.getElementsByClassName('modal-backdrop fade show'))
              .forEach(el => el.remove());


            this.router.navigate(['/auth/signin'], {
              queryParams: { returnUrl: this.router.url, reason: 'something went wrong' }
            });
            // return EMPTY;
            return EMPTY;


          default:
            break;
        }
      }
    }
    else { console.error("Other Errors"); }
    if (error.status === 401 || error.status === 403) {

    }
    return throwError(error);
  }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const getAuthorizationToken = req.headers.get('Authorization');
    if (!getAuthorizationToken) {
      const currentUserToken = this.authenticationService.currentUserToken;
      if (currentUserToken) {
        const authReq = req.clone({
          headers: req.headers
            .set('Authorization', `Token ${currentUserToken}`)
        });
        return next.handle(authReq).pipe(
          catchError((error) => this.handleAuthError(error))
        )
      }


    }

    return next.handle(req).pipe(
      catchError((error) => this.handleAuthError(error))
    )




  }

}
