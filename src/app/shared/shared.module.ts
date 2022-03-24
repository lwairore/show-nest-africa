import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { CountDownComponent } from './count-down/count-down.component';
import { PluralSingularPipe } from './plural-singular.pipe';
import { FooterComponent } from './footer/footer.component';
import { ErrornoteComponent } from './components/errornote/errornote.component';
import { DisplayFormFieldErrorsComponent } from './components/display-form-field-errors/display-form-field-errors.component';
import { AuthenticationService } from './services';
import { HasBeenTakenDirective } from './directives/has-been-taken.directive';
import { BusyIndicatorDirective } from './directives/busy-indicator.directive';
import { AjaxButtonComponent } from './components/ajax-button/ajax-button.component';
import { IntToRGBPipe } from './pipes/int-to-rgb.pipe';
import { UpdateShowcaseItemWithPhotoGalleryComponent } from './components/update-showcase-item-with-photo-gallery/update-showcase-item-with-photo-gallery.component';
import { SafePipe } from './pipes/safe.pipe';
import { GenerateFakeObjectsPipe } from './pipes/generate-fake-objects.pipe';
import { DateAgoPipe } from './pipes/date-ago.pipe';
import { ImgLazyComponent } from './components/img-lazy/img-lazy.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ExternalLinkDirective } from './directives/external-link.directive';
import { ItemDescriptionComponent } from './components/item-description/item-description.component';
import { FormatUrlPipe } from './pipes/format-url.pipe';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { HesitateDirective } from './directives/hesitate.directive';



@NgModule({
  declarations: [
    HeaderComponent,
    CountDownComponent,
    PluralSingularPipe,
    FooterComponent,
    ErrornoteComponent,
    DisplayFormFieldErrorsComponent,
    HasBeenTakenDirective,
    BusyIndicatorDirective,
    AjaxButtonComponent,
    IntToRGBPipe,
    UpdateShowcaseItemWithPhotoGalleryComponent,
    SafePipe,
    GenerateFakeObjectsPipe,
    DateAgoPipe,
    ImgLazyComponent,
    ExternalLinkDirective,
    ItemDescriptionComponent,
    FormatUrlPipe,
    BreadcrumbComponent,
    HesitateDirective,
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgxSkeletonLoaderModule,
  ],
  exports: [
    HeaderComponent,
    CountDownComponent,
    PluralSingularPipe,
    FooterComponent,
    ErrornoteComponent,
    DisplayFormFieldErrorsComponent,
    HasBeenTakenDirective,
    BusyIndicatorDirective,
    AjaxButtonComponent,
    IntToRGBPipe,
    UpdateShowcaseItemWithPhotoGalleryComponent,
    SafePipe,
    GenerateFakeObjectsPipe,
    DateAgoPipe,
    ImgLazyComponent,
    ExternalLinkDirective,
    ItemDescriptionComponent,
    FormatUrlPipe,
    BreadcrumbComponent,
    HesitateDirective,
  ],
  providers: [
    AuthenticationService
  ],
})
export class SharedModule { }
