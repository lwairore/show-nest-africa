import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FaqComponent } from './faq.component';
import { FanComponent } from './fan/fan.component';
import { CreatorComponent } from './creator/creator.component';


const routes: Routes = [
  {
    path: '',
    component: FaqComponent,
    children: [
      {
        path: 'fan',
        component: FanComponent,
      },
      {
        path: 'creator',
        component: CreatorComponent,
      },
      {
        path: '**',
        redirectTo: 'fan'
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FaqRoutingModule { }
