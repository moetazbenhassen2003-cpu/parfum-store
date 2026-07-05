import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart.model';
import { Product, ProductVariant } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<CartItem[]>(this.loadCart());
  public cart$ = this.cartSubject.asObservable();

  constructor() {}

  private loadCart(): CartItem[] {
    const cartJson = localStorage.getItem('cart');
    return cartJson ? JSON.parse(cartJson) : [];
  }

  private saveCart(cart: CartItem[]): void {
    localStorage.setItem('cart', JSON.stringify(cart));
    this.cartSubject.next(cart);
  }

  addItem(product: Product, variant: ProductVariant, quantity = 1): void {
    const cart = this.cartSubject.value;
    const existingItem = cart.find(
      item => item.product.id === product.id && item.variant.id === variant.id
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ product, variant, quantity });
    }

    this.saveCart(cart);
  }

  removeItem(productId: number, variantId: number): void {
    const cart = this.cartSubject.value.filter(
      item => !(item.product.id === productId && item.variant.id === variantId)
    );
    this.saveCart(cart);
  }

  updateQuantity(productId: number, variantId: number, quantity: number): void {
    const cart = this.cartSubject.value;
    const item = cart.find(
      item => item.product.id === productId && item.variant.id === variantId
    );

    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.removeItem(productId, variantId);
      } else {
        this.saveCart(cart);
      }
    }
  }


  clearCart(): void {
    this.saveCart([]);
  }

  getTotal(): number {
    return this.cartSubject.value.reduce(
      (total, item) => total + item.variant.price * item.quantity,
      0
    );
  }

  getItemCount(): number {
    return this.cartSubject.value.reduce(
      (count, item) => count + item.quantity,
      0
    );
  }
}
