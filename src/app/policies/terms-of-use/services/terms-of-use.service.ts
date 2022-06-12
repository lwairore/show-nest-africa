import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TermsOfUseHttpResponse, TermsOfUseFormatHttpResponse } from '../custom-types';
import { retryWithBackoff } from '@sharedModule/operators';
import { map } from 'rxjs/operators';
import { convertItemToString } from '@sharedModule/utilities';

@Injectable({
  providedIn: 'root'
})
export class TermsOfUseService {

  constructor(
    private _httpClient: HttpClient
  ) { }

  retrieveTermsOfUse$() {
    const API = environment.baseURL +
      environment.policies.retrieveTermsOfUse();

    return this._httpClient.get<TermsOfUseHttpResponse>(API)
      .pipe(
        retryWithBackoff(1000, 5),
        map(details => {
          const FORMATTED_DETAILS: TermsOfUseFormatHttpResponse = {
            agreementToTerms: convertItemToString(
              details.agreement_to_terms, true),

            intellectualPropertyRights: convertItemToString(
              details.intellectual_property_rights, true),

            userRepresentation: convertItemToString(
              details.user_representation, true),

            prohibitedActivity: convertItemToString(
              details.prohibited_activity, true),

            userGeneratedContribution: convertItemToString(
              details.user_generated_contribution, true),

            contributionLicense: convertItemToString(
              details.contribution_license, true),

            submission: convertItemToString(
              details.submission, true),

            siteManagement: convertItemToString(
              details.site_management, true),

            modifiedDate: convertItemToString(
              details.modified_date, true),

            termAndTermination: convertItemToString(
              details.term_and_termination, true),

            modificationAndInterruption: convertItemToString(
              details.modification_and_interruption, true),

            governingLaw: convertItemToString(
              details.governing_law, true),

            disputeResolution: convertItemToString(
              details.dispute_resolution, true),

            correction: convertItemToString(
              details.correction, true),

            disclaimer: convertItemToString(
              details.disclaimer, true),

            limitationOfLiability: convertItemToString(
              details.limitation_of_liability, true),

            indemnification: convertItemToString(
              details.indemnification, true),

            userData: convertItemToString(
              details.user_data, true),

            electronicCommunicationTransactionSignatures: convertItemToString(
              details.electronic_communication_transaction_signatures, true),

            miscellaneous: convertItemToString(
              details.miscellaneous, true),

            contactUs: convertItemToString(
              details.contact_us, true),
          };

          return FORMATTED_DETAILS;
        })
      )
  }
}
