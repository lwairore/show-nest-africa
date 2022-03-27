// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  hostURL: 'http://localhost:8000',
  baseURL: `http://localhost:8000/`,
  imageBaseURL: `http://localhost:8000`,
  brandName: 'Shownest Africa',
  moments: {
    rootURL: `moments/`,
    livestreamChunk: {
      rootURL: `:momentID/livestream/submit/`,
      sendChunk: function () {
        return this.rootURL;
      },
    },
    submitMoment: {
      rootURL: `submit/`,
      retrieveSEO: function () {
        return this.rootURL + `retrieve/seo/`;
      },
      retrieveProfileDetails: function () {
        return this.rootURL + `retrieve/basic-profile-detail/`;
      },
      listTypeOfTicket: function () {
        return this.rootURL + `list/type-of-ticket/`;
      },
      submitMoment: function () {
        return this.rootURL + ``;
      },
    },
    retrieveUpcommingEventDetails: function () {
      return this.rootURL + 'retrieve/details/upcomming/:momentID/';
    },
    retrievePastEventDetails: function () {
      return this.rootURL + 'retrieve/details/past/:momentID/';
    },
    listEventVideos: function () {
      return this.rootURL + 'retrieve/details/:momentID/section/video-gallery/';
    },
    listEventPhotos: function () {
      return this.rootURL + 'retrieve/details/:momentID/section/photo-gallery/';
    },
    retrieveMomentDetailsForBreadcrumb: function () {
      return this.rootURL + 'retrieve/details/:momentID/section/moment-details/breadcrumb/';
    },
    listUpcommingEvent: function () {
      return this.rootURL + 'list/upcomming/';
    },
    listPastEvent: function () {
      return this.rootURL + 'list/past/';
    }
  },
  authentication: {
    rootURL: `auth/`,
    checkIf__HasBeenTaken: {
      rootURL: 'has-been-taken/',
      email: function () {
        return this.rootURL + 'email/:email/'
      },
      username: function () {
        return this.rootURL + 'username/:username/'
      },
      phoneNumber: function () {
        return this.rootURL + 'phone-number/:phoneNumber/'
      },
    },
    signUp: {
      rootURL: `sign-up/`,
      signUp: function () {
        return this.rootURL + ``;
      },
      seo: function () {
        return this.rootURL + `seo/`;
      }
    },
    signIn: {
      rootURL: `sign-in/`,
      signIn: function () {
        return this.rootURL + ``;
      },
      seo: function () {
        return this.rootURL + `seo/`;
      }
    },
    signOut: {
      rootURL: `sign-out/`,
      signOut: function () {
        return this.rootURL + ``;
      },
      seo: function () {
        return this.rootURL + `seo/`;
      }
    },
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
