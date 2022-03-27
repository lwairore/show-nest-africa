/// <reference lib="webworker" />

import { uploadLivestreamResponseDb } from "../db/upload-livestream-response.db";

addEventListener('message', ({ data }) => {
  uploadLivestreamResponseDb
    .recordUploadLivestreamRepsonse(data)
    .then(_ => {
      const response = `worker response to ${data}`;
      postMessage(response);
    });
});
