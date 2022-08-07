import {v4 as uuidv4} from 'uuid';

export interface IBasket {
    id: string;
    items: IBasketItem[];
}


export interface IBasketItem {
    id: number;
    productName: string;
    price: number;
    quantity: number;
    pictureUrl: string;
    brand: string;
    type: string;
}

// When we want to create a new basket , we want to give it a Unique Identifier and easiest way to do this 
// is create a class for our Basket
export class Basket implements IBasket {
    id = uuidv4();
    items: IBasketItem[] = [];

}

export interface IBasketTotals {
    shipping: number;
    subtotal: number;
    total: number;
}