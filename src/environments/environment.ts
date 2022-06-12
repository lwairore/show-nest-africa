// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  hostURL: 'http://localhost:8000',
  baseURL: `http://localhost:8000/`,
  imageBaseURL: `http://localhost:8000`,
  brandName: 'Shownest Africa',
  faq: {
    rootURL: 'faq/',
    listFaq: function () {
      return this.rootURL + 'list/';
    },
    listFaqForCreator: function () {
      return this.listFaq() + 'creator/';
    },
    listFaqForFan: function () {
      return this.listFaq() + 'fan/';
    },
  },
  contactUs: {
    rootURL: 'contact-us/',
    retrieveOurLocation: function () {
      return this.rootURL + 'retrieve/location/';
    },
    listPhoneContactInfo: function () {
      return this.rootURL + 'list/phone/';
    },
    listMailContactInfo: function () {
      return this.rootURL + 'list/mail/';
    },
  },
  policies: {
    rootURL: 'policies/',
    retrievePrivacyNotice: function () {
      return this.rootURL + 'privacy-notice/';
    },
    retrieveTermsOfUse: function () {
      return this.rootURL + 'terms-of-use/';
    },
  },
  streamEvent: {
    rootURL: 'stream-event/',
    retrieveStreamDetail: function () {
      return this.rootURL + ':momentID/';
    },
    backendCheckup: function () {
      return this.retrieveStreamDetail() + 'checkup/';
    },
    listPurchasedTicket: function () {
      return this.retrieveStreamDetail() + 'available-tickets/';
    },
    selectTicket: function () {
      return this.retrieveStreamDetail() + 'select-ticket-for-streaming/';
    },
  },
  library: {
    rootURL: 'library/',
    purchases: {
      rootURL: 'purchases/',
      retrieveInvitedMomentDetail: function () {
        return this.listInvitedEvent() + ':momentID/';
      },
      listInvitedEvent: function () {
        return this.rootURL + 'list-invited-event/';
      },
      listPurchase: function () {
        return this.rootURL + '';
      },
      retrievePurchasedMomentDetail: function () {
        return this.listPurchase() + ':momentID/';
      },
      addStreamBuddy: function () {
        return this.retrieveShareTicketDetail() + 'add-person/';
      },
      removeWatchPartyMember: function () {
        return this.listWatchPartyMember() + 'remove/:orderItemID/:ticketID/:memberID/';
      },
      listWatchPartyMember: function () {
        return this.retrieveShareTicketDetail() + 'watch-party-members/';
      },
      listPurchasedTicketForSelectTicket: function () {
        return this.retrieveShareTicketDetail() + 'purchased-tickets/';
      },
      retrieveShareTicketDetail: function () {
        return this.retrievePurchasedMomentDetail() + 'share-tickets/';
      },
      listPurchasedTickets: function () {
        return this.retrievePurchasedMomentDetail() + 'purchased-tickets/';
      },
      retrieveTicketDetail: function () {
        return this.listPurchase() + ':momentID/ticket-details/';
      },
      retrieveWatchParty: function () {
        return this.retrieveTicketDetail() + ':ticketID/watch-party/';
      },
    }
  },
  mpesa: {
    rootURL: 'api/v1/',
    lipaNaMPesaOnlineStkPush: function () {
      return this.rootURL + 'mpesa/online/lipa/';
    },
    queryLipaNaMPesaOnlineStkPush: {
      rootURL: 'mpesa/stkpushquery/:momentID/:orderItemID/:requestRecordID/',
      query: function () {
        return this.rootURL + '';
      },
      paymentRequestInfo: function () {
        return this.rootURL + 'basic-info/';
      },
    },
  },
  orders: {
    rootURL: 'orders/',
    listPaymentMethods: function () {
      return this.rootURL + 'payment-methods/';
    },
    listAdditionalFee: function () {
      return this.rootURL + 'additional-fees/';
    },
    getTicketsMomentDetails: function () {
      return this.rootURL + 'moments/:momentID/retrieve/details/get-tickets/';
    }
  },
  braintreePaymentGateway: {
    rootURL: `braintree/`,
    generateClientToken: function () {
      return this.rootURL + `generate/client-token/`;
    },
    checkoutWithPayment: function () {
      return this.rootURL + `checkout-with-payment/`;
    },
    queryPaymentStatus: function () {
      return this.rootURL + 'query-status-of-payment/:momentID/:orderItemID/:transactionID/'
    }
  },
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
    retrieveMomentStream: function () {
      return this.retrieveEventDetails() + 'retrieve-moment-stream/';
    },
    retrieveEventDetails: function () {
      return this.rootURL + 'retrieve/details/:momentID/';
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
    manageProfile: function () {
      return this.rootURL + 'manage-profile/';
    },
    changePassword: function () {
      return this.manageProfile() + 'change-password/';
    },
    checkIf__HasBeenTaken: {
      rootURL: 'has-been-taken/',
      email: function () {
        return this.rootURL + 'email/:email/';
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
