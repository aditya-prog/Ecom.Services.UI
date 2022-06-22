import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IBrand } from '../shared/models/brand';
import { IPagination } from '../shared/models/pagination';
import { IProduct } from '../shared/models/product';
import { IType } from '../shared/models/productType';
import { ShopParams } from '../shared/models/shopParams';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {

  // From angular 9 and above static is optional and by default set to false
  // static equals true means that html element is a static element and is not relying on any
  // dynamic activities like *ngIf.. (which displays element conditionally i.e dynamically) 
  // So , If we are using *ngIf on elements then static should be set to false
  //However, below static value can be anything b/w true/ false for our scenario 
  @ViewChild('search', {static: true}) searchTerm: ElementRef;
  public products: IProduct[];
  public brands: IBrand[];
  public types: IType[];
  public shopParams = new ShopParams();
  public totalCount: number;
  public sortOptions = [
    {name: 'Alphabetical', value: 'name'},
    {name: 'Price: Low to High', value: 'priceAsc'},
    {name: 'Price: High to Low', value: 'priceDesc'},
  ];


  constructor(private shopService: ShopService) { }

  ngOnInit(): void {
     this.getProducts();
     this.getBrands();
     this.getTypes();
  }

  public getProducts(){
    this.shopService.getProducts(this.shopParams).subscribe((res: IPagination) => {    
      this.products = res.data
      this.totalCount = res.count;
    },
    error => {
      console.log(error);   
    });
  }

  public getBrands(){
    this.shopService.getBrands().subscribe((res: IBrand[]) => {
      // All options to select all brands
      this.brands = [{brandName: 'All', id: 0}, ...res];
    },
    error => {
      console.log(error);   
    });
  }

  public getTypes(){
    this.shopService.getTypes().subscribe((res: IType[]) => {
       // All options to select all types
      this.types = [{productTypeName: 'All', id: 0}, ...res];
    },
    error => {
      console.log(error);   
    });
  }

  public onBrandSelected(brandId: number){
    this.shopParams.pageNumber = 1;
    this.shopParams.brandId = brandId;
    this.getProducts();
  }

  public onTypeSelected(typeId: number){
    this.shopParams.pageNumber = 1;
    this.shopParams.typeId = typeId;
    this.getProducts();
  }

  public onSortSelected(sortBy: string){
    this.shopParams.sortBy = sortBy;
    this.getProducts();
  }

  onPageChanged(pageNumber: number) {
    // On applying filters, It was making double api calls, one by filter method and other by pageChange
    // method.
    // To resolve this issue we added one if cond saying that pageChanged method will make api call
    // only when page is really changed
    if (this.shopParams.pageNumber !== pageNumber) { 
      this.shopParams.pageNumber = pageNumber;
      this.getProducts();
    }
  }

  onSearch() {
    this.shopParams.search = this.searchTerm.nativeElement.value;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  
  onReset() {
    this.searchTerm.nativeElement.value = '';
    this.shopParams = new ShopParams(); // Reset everything including all filters and serach functionality
    this.getProducts();
  }

}
