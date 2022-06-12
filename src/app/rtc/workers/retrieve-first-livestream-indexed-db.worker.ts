/// <reference lib="webworker" />

import { isObjectEmpty } from "@sharedModule/utilities/is-object-empty.util";
import { livestreamDb } from "../db/livestream.db";

addEventListener('message', async ({ data }) => {
  await queryFirstItemFromIndexedDb()
    .then(details => {
      if (!isObjectEmpty(details)) {
        postMessage(details?.id);
      }
    });
});


async function queryFirstItemFromIndexedDb() {
  return await livestreamDb.liveStreams
    .orderBy('id').first();
}