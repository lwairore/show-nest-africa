import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PurchasesComponent } from './purchases.component';
import { ListPurchaseComponent } from './list-purchase/list-purchase.component';


const routes: Routes = [
  {
    path: '',
    component: PurchasesComponent,
    children: [
      {
        path: '',
        component: ListPurchaseComponent,
      },
      {
        path: ':momentID/details',
        loadChildren: () => import('./purchase-detail/purchase-detail.module')
          .then(p => p.PurchaseDetailModule),
      },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchasesRoutingModule { }
