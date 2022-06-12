import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LibraryComponent } from './library.component';


const routes: Routes = [
  {
    path: '',
    component: LibraryComponent,
    children: [
      {
        path: 'purchases',
        loadChildren: () => import('./purchases/purchases.module')
          .then(p => p.PurchasesModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LibraryRoutingModule { }
