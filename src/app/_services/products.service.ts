import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../_models/productDto';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiBaseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  //Product Image
  public addProductImage(productImage: any): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/apiBaseUrl/add`, productImage, { observe: 'response' });
  }
  public updateProductImage(productId: number, productImage: File[]): Observable<any> {
    return this.http.put<File[]>(`${this.apiBaseUrl}/productimage/update/${productId}`, productImage, { observe: 'response' });
  }
  public deleteProductImage(productImageId: number): Observable<any> {
    return this.http.delete<void>(`${this.apiBaseUrl}/productimage/delete/${productImageId}`, { observe: 'response' });
  }

  //Product
  public getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiBaseUrl}/products`);
  }
  public addProduct(product: Product): Observable<any> {
    return this.http.post<Product>(`${this.apiBaseUrl}/product/add`, product, { observe: 'response' });
  }
  public updateProduct(productId: number, product: Product): Observable<any> {
    return this.http.put<Product>(`${this.apiBaseUrl}/product/update/${productId}`, product, { observe: 'response' });
  }
  public deleteProduct(productId: number): Observable<any> {
    return this.http.delete<void>(`${this.apiBaseUrl}/product/delete/${productId}`, { observe: 'response' });
  }

}
