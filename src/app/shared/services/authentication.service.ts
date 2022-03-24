import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, retry } from 'rxjs/operators';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { environment } from 'src/environments/environment';
import { retryWithBackoff } from '@sharedModule/operators';
import { convertItemToString, stringIsEmpty } from '@sharedModule/utilities';
import { CurrentUserDetailFormatHttpResponse, CurrentUserDetailHttpResponse, HasBeenTakenHttpResponse } from '@sharedModule/custom-types';




@Injectable()
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<any> | undefined;
  public currentUser: Observable<any> | undefined;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: any,
    // private authenticationService: AuthenticationService,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.currentUserSubject = new BehaviorSubject<any>(
        JSON.parse(<string>localStorage.getItem('snapCurrentUser')));
      this.currentUser = this.currentUserSubject.asObservable();
      const parseCurrentUser = this.currentUserValue;
    }
    // this.httpHeadersWithoutContentType = new HttpHeaders({
    //   Authorization: `Token ${parseCurrentUser.token}`
    // });
  }

  public get currentUserValue(): any {
    return this.currentUserSubject?.value;
  }

  updateCurrentUser() {
    if (isPlatformBrowser(this.platformId)) {
      this.currentUserSubject?.next(
        JSON.parse(<string>localStorage.getItem('snapCurrentUser')));
    }
  }


  get currentUserFirstName(): string {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const firstName = JSON.parse(
          <string>localStorage.getItem('snapCurrentUser')).firstName;
        return firstName;
      } catch (error) {
        return '';
      }
    }
    else { return ''; }
  }

  get currentUserEmail(): string {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const token = JSON.parse(<string>localStorage.getItem('snapCurrentUser')).email;
        return token;
      } catch (error) {
        return '';
      }
    }
    else { return ''; }
  }

  get currentUserToken(): string {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const token = JSON.parse(<string>localStorage.getItem('snapCurrentUser')).token;
        return token;
      } catch (error) {
        return '';
      }
    }
    else { return ''; }
  }

  checkIfEmailHasBeenTaken$(email: string) {
    const API = (environment.baseURL + environment.authentication.rootURL +
      environment.authentication.checkIf__HasBeenTaken.email())
      .replace(':email', email);

    return this.http.get<HasBeenTakenHttpResponse>(
      API,
    ).pipe(retryWithBackoff(1000, 5));

  }

  checkIfUsernameHasBeenTaken$(username: string): Observable<any> {
    const API = (environment.baseURL + environment.authentication.rootURL +
      environment.authentication.checkIf__HasBeenTaken.username())
      .replace(':username', username);

    return this.http.get<HasBeenTakenHttpResponse>(
      API
    ).pipe(retryWithBackoff(1000, 5));

  }

  checkIfPhoneNumberHasBeenTaken$(phoneNumber: string) {
    const API = (environment.baseURL + environment.authentication.rootURL +
      environment.authentication.checkIf__HasBeenTaken.phoneNumber())
      .replace(':phoneNumber', phoneNumber);

    return this.http.get<HasBeenTakenHttpResponse>(
      API
    ).pipe(retryWithBackoff(1000, 5));
  }

  signUp(newUserDetailsFormData: FormData) {
    const API = environment.baseURL + environment.authentication.rootURL +
      environment.authentication.signUp.signUp();

    return this.http.post<CurrentUserDetailHttpResponse>(API,
      newUserDetailsFormData)
      .pipe(
        retryWithBackoff(1000, 5),
        map(details => {
          const email = convertItemToString(details.email);
          if (stringIsEmpty(email)) {
            return {};
          }

          const token = convertItemToString(details.token);
          if (stringIsEmpty(token)) {
            return {};
          }

          const firstName = convertItemToString(details.first_name);
          if (stringIsEmpty(firstName)) {
            return {};
          }

          const lastName = convertItemToString(details.last_name);
          if (stringIsEmpty(lastName)) {
            return {};
          }

          const FORMATTED_DETAILS: CurrentUserDetailFormatHttpResponse = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            token: token
          };

          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('snapCurrentUser', JSON.stringify(FORMATTED_DETAILS));
          }

          this.currentUserSubject?.next(FORMATTED_DETAILS);
          // this.updateCurrentUser();
          return FORMATTED_DETAILS;
        }));
  }

  login(credentials: FormData) {
    const API = environment.baseURL + environment.authentication.rootURL +
      environment.authentication.signIn.signIn();

    return this.http.post<CurrentUserDetailHttpResponse>(API, credentials)
      .pipe(retryWithBackoff(1000, 5), map(details => {
        const email = convertItemToString(details.email);
        if (stringIsEmpty(email)) {
          return {};
        }

        const token = convertItemToString(details.token);
        if (stringIsEmpty(token)) {
          return {};
        }

        const firstName = convertItemToString(details.first_name);
        if (stringIsEmpty(firstName)) {
          return {};
        }

        const lastName = convertItemToString(details.last_name);
        if (stringIsEmpty(lastName)) {
          return {};
        }

        const FORMATTED_DETAILS: CurrentUserDetailFormatHttpResponse = {
          firstName: convertItemToString(firstName),
          lastName: convertItemToString(lastName),
          email: email,
          token: token
        };

        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('snapCurrentUser', JSON.stringify(FORMATTED_DETAILS));
        }
        this.currentUserSubject?.next(FORMATTED_DETAILS);
        // this.updateCurrentUser();
        return FORMATTED_DETAILS;
      }));
  }

  logout() {
    const parseCurrentUser = this.currentUserValue;

    const API = environment.baseURL + environment.authentication.rootURL +
      environment.authentication.signOut;

    return this.http.delete(API
    ).pipe(retryWithBackoff(1000, 5), map(
      () => {
        const formatData: {
          firstName: string;
        } = {
          firstName: parseCurrentUser.firstName
        };
        if (isPlatformBrowser(this.platformId)) {
          localStorage.removeItem('snapCurrentUser');
        }
        this.currentUserSubject?.next(null);

        return formatData;

      }));

  }

  clearCredentials() {
    try {
      const loggedOutUser: {
        firstName: string;
      } = {
        firstName: this.currentUserValue.firstName
      };
      if (isPlatformBrowser(this.platformId)) {
        localStorage.removeItem('snapCurrentUser');
      }
      this.currentUserSubject?.next(null);
      return loggedOutUser;
    } catch (TypeError) {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.removeItem('snapCurrentUser');
      }
      this.currentUserSubject?.next(null);
      return null;
    }
  }

}