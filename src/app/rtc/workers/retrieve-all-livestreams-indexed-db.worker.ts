/// <reference lib="webworker" />

import { LiveStream, livestreamDb } from "../db/livestream.db";

addEventListener('message', async ({ data }) => {
  console.log("Worker")
  let LIVE_STREAMS: Array<LiveStream> = [];
  console.log("Before")
  console.log({ LIVE_STREAMS })

  await listLivestreams()
    .then(details => {
      LIVE_STREAMS = [...details];
      console.log("Gottern details")
      console.log({ details })
    });

  console.log("after");
  console.log({ LIVE_STREAMS });

  postMessage(LIVE_STREAMS);
});

async function listLivestreams() {
  return await livestreamDb.liveStreams
    .toArray();
}