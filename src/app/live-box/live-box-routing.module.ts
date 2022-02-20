import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LiveBoxComponent } from './live-box.component';
import { LiveboxMainComponent } from './livebox-main/livebox-main.component';


const routes: Routes = [
  {
    path: '',
    component: LiveBoxComponent,
    children: [
      {
        path: '',
        component: LiveboxMainComponent,
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiveBoxRoutingModule { }
