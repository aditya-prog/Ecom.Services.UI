import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagerComponent } from './components/pager/pager.component';
import { PagingHeaderComponent } from './components/paging-header/paging-header.component';
import {PaginationModule} from 'ngx-bootstrap/pagination';
import { OrderTotalsComponent } from './components/order-totals/order-totals.component';


@NgModule({
  declarations: [
    PagerComponent,
    PagingHeaderComponent,
    OrderTotalsComponent
  ],
  imports: [
    CommonModule,
    PaginationModule.forRoot()
  ],
  exports: [
    PagingHeaderComponent,
    PagerComponent,
    PaginationModule,
    OrderTotalsComponent
  ]
})
export class SharedModule { }
