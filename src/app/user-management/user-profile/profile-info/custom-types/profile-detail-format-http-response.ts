import { ImageItemPreviewFormatHttpResponse } from '@sharedModule/custom-types';
import { GenderChoiceHttpResponse } from './gender-choice-http-response';

export type ProfileDetailFormatHttpResponse = Readonly<{
    avatar?: ImageItemPreviewFormatHttpResponse;
    phoneNumber: string;
    dateOfBirth: string;
    username: string;
    bio: string;
    firstName: string;
    lastName: string;
    email: string;
    genderChoices?: ReadonlyArray<GenderChoiceHttpResponse>;
}>
