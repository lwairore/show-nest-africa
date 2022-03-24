/// <reference lib="webworker" />

import { LiveStream } from "../db/livestream.db";
import { blobToFile } from "src/app/shared/utilities/blob-to-file.util";

addEventListener('message', ({ data }) => {
  // const response = `worker response to ${data}`;
  console.log("mergeBlobsToAFile$")
  console.table(data);

  const MIME_TYPE = data.mimetype;

  console.table(MIME_TYPE)

  const STREAMS = data.livestreams;

  console.table(STREAMS);

  // const BUFFERS_TO_ARRAY

  const FORMATTED_RECORDED_BLOBS = STREAMS?.map(
    (detail: LiveStream) => {
      const blob = detail.blob

      blob.type
    });

  console.log({ FORMATTED_RECORDED_BLOBS });

  const MERGE_BLOB = new Blob(FORMATTED_RECORDED_BLOBS, { type: MIME_TYPE });
  console.log({ MERGE_BLOB })

  const FILE = blobToFile(MERGE_BLOB);

  console.log({ FILE });

  console.log("mergeBlobsToAFile$")
  postMessage(FILE);
});
