import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {
  ProfileDetailHttpResponse,
  ProfileDetailFormatHttpResponse,
  GenderChoiceHttpResponse,
  GenderChoiceFormatHttpResponse
} from '../custom-types';
import { retryWithBackoff } from '@sharedModule/operators';
import { map } from 'rxjs/operators';
import {
  formatShowcaseItemWithPhoto,
  convertItemToString,
  convertItemToNumeric,
  isANumber,
  isObjectEmpty,
  getBoolean
} from '@sharedModule/utilities';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  constructor(
    private _httpClient: HttpClient,
  ) { }

  updateProfileDetail$(formData: FormData) {
    const API = environment.baseURL
      + environment.authentication.manageProfile();

    return this._httpClient.put(
      API, formData)
      .pipe(
        retryWithBackoff(1000, 5));
  }

  retrieveProfileDetail$() {
    const API = environment.baseURL
      + environment.authentication.manageProfile();

    return this._httpClient.get<ProfileDetailHttpResponse>(API)
      .pipe(
        retryWithBackoff(1000, 5),
        map(details => {
          const FORMATTED_GENDER_CHOICES = details.gender_choices
            ?.map(choice => {
              const FORMATTED_CHOICE: GenderChoiceFormatHttpResponse = {
                textContent: convertItemToString(
                  choice.text_content),
                value: convertItemToString(choice.value),
                selected: getBoolean(choice.selected)
              }

              return FORMATTED_CHOICE;

            }).filter(choice => !isObjectEmpty(choice));

          const FORMATTED_DETAILS: ProfileDetailFormatHttpResponse = {
            avatar: formatShowcaseItemWithPhoto(details.avatar),
            phoneNumber: convertItemToString(details.phone_number),
            dateOfBirth: convertItemToString(details.date_of_birth),
            username: convertItemToString(details.username),
            bio: convertItemToString(details.bio),
            firstName: convertItemToString(details.first_name),
            lastName: convertItemToString(details.last_name),
            email: convertItemToString(details.email),
            genderChoices: FORMATTED_GENDER_CHOICES,
          };

          return FORMATTED_DETAILS;
        }));
  }
}
