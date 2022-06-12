import { Directive, TemplateRef, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[snapBreadcrumbItem]'
})
export class BreadcrumbItemDirective {
  @Input() active=false;

  constructor(
    public templateRef: TemplateRef<ElementRef>
  ) { }

}
