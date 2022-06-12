/// <reference lib="webworker" />

import { livestreamDb } from "../db/livestream.db";

addEventListener('message', async ({ data }) => {
  await queryFromIndexedDb(data)
    .then(details => {
      const responseDetails = details;
      postMessage(responseDetails);
    });
});


async function queryFromIndexedDb(configs: {
  key: number,
  decrementBy: number
}) {
  // return await livestreamDb.liveStreams
  //   .where('id').belowOrEqual(2).toArray();

  console.table(configs)

  const RANGES = deriveLowerLimit(
    configs.key, configs.decrementBy);

  console.table(RANGES)

  const LOWER = RANGES.lower;
  const UPPER = RANGES.upper;

  const INCLUDE_LOWER = true;
  const INCLUDE_UPPER = true;

  return await livestreamDb.liveStreams
    .where('id').between(LOWER, UPPER,
      INCLUDE_LOWER, INCLUDE_UPPER).toArray();
}

function deriveLowerLimit(upperLimit: number, decrementBy: number) {
  let LOWER = upperLimit - decrementBy;

  const UPPER = upperLimit - 1;
  // Reduce "UPPER" limit by one in order to get 2 items at a time instead of 3.

  return {
    'lower': LOWER,
    'upper': UPPER
  }
}
