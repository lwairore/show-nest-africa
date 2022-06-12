import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { LibsModule } from '@libsModule/libs.module';
import { StreamEventRoutingModule } from './stream-event-routing.module';
import { StreamEventComponent } from './stream-event.component';
import {SharedModule} from '@sharedModule/shared.module';
import { YTIFrameAPIComponent } from './sections/ytiframe-api/ytiframe-api.component';
import { PlayUploadedComponent } from './sections/play-uploaded/play-uploaded.component';
import { StreamDetailComponent } from './stream-detail/stream-detail.component';
import { ChooseATicketComponent } from './sections/choose-a-ticket/choose-a-ticket.component';


@NgModule({
  declarations: [
    StreamEventComponent,
    YTIFrameAPIComponent,
    PlayUploadedComponent,
    StreamDetailComponent,
    ChooseATicketComponent,
  ],
  imports: [
    CommonModule,
    StreamEventRoutingModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    LibsModule,
    SharedModule,
  ]
})
export class StreamEventModule { }
