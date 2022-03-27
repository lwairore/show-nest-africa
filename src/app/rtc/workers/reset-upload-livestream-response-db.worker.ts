/// <reference lib="webworker" />

import { uploadLivestreamResponseDb } from "../db/upload-livestream-response.db";

addEventListener('message', ({ data }) => {
  uploadLivestreamResponseDb
    .resetDatabase()
    .then(_ => {
      const response = `worker response to resetting database "uploadLivestreamResponseDb"`;
      postMessage(response);
    });
});
