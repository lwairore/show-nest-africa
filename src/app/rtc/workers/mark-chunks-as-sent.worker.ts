/// <reference lib="webworker" />

import { livestreamDb } from "../db/livestream.db";

addEventListener('message', ({ data }) => {
  livestreamDb
    .markChunksAsSent(data)
    .then(_ => {
      const response = `worker response to marking chunks as sent`;
      postMessage(response);
    });
});
