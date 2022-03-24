import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalFullscreenComponent } from './modal-fullscreen/modal-fullscreen.component';
import { RouterModule } from '@angular/router';
import { HoverCollapseComponent } from './hover-collapse/hover-collapse.component';



@NgModule({
  declarations: [
    ModalFullscreenComponent,
    HoverCollapseComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [
    ModalFullscreenComponent,
    HoverCollapseComponent,
  ]
})
export class LibsModule { }
