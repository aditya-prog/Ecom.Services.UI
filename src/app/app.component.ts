import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IPagination } from './models/pagination';
import { IProduct } from './models/product';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'EcomServices UI';
  productsList: IProduct[];
  
  constructor(private httpClient: HttpClient) {
  }

  public ngOnInit(): void {
   this.httpClient.get('https://localhost:44339/api/Products?PageSize=50').subscribe((res: IPagination) => {
     this.productsList = res.data;
   });
  }
  
}
