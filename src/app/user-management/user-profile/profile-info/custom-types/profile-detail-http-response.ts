import { ImageItemPreviewHttpResponse } from '@sharedModule/custom-types';
import { GenderChoiceHttpResponse } from './gender-choice-http-response';

export type ProfileDetailHttpResponse =Readonly< {
    avatar?: ImageItemPreviewHttpResponse;
    phone_number?: string;
    date_of_birth?: string;
    username?: string;
    bio?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    gender_choices?: ReadonlyArray<GenderChoiceHttpResponse>;
}>
