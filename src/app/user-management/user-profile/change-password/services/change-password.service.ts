import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { retryWithBackoff } from '@sharedModule/operators';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {

  constructor(
    private _httpClient: HttpClient) { }

  changePassword$(formData: FormData) {
    const API = environment.baseURL
      + environment.authentication.changePassword();

    return this._httpClient.put(
      API, formData)
      .pipe(
        retryWithBackoff(1000, 5));

  }
}
