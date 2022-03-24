import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PastEventsDetailsComponent } from './past-events-details.component';
import { EventPhotosComponent } from './sections/event-photos/event-photos.component';
import { EventVideosComponent } from './sections/event-videos/event-videos.component';
import { TestimonialComponent } from './sections/testimonial/testimonial.component';


const routes: Routes = [
  {
    path: '',
    component: PastEventsDetailsComponent,
  },
  {
    path: 'testimonials',
    component: TestimonialComponent,
  },
  {
    path: 'photo-gallery',
    component: EventPhotosComponent,
  },
  {
    path: 'video-gallery',
    component: EventVideosComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PastEventDetailsRoutingModule { }
