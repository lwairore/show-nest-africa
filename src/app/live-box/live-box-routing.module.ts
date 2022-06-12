import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LiveBoxComponent } from './live-box.component';
import { WeAreComingSoonComponent } from './we-are-coming-soon/we-are-coming-soon.component';


const routes: Routes = [
  {
    path: '',
    component: LiveBoxComponent,
    children: [
      {
        path: '',
        component: WeAreComingSoonComponent,
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiveBoxRoutingModule { }
