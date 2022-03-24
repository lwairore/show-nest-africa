import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'snap-hover-collapse',
  templateUrl: './hover-collapse.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HoverCollapseComponent implements OnInit {
  @Input() collapseID = 'collapseExample';

  @ViewChild('collapseAnchorTriggerEl', { read: ElementRef })
  private _collapseAnchorTriggerEl: ElementRef | undefined;

  constructor() { }

  ngOnInit(): void {
  }

  toggleCollapse() {
    if (this._collapseAnchorTriggerEl instanceof ElementRef) {
      this._collapseAnchorTriggerEl.nativeElement.click();
    }
  }
}
