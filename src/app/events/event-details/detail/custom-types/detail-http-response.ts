import { ImageItemPreviewHttpResponse, VideoItemPreviewHttpResponse } from '@sharedModule/custom-types';
import { TicketDetailHttpResponse } from '../../custom-types';

export type DetailHttpResponse = Readonly<{
    name_of_moment?: string;
    poster?: ImageItemPreviewHttpResponse;
    description?: string;
    venue?: string;
    event_trailer?: VideoItemPreviewHttpResponse;
    can_get_a_ticket?: boolean;
    event_is?: string;
    replay_ended_on?: string;
    ended_on?: string;
    replay_is_available_for?: string;
    starts_on?: string;
    can_purchase_replay?: boolean;
    sales_ends_on?: string;
    highlights?: VideoItemPreviewHttpResponse;
    tickets?: ReadonlyArray<TicketDetailHttpResponse>;
}>
