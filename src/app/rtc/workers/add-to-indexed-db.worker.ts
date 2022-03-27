/// <reference lib="webworker" />

import { LiveStream, livestreamDb } from "../db/livestream.db";

addEventListener('message', ({ data }) => {
  console.log({ data });
  addNewLiveStream(data).then(details => {
    const response = `Worker successfully added livestream`;

    postMessage(response);
  });
});


async function addNewLiveStream(data: LiveStream) {
  console.log("addNewLiveStream")
  console.log({data})
  console.log("addNewLiveStream")
  await livestreamDb.liveStreams.add(data);
}
