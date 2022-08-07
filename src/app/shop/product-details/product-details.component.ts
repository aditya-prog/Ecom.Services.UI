import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BasketService } from 'src/app/basket/basket.service';
import { IProduct } from 'src/app/shared/models/product';
import { ShopService } from '../shop.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
 public product: IProduct;
 public quantity = 1;

  constructor(private shopService: ShopService, private activatedRoute: ActivatedRoute, private basketService: BasketService) { }

  ngOnInit(): void {
    this.loadProduct();
  }

  public addItemToBasket() {
    this.basketService.addItemToBasket(this.product, this.quantity);
  }

  public increment(){
    this.quantity++;
  }
  
  public decrement(){
    if(this.quantity > 1)
    {
      this.quantity--;
    }
  }

  private loadProduct(){
    const productId = this.activatedRoute.snapshot.paramMap.get('id');
    this.shopService.getProduct(+productId).subscribe(product => {
        this.product = product
      },
      error => {
        console.log(error);
      });
  }

}
