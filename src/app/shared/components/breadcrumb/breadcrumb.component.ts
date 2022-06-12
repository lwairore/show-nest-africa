import { ChangeDetectionStrategy, Component, Input, OnInit, ChangeDetectorRef, ContentChildren, QueryList, AfterViewInit } from '@angular/core';
import * as Immutable from 'immutable';
import { BreadcrumbItemDirective } from './breadcrumb-item.directive';

@Component({
  selector: 'snap-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbComponent implements OnInit, AfterViewInit {
  @Input() breadcrumbDetails = Immutable.fromJS({});

  @ContentChildren(BreadcrumbItemDirective)
  breadcrumbItemsQL: QueryList<BreadcrumbItemDirective> | undefined;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  manuallyTriggerChangeDetection() {
    this._changeDetectorRef.detectChanges();
  }
}
