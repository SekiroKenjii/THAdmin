import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category, Condition, Demand, Trademark, Vendor } from '../_models/productDetailDto';

@Injectable({
  providedIn: 'root'
})
export class ProductDetailsService {

  private apiBaseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  //Category
  public getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiBaseUrl}/categories`);
  }
  public addCategory(category: Category): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/category/add`, category, { observe: 'response' });
  }
  public updateCategory(categoryId: number, category: Category): Observable<any> {
    return this.http.put(`${this.apiBaseUrl}/category/update/${categoryId}`, category, { observe: 'response' });
  }
  public deleteCategory(categoryId: number): Observable<any> {
    return this.http.delete<void>(`${this.apiBaseUrl}/category/delete/${categoryId}`, { observe: 'response' });
  }

  //Condition
  public getConditions(): Observable<Condition[]> {
    return this.http.get<Condition[]>(`${this.apiBaseUrl}/conditions`);
  }
  public addCondition(condition: Condition): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/condition/add`, condition, { observe: 'response' });
  }
  public updateCondition(conditionId: number, condition: Condition): Observable<any> {
    return this.http.put(`${this.apiBaseUrl}/condition/update/${conditionId}`, condition, { observe: 'response' });
  }
  public deleteCondition(conditionId: number): Observable<any> {
    return this.http.delete<void>(`${this.apiBaseUrl}/condition/delete/${conditionId}`, { observe: 'response' });
  }

  //Demand
  public getDemands(): Observable<Demand[]> {
    return this.http.get<Demand[]>(`${this.apiBaseUrl}/demands`);
  }
  public addDemand(demand: Demand): Observable<any> {
    return this.http.post<Demand>(`${this.apiBaseUrl}/demand/add`, demand, { observe: 'response' });
  }
  public updateDemand(demandId: number, demand: Demand): Observable<any> {
    return this.http.put<Demand>(`${this.apiBaseUrl}/demand/update/${demandId}`, demand, { observe: 'response' });
  }
  public deleteDemand(demandId: number): Observable<any> {
    return this.http.delete<void>(`${this.apiBaseUrl}/demand/delete/${demandId}`, { observe: 'response' });
  }

  //Trademark
  public getTrademarks(): Observable<Trademark[]> {
    return this.http.get<Trademark[]>(`${this.apiBaseUrl}/trademarks`);
  }
  public addTrademark(trademark: any): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/trademark/add`, trademark, { observe: 'response' });
  }
  public updateTrademark(trademarkId: number, trademark: any): Observable<any> {
    return this.http.put(`${this.apiBaseUrl}/trademark/update/${trademarkId}`, trademark, { observe: 'response' });
  }
  public deleteTrademark(trademarkId: number): Observable<any> {
    return this.http.delete<void>(`${this.apiBaseUrl}/trademark/delete/${trademarkId}`, { observe: 'response' });
  }

  //Vendor
  public getVendors(): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(`${this.apiBaseUrl}/vendors`);
  }
  public addVendor(vendor: Vendor): Observable<any> {
    return this.http.post<Vendor>(`${this.apiBaseUrl}/vendor/add`, vendor, { observe: 'response' });
  }
  public updateVendor(vendorId: number, vendor: Vendor): Observable<any> {
    return this.http.put<Vendor>(`${this.apiBaseUrl}/vendor/update/${vendorId}`, vendor, { observe: 'response' });
  }
  public deleteVendor(vendorId: number): Observable<any> {
    return this.http.delete<void>(`${this.apiBaseUrl}/vendor/delete/${vendorId}`, { observe: 'response' });
  }
}
