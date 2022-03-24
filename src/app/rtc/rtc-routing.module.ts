import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RtcComponent } from './rtc.component';
import { StRtcComponent } from './st-rtc/st-rtc.component';


const routes: Routes = [
  {
    path: '',
    component: RtcComponent,
    children: [
      {
        path: 'st',
        component: StRtcComponent,
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RtcRoutingModule { }
