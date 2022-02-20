import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { CountDownComponent } from './count-down/count-down.component';
import { PluralSingularPipe } from './plural-singular.pipe';
import { FooterComponent } from './footer/footer.component';



@NgModule({
  declarations: [
    HeaderComponent,
    CountDownComponent,
    PluralSingularPipe,
    FooterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [
    HeaderComponent,
    CountDownComponent,
    PluralSingularPipe,
    FooterComponent,
  ]
})
export class SharedModule { }
