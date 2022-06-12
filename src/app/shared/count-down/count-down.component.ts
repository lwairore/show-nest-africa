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
  @Input() displayFormat: 'yev' | 'normal' = 'normal';

  @Input() displayProperty = 'd-block';

  private _subscription: Subscription | undefined;

  public dateNow = new Date();

  private _dDay: Date | undefined;

  @Input()
  set startDate(date: string) {
    this._dDay = new Date(date);
  }

  @Input() intervalToUse = 1000;

  private _milliSecondsInASecond = 1000;
  private _hoursInADay = 24;
  private _minutesInAnHour = 60;
  private _secondsInAMinute = 60;

  private _timeDifference: number | undefined;
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
      this._timeDifference = this._dDay.getTime() - new Date().getTime();
      if (this._timeDifference > 0) {
        this.allocateTimeUnits(this._timeDifference);
      }
    }
  }

  private allocateTimeUnits(_timeDifference: number) {
    this.secondsToDday = Math.floor((_timeDifference) / (this._milliSecondsInASecond) % this._secondsInAMinute);
    this.minutesToDday = Math.floor((_timeDifference) / (this._milliSecondsInASecond * this._minutesInAnHour) % this._secondsInAMinute);
    this.hoursToDday = Math.floor((_timeDifference) / (this._milliSecondsInASecond * this._minutesInAnHour * this._secondsInAMinute) % this._hoursInADay);
    this.daysToDday = Math.floor((_timeDifference) / (this._milliSecondsInASecond * this._minutesInAnHour * this._secondsInAMinute * this._hoursInADay));
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
