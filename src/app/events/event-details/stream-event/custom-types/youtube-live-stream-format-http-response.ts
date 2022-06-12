import { YTPlayerVar } from './ytplayer-var';

export type YoutubeLiveStreamFormatHttpResponse =Readonly< {
    width?: number;
    height?: number;
    videoID?: string;
    playerVars?: YTPlayerVar;
}>
