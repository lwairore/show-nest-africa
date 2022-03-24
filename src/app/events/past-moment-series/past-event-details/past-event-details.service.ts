import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constructMediaSrc, convertItemToString, ExpectedType, isANumber, isObjectEmpty, whichValueShouldIUse } from '@sharedModule/utilities';
import { formatShowcaseItemWithPhoto } from '@sharedModule/utilities/format-showcase-item-with-photo.util';
import { environment } from 'src/environments/environment';
import { EventSponsorFormatHttpResponse, EventSponsorHttpResponse, MomentDetailForBreadcrumbFormatHttpResponse, MomentDetailForBreadcrumbHttpResponse, MomentProposalFormatHttpResponse, MomentProposalHttpResponse, PastEventDetailFormatHttpResponse, PastEventDetailHttpResponse, PostEventUpdateFormatHttpResponse, PostEventUpdateHttpResponse, SocialMediaLinkFormatHttpResponse, SocialMediaLinkHttpResponse, SpeakerFormatHttpResponse, SpeakerHttpResponse, TestimonialFormatHttpResponse, TestimonialHttpResponse } from './custom-types';
import { retryWithBackoff } from '@sharedModule/operators';
import { map } from 'rxjs/operators';
import { ImageItemPreviewFormatHttpResponse, ImageItemPreviewHttpResponse, PaginatedItemHttpResponse, VideoItemPreviewFormatHttpResponse, VideoItemPreviewHttpResponse } from '@sharedModule/custom-types';

@Injectable()
export class PastEventDetailsService {

  constructor(
    private _httpClient: HttpClient,
  ) { }

  retrieveMomentDetailsForBreadcrumb$(momentID: string) {
    const API = (environment.baseURL +
      environment.moments.retrieveMomentDetailsForBreadcrumb())
      .replace(':momentID', momentID);

    return this._httpClient.get<MomentDetailForBreadcrumbHttpResponse>(API)
      .pipe(
        retryWithBackoff(1000, 5),
        map(details => {
          const FORMATTED_DETAILS: MomentDetailForBreadcrumbFormatHttpResponse = {
            poster: formatShowcaseItemWithPhoto(details.poster),
            nameOfMoment: convertItemToString(details.name_of_moment)
          };

          return FORMATTED_DETAILS;
        }));
  }

  listEventPhotos$(momentID: string, pageNumber?: string) {
    const API = (environment.baseURL +
      environment.moments.listEventPhotos()
    )
      .replace(':momentID', momentID);

    let params = new HttpParams();

    if (isANumber(pageNumber)) {
      params = params.set('p',
        convertItemToString(pageNumber));
    }

    return this._httpClient.get<PaginatedItemHttpResponse<ImageItemPreviewHttpResponse>>(
      API, { params }).pipe(
        retryWithBackoff(1000, 5),
        map(details => {
          console.log("listTestimonial")
          console.log({ details });
          const FORMATTED_PHOTOS = details.results?.map(detail => {
            const FORMATTED_DETAIL = formatShowcaseItemWithPhoto(detail,
              true);

            console.log({ FORMATTED_DETAIL })

            return FORMATTED_DETAIL;
          }).filter(item => !isObjectEmpty(item)) ?? null;

          const FORMATTED_DETAILS: PaginatedItemHttpResponse<ImageItemPreviewFormatHttpResponse> = {
            next: whichValueShouldIUse(details.next, undefined, ExpectedType.NUMBER),
            results: FORMATTED_PHOTOS ?? Array()
          }

          return FORMATTED_DETAILS;
        }));
  }

  listEventVideos$(momentID: string, pageNumber?: string) {
    const API = (environment.baseURL +
      environment.moments.listEventVideos()
    )
      .replace(':momentID', momentID);

    let params = new HttpParams();

    if (isANumber(pageNumber)) {
      params = params.set('p',
        convertItemToString(pageNumber));
    }

    return this._httpClient.get<PaginatedItemHttpResponse<VideoItemPreviewHttpResponse>>(
      API, { params }).pipe(
        retryWithBackoff(1000, 5),
        map(details => {
          const FORMATTED_VIDEOS = details.results?.map(detail => {
            const FORMATTED_DETAIL: VideoItemPreviewFormatHttpResponse = {
              thumbnail: formatShowcaseItemWithPhoto(detail.thumbnail),
              src: constructMediaSrc(detail.video),
              description: convertItemToString(detail.description, true)
            };

            console.log({ FORMATTED_DETAIL })

            return FORMATTED_DETAIL;
          }).filter(item => !isObjectEmpty(item)) ?? null;

          const FORMATTED_DETAILS: PaginatedItemHttpResponse<VideoItemPreviewFormatHttpResponse> = {
            next: whichValueShouldIUse(details.next, undefined, ExpectedType.NUMBER),
            results: FORMATTED_VIDEOS ?? Array()
          }

          return FORMATTED_DETAILS;
        }));
  }

  listTestimonial$(momentID: string, pageNumber?: string) {
    const API = (environment.baseURL +
      'environment.moments.listTestimonial()'
    )
      .replace(':momentID', momentID);

    let params = new HttpParams();

    if (isANumber(pageNumber)) {
      params = params.set('p',
        convertItemToString(pageNumber));
    }

    return this._httpClient.get<PaginatedItemHttpResponse<TestimonialHttpResponse>>(
      API, { params }).pipe(
        retryWithBackoff(1000, 5),
        map(details => {
          console.log("listTestimonial")
          console.log({ details });
          const FORMATTED_TESTIMONIALS = details.results?.map(detail => {
            const VIDEO_DETAIL = detail.video_comment;

            const FORMATTED_DETAIL: TestimonialFormatHttpResponse = {
              commentedBy: convertItemToString(detail.commented_by),
              videoComment: this._formatVideo(VIDEO_DETAIL),
              authorImage: formatShowcaseItemWithPhoto(detail.author_image),
              position: convertItemToString(detail.position),
              review: convertItemToString(detail.review, true)
            }

            console.log({ FORMATTED_DETAIL })

            return FORMATTED_DETAIL;
          }).filter(item => !isObjectEmpty(item)) ?? null;

          const FORMATTED_DETAILS: PaginatedItemHttpResponse<TestimonialHttpResponse> = {
            next: whichValueShouldIUse(details.next, undefined, ExpectedType.NUMBER),
            results: FORMATTED_TESTIMONIALS ?? Array()
          }

          return FORMATTED_DETAILS;
        }));
  }

  retrievePastEventDetails$(momentID: string) {
    const API = (environment.baseURL +
      environment.moments.retrievePastEventDetails())
      .replace(':momentID', momentID);

    return this._httpClient.get<PastEventDetailHttpResponse>(
      API)
      .pipe(
        retryWithBackoff(1000, 5),
        map(details => {
          const FORMATTED_PROPOSAL = this._formatProposal(
            details.proposal);

          const FORMATTED_SOCIAL_MEDIA_LINKS = this._formatSocialMediLinks(
            details?.social_media_links);

          const FORMATTED_SPEAKERS = this._formatSpeakers(
            details?.speakers);

          const FORMATTED_SPONSORS = this._formatSponsors(
            details?.sponsors);

          const FORMATTED_POST_EVENT_UPDATE = this._formatPostEventDetails(
            details?.post_event_update);

          const FORMATTED_DETAILS: PastEventDetailFormatHttpResponse = {
            proposal: FORMATTED_PROPOSAL,
            postEventUpdate: FORMATTED_POST_EVENT_UPDATE,
            socialMediaLinks: FORMATTED_SOCIAL_MEDIA_LINKS,
            speakers: FORMATTED_SPEAKERS,
            sponsors: FORMATTED_SPONSORS,
            startsOn: convertItemToString(details.starts_on),
            description: convertItemToString(details.description, true),
            venue: convertItemToString(details.venue),
            endsOn: convertItemToString(details.ends_on),
          };

          return FORMATTED_DETAILS;
        }));
  }

  private _formatPostEventDetails(details?: PostEventUpdateHttpResponse) {
    if (isObjectEmpty(details)) {
      return undefined;
    }

    const FORMATTED_DETAILS: PostEventUpdateFormatHttpResponse = {
      totalTestimonials: whichValueShouldIUse(details?.total_testimonials,
        0, ExpectedType.NUMBER),
      totalPhotoGallery: whichValueShouldIUse(details?.total_photo_gallery,
        0, ExpectedType.NUMBER),
      totalVideoGallery: whichValueShouldIUse(details?.total_video_gallery,
        0, ExpectedType.NUMBER),
    }

    return FORMATTED_DETAILS;
  }

  private _formatVideo(detail?: VideoItemPreviewHttpResponse) {
    if (isObjectEmpty(detail)) {
      return undefined;
    }

    const FORMATTED_DETAIL: VideoItemPreviewFormatHttpResponse = {
      thumbnail: formatShowcaseItemWithPhoto(detail?.thumbnail),
      src: constructMediaSrc(detail?.video),
      description: convertItemToString(detail?.description, true),
      recordingDate: convertItemToString(detail?.recording_date),
      videoLocation: convertItemToString(detail?.video_location)
    };

    return FORMATTED_DETAIL;
  }

  private _formatSponsors(details?: ReadonlyArray<EventSponsorHttpResponse>) {
    if (!Array.isArray(details)) {
      return Array();
    }

    const FORMATTED_DETAILS = details.map(
      (detail: EventSponsorHttpResponse) => {
        const FORMATTED_DETAIL: EventSponsorFormatHttpResponse = {
          socialMediaLinks: this._formatSocialMediLinks(detail?.social_media_links),
          logo: formatShowcaseItemWithPhoto(detail.logo),
          nameOfSponsor: convertItemToString(detail.name_of_sponsor),
        };

        return FORMATTED_DETAIL;
      });

    return FORMATTED_DETAILS;
  }

  private _formatSpeakers(details?: ReadonlyArray<SpeakerHttpResponse>) {
    if (!Array.isArray(details)) {
      return Array();
    }

    const FORMATTED_DETAILS = details.map(
      (detail: SpeakerHttpResponse) => {
        const FORMATTED_DETAIL: SpeakerFormatHttpResponse = {
          fullName: convertItemToString(detail.full_name),
          image: formatShowcaseItemWithPhoto(detail.image),
        };

        return FORMATTED_DETAIL;
      }).filter(detail => !isObjectEmpty(detail));

    return FORMATTED_DETAILS;
  }


  private _formatSocialMediLinks(details?: ReadonlyArray<SocialMediaLinkHttpResponse>) {
    if (!Array.isArray(details)) {
      return Array();
    }
    const FORMATTED_LINKS = details.map(
      (detail: SocialMediaLinkHttpResponse) => {
        const FORMATTED_LINK: SocialMediaLinkFormatHttpResponse = {
          nameOfSocialMedia: convertItemToString(detail.name_of_social_media),
          href: convertItemToString(detail.link),
        };

        return FORMATTED_LINK;
      });

    return FORMATTED_LINKS;
  }

  private _formatProposal(details?: MomentProposalHttpResponse) {
    const FORMATTED_PROPOSAL: MomentProposalFormatHttpResponse = {
      typeOfMoment: {
        title: convertItemToString(
          details?.type_of_moment?.title),
        description: convertItemToString(
          details?.type_of_moment?.description)
      },
      poster: formatShowcaseItemWithPhoto(
        details?.poster),
      username: convertItemToString(
        details?.username),
      nameOfMoment: convertItemToString(
        details?.name_of_moment),
      cost: whichValueShouldIUse(
        details?.cost, 0, ExpectedType.NUMBER)
    };

    return FORMATTED_PROPOSAL;
  }
}
