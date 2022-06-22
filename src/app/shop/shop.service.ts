import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBrand } from '../shared/models/brand';
import { IPagination } from '../shared/models/pagination';
import { IType } from '../shared/models/productType';
import {map} from 'rxjs/operators';
import { ShopParams } from '../shared/models/shopParams';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
 
  public baseUrl = 'https://localhost:44339/api/';
  constructor(private http: HttpClient) { }

  public getProducts(shopParams: ShopParams): Observable<IPagination>{
    let params = new HttpParams();

    if(shopParams.brandId != 0){
      params = params.append('brandId', shopParams.brandId.toString());
    }

    if(shopParams.typeId != 0){
      params = params.append('typeId', shopParams.typeId.toString());
    }

    if (shopParams.search) {
      params = params.append('search', shopParams.search)
    }
    
    params = params.append('sortBy', shopParams.sortBy);
    params = params.append('pageIndex', shopParams.pageNumber.toString());
    params = params.append('pageSize', shopParams.pageSize.toString());
    
    return this.http.get<IPagination>(this.baseUrl + 'products', {observe: 'response', params: params})
          .pipe(
              // mapped HttpResponse<IPagination> to IPagination
              map(res => res.body)
            );
  }

  public getBrands(): Observable<IBrand[]>{
    return this.http.get<IBrand[]>(this.baseUrl + 'products/brands');
  }

  public getTypes(): Observable<IType[]>{
    return this.http.get<IType[]>(this.baseUrl + 'products/types');
  }
}
