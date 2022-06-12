export type PaymentStatusHttpResponse = Readonly<{
  title?: string;
  description?: string;
  paid?: boolean;
  action?: 'goTo__eventDetails' | 'purchase__tickets' | 'try__again';
}>
