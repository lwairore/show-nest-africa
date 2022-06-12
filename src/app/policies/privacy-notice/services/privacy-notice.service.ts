import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PrivacyNoticeHttpResponse, PrivacyNoticeFormatHttpResponse } from '../custom-types';
import { retryWithBackoff } from '@sharedModule/operators';
import { convertItemToString } from '@sharedModule/utilities';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PrivacyNoticeService {

  constructor(
    private _httpClient: HttpClient,
  ) { }

  retrievePrivacyNotice$() {
    const API = environment.baseURL +
      environment.policies.retrievePrivacyNotice();

    return this._httpClient.get<PrivacyNoticeHttpResponse>(API)
      .pipe(
        retryWithBackoff(1000, 5),
        map(details => {
          const FORMATTED_DETAILS: PrivacyNoticeFormatHttpResponse = {
            personalInformationProcessed: convertItemToString(
              details.personal_information_processed, true),

            sensitiveInformationProcessed: convertItemToString(
              details.sensitive_information_processed, true),

            informationFromThirdParties: convertItemToString(
              details.information_from_third_parties, true),

            processingInformationMethod: convertItemToString(
              details.processing_information_method, true),

            situationAndWithWhichPartiesWeSharePersonalInformation: convertItemToString(
              details.situation_and_with_which_parties_we_share_personal_information, true),

            howWeKeepInformationSafe: convertItemToString(
              details.how_we_keep_information_safe, true),

            userRights: convertItemToString(
              details.user_rights, true),

            exerciseMyRights: convertItemToString(
              details.exercise_my_rights, true),

            modifiedDate: convertItemToString(
              details.modified_date, true),
          };

          return FORMATTED_DETAILS;
        })
      )
  }
}
