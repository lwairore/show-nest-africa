/// <reference lib="webworker" />

import { isObjectEmpty } from "@sharedModule/utilities/is-object-empty.util";
import { uploadLivestreamResponseDb } from "../db/upload-livestream-response.db";

addEventListener('message', async ({ data }) => {
  await uploadLivestreamResponseDb
    .retrieveFirstUploadLivestreamRepsonse()
    .then(details => {
      console.log({ details })
      if (!isObjectEmpty(details)) {
        postMessage(details?.fileName);
      }
    });
});
