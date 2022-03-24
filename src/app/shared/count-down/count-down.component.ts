import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'snap-count-down',
  templateUrl: './count-down.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountDownComponent implements OnInit, OnDestroy {

  private _subscription: Subscription | undefined;

  public dateNow = new Date();

  private _dDay: Date | undefined;

  @Input()
  set startDate(date: string) {
    this._dDay = new Date(date);
  }

  @Input() intervalToUse = 1000;

  milliSecondsInASecond = 1000;
  hoursInADay = 24;
  minutesInAnHour = 60;
  secondsInAMinute = 60;

  public timeDifference: number | undefined;
  public secondsToDday: number | undefined;
  public minutesToDday: number | undefined;
  public hoursToDday: number | undefined;
  public daysToDday: number | undefined;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
  ) {

  }

  private _manuallyTriggerChangeDetection() {
    this._changeDetectorRef.detectChanges();
  }

  private getTimeDifference() {
    if (this._dDay instanceof Date) {
      this.timeDifference = this._dDay.getTime() - new Date().getTime();
      this.allocateTimeUnits(this.timeDifference);
    }
  }

  private allocateTimeUnits(timeDifference: number) {
    this.secondsToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.secondsInAMinute);
    this.minutesToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.secondsInAMinute);
    this.hoursToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.secondsInAMinute) % this.hoursInADay);
    this.daysToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.secondsInAMinute * this.hoursInADay));
  }

  ngOnInit() {
    this._subscription = interval(this.intervalToUse)
      .subscribe(x => {
        this.getTimeDifference();

        this._manuallyTriggerChangeDetection();
      });
  }

  ngOnDestroy() {
    if (this._subscription instanceof Subscription) {
      this._subscription.unsubscribe();
    }
  }

}
