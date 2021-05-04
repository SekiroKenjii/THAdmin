import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './areas/dashboard/dashboard.component';
import { HomeComponent } from './areas/home/home.component';
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
      // { path: 'categories', component: CategoriesComponent },
      // { path: 'conditions', component: ConditionsComponent },
      // { path: 'demands', component: DemandsComponent },
      // { path: 'trademarks', component: TrademarksComponent },
      // { path: 'vendors', component: VendorsComponent },
      // { path: 'products', component: ProductsComponent },
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
