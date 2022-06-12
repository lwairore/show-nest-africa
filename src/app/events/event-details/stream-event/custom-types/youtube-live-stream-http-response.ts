import { YTPlayerVar } from './ytplayer-var';

export type YoutubeLiveStreamHttpResponse = Readonly<{
    width?: number;
    height?: number;
    video_id?: string;
    player_vars?: YTPlayerVar;
}>
