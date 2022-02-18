import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SinglesRoutingModule } from './singles-routing.module';
import { SinglesComponent } from './singles.component';


@NgModule({
  declarations: [SinglesComponent],
  imports: [
    CommonModule,
    SinglesRoutingModule
  ]
})
export class SinglesModule { }
