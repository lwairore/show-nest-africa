/// <reference lib="webworker" />

import { PrimeCalculator } from "../prime";

addEventListener('message', ({ data }) => {
  const response = PrimeCalculator.findNthPrimeNumber(
    parseInt(data));

  postMessage(response);
});
