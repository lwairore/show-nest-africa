/// <reference lib="webworker" />

import { livestreamDb } from "../db/livestream.db";

addEventListener('message', async ({ data }) => {
  let responseDetails: any;

  await queryFromIndexedDb(data)
    .then(details => {
      responseDetails = details;
      console.log("in worker");
      console.log({ details });

      return details;
    });

  console.log({ responseDetails })

  postMessage(responseDetails);
});


async function queryFromIndexedDb(configs: {
  key: number,
  incrementBy?: number
}) {
  // return await livestreamDb.liveStreams
  //   .where('id').belowOrEqual(2).toArray();

  const RANGES = deriveLowerLimit(
    configs.key, configs.incrementBy);

  console.table(RANGES)

  const LOWER = RANGES.lower;
  const UPPER = RANGES.upper;

  return await livestreamDb.liveStreams
    .where('id').between(LOWER, UPPER, true, true).toArray();
}

function deriveLowerLimit(upperLimit: number, incrementBy = 3) {
  let LOWER = upperLimit - incrementBy;

  return {
    'lower': LOWER,
    'upper': upperLimit
  }
}
