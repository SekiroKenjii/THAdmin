import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopnavComponent } from './mastertheme/topnav/topnav.component';
import { AsidenavComponent } from './mastertheme/asidenav/asidenav.component';
import { FooterComponent } from './mastertheme/footer/footer.component';
import { HomeComponent } from './areas/home/home.component';
import { LoginComponent } from './areas/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingOverlayComponent } from './mastertheme/loading-overlay/loading-overlay.component';
import { DashboardComponent } from './areas/dashboard/dashboard.component';
import { JwtModule } from '@auth0/angular-jwt';
import { HttpClientModule } from '@angular/common/http';
import { CategoryComponent } from './areas/product-details/category/category.component';
import { ConditionComponent } from './areas/product-details/condition/condition.component';
import { LoadingSpinnerComponent } from './mastertheme/loading-spinner/loading-spinner.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { DemandComponent } from './areas/product-details/demand/demand.component';
import { TrademarkComponent } from './areas/product-details/trademark/trademark.component';
import { VendorComponent } from './areas/product-details/vendor/vendor.component';
import { ProductComponent } from './areas/product/product.component';

export function tokenGetter() {
  if (JSON.parse(localStorage.getItem("userToken")!) === null) {
    return null;
  }
  return JSON.parse(localStorage.getItem("userToken")!)['accessToken'];
}

@NgModule({
  declarations: [
    AppComponent,
    TopnavComponent,
    AsidenavComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    LoadingOverlayComponent,
    DashboardComponent,
    CategoryComponent,
    ConditionComponent,
    LoadingSpinnerComponent,
    DemandComponent,
    TrademarkComponent,
    VendorComponent,
    ProductComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 4000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:5000"],
        disallowedRoutes: []
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
