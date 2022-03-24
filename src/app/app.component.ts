import { Component, OnInit } from '@angular/core';
import { PrimeCalculator } from './prime';
import { HelloService } from './services/hello.service';
import { PrimeCalculatorService } from './services/prime-calculator.service';

@Component({
  selector: 'snap-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  countTomato = 0;
  countApple = 0;

  prime10 = 0;

  prime10000 = 0;

  constructor(
    private helloService: HelloService,
    private _primeCalculatorService: PrimeCalculatorService) {
  }

  incTomato() {
    this.countTomato++;
  }

  async incApple() {
    await this.helloService.countApple(
      this.countApple,
      (value: number) => this.countApple = value);
  }

  find10thPrimeNumber() {
    this.prime10 = PrimeCalculator.findNthPrimeNumber(10);
  }

  find10000thPrimeNumber() {
    this._primeCalculatorService
      .find10000thPrimeNumber(
        (value: number) => this.prime10000 = value
      )
  }

}