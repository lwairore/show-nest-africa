import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrimeCalculatorService {

  constructor() { }

  find10000thPrimeNumber(
    updatePrime10000Var: (value: number) => void
  ) {
    if (typeof Worker !== 'undefined') {
      const worker = new Worker('../workers/prime-calculator.worker',
        { type: 'module' });

      worker.onmessage = ({ data }) => {
        updatePrime10000Var(data);
      }

      worker.postMessage(10000)
    } else {
      // Web Workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }
  }
}
