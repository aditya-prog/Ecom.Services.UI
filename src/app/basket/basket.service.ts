import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IBasket, IBasketItem, Basket, IBasketTotals } from '../shared/models/basket';
import { IProduct } from '../shared/models/product';

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  private basketSource = new BehaviorSubject<IBasket>(null); // Contains current basket
  private basketTotal = new BehaviorSubject<IBasketTotals>(null);
  public baseUrl = environment.apiUrl;
  public basket$ = this.basketSource.asObservable(); // this will be used for subscribing as we nvr subscribe subject directly
  public basketTotal$ = this.basketTotal.asObservable();
  constructor(private http: HttpClient) {}

  public getBasket(id: string): Observable<void> {
    return this.http.get(this.baseUrl + 'basket/' + id).pipe(
      map((basket: IBasket) => {
        this.basketSource.next(basket); //next() returns void, so getBasket finally return Observable<Void>
        this.calculateTotals();
      })
    );
  }

  public setBasket(basket: IBasket): void {
    this.http.post(this.baseUrl + 'basket', basket).subscribe(
      (response: IBasket) => {
        this.basketSource.next(response);
        this.calculateTotals();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  public getCurrentBasketValue(): IBasket {
    return this.basketSource.value; // returns the  current basketObject/null present in basketSource
  }

  public addItemToBasket(item: IProduct, quantity: number = 1) {
    const itemToAdd: IBasketItem = this.mapProductItemToBasketItem(
      item,
      quantity
    );
    let basket = this.getCurrentBasketValue() ?? this.createBasket();

    // Below code will not work becoz we may hv to add a new item or update existing item in basket
    // basket.items.push(itemToAdd);

    basket.items = this.addOrUpdateBasketItem(itemToAdd, basket.items);
    this.setBasket(basket);
  }

  public incrementItemQuantity(item: IBasketItem){
    const basket = this.getCurrentBasketValue();
    const id = basket.items.findIndex(it => it.id == item.id);
    basket.items[id].quantity += 1;
    this.setBasket(basket);
  }

  public decrementItemQuantity(item: IBasketItem){
    const basket = this.getCurrentBasketValue();
    const id = basket.items.findIndex(it => it.id == item.id);
    
    if(basket.items[id].quantity > 1){
      basket.items[id].quantity -= 1;
      this.setBasket(basket);
    }
    else
    {
      this.removeItemFromBasket(item);
    }
  }

  public removeItemFromBasket(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    basket.items = basket.items.filter(it => it.id !== item.id); // remove item from basket
      if(basket.items.length > 0)
      {
        this.setBasket(basket);
      } 
      else
      {
        this.deleteBasket(basket);
      }
  }
  

  public deleteBasket(basket: IBasket) {
    return this.http.delete(this.baseUrl + '/basket/' + basket.id).subscribe(() => {
      localStorage.removeItem('basketId');
      this.basketSource.next(null);
      this.basketTotal.next(null);
    }, error => {
      console.log(error);
    })
  }

  private calculateTotals() {
    const basket = this.getCurrentBasketValue();
    const shipping = 0;
    const subtotal = basket.items.reduce((prev, curr) => (curr.price * curr.quantity) + prev , 0); // Calculate sum of all items
    const total = shipping + subtotal;
    this.basketTotal.next({shipping, subtotal, total});
  }

  private addOrUpdateBasketItem(
    itemToAdd: IBasketItem,
    items: IBasketItem[]
  ): IBasketItem[] {
    const id = items.findIndex((item) => item.id == itemToAdd.id);
    if (id === -1) {
      items.push(itemToAdd);
    } else {
      items[id].quantity += itemToAdd.quantity;
    }
    return items;
  }

  private createBasket(): IBasket {
    const basket = new Basket();
    localStorage.setItem('basketId', basket.id);
    return basket;
  }

  private mapProductItemToBasketItem(
    item: IProduct,
    quantity: number
  ): IBasketItem {
    const basketItem: IBasketItem = {
      id: item.id,
      productName: item.productName,
      price: item.price,
      pictureUrl: item.pictureUrl,
      brand: item.productBrand,
      type: item.productType,
      quantity,
    };
    return basketItem;
  }
}
