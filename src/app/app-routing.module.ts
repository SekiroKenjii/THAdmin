import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './areas/dashboard/dashboard.component';
import { HomeComponent } from './areas/home/home.component';
import { CategoryComponent } from './areas/product-details/category/category.component';
import { ConditionComponent } from './areas/product-details/condition/condition.component';
import { DemandComponent } from './areas/product-details/demand/demand.component';
import { TrademarkComponent } from './areas/product-details/trademark/trademark.component';
import { VendorComponent } from './areas/product-details/vendor/vendor.component';
import { ProductComponent } from './areas/product/product.component';
import { AuthGuard } from './_guards/auth.guard';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', component: HomeComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'categories', component: CategoryComponent },
      { path: 'conditions', component: ConditionComponent },
      { path: 'demands', component: DemandComponent },
      { path: 'trademarks', component: TrademarkComponent },
      { path: 'vendors', component: VendorComponent },
      { path: 'products', component: ProductComponent },
      // { path: 'roles', component: RolesComponent },
      // { path: 'user/employees', component: EmployeesComponent },
      { path: '**', component: DashboardComponent, pathMatch: 'full' }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
