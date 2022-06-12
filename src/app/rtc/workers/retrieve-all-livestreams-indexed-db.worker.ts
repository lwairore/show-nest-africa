/// <reference lib="webworker" />

import { livestreamDb } from "../db/livestream.db";

addEventListener('message', async ({ data }) => {

  await listLivestreams()
    .then(details => {
      postMessage(details);
    });
});

async function listLivestreams() {
  return await livestreamDb.liveStreams
    .toArray();
}