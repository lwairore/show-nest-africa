import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelloService {

  constructor() { }

  async countApple(counter: number,
    updateCounter: (value: number) => void) {
    if (typeof Worker !== 'undefined') {
      const worker = new Worker('../workers/hello.worker',
        {
          type: 'module'
        });

      worker.onmessage = ({ data }) => {
        updateCounter(data);
      };

      worker.postMessage(counter);
    }
  }
}
