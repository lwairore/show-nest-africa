import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalFullscreenComponent } from './modal-fullscreen/modal-fullscreen.component';
import { RouterModule } from '@angular/router';
import { HoverCollapseComponent } from './hover-collapse/hover-collapse.component';
import { LoadingScreenComponent } from './loading-screen/loading-screen.component';
import { LoadingScreenService } from './loading-screen/loading-screen.service';



@NgModule({
  declarations: [
    ModalFullscreenComponent,
    HoverCollapseComponent,
    LoadingScreenComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [
    ModalFullscreenComponent,
    HoverCollapseComponent,
    LoadingScreenComponent,
  ],
})
export class LibsModule { }
