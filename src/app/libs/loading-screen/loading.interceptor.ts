import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoadingScreenService } from './loading-screen.service';
import { finalize } from 'rxjs/operators';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private _activeRequests = 0;

  /**
   * URLs for which the loading screen should not be enabled
   */
  skipUrls = [
    '/authrefresh',
  ];


  constructor(
    private _loadingScreenService: LoadingScreenService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let displayLoadingScreen = true;

    for (const skipURL of this.skipUrls) {
      if (new RegExp(skipURL).test(request.url)) {
        displayLoadingScreen = false;

        break;
      }
    }

    if (displayLoadingScreen) {
      if (this._activeRequests === 0) {
        this._loadingScreenService.startLoading();
      }

      this._activeRequests++;

      return next.handle(request)
        .pipe(
          finalize(() => {
            this._activeRequests--;
            if (this._activeRequests === 0) {
              this._loadingScreenService.stopLoading();
            }
          }))
    } else {
      return next.handle(request);
    }
  }
}
