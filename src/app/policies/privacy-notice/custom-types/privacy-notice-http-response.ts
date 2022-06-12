export type PrivacyNoticeHttpResponse = Readonly<{
    personal_information_processed?: string;
    sensitive_information_processed?: string;
    information_from_third_parties?: string;
    processing_information_method?: string;
    situation_and_with_which_parties_we_share_personal_information?: string;
    how_we_keep_information_safe?: string;
    user_rights?: string;
    exercise_my_rights?: string;
    modified_date?: string;
}>
