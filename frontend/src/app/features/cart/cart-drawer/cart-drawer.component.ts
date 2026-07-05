import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { CartItem } from '../../../core/models/cart.model';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Overlay -->
    @if (isOpen) {
      <div 
        class="fixed inset-0 bg-black/50 z-[60] transition-opacity"
        (click)="close()">
      </div>
    }

    <!-- Drawer -->
    <div 
      [class.translate-x-0]="isOpen"
      [class.translate-x-full]="!isOpen"
      class="fixed right-0 top-0 h-full w-full md:w-96 bg-surface shadow-2xl z-[70] transition-transform duration-300 flex flex-col">
      
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-muted/20">
        <h2 class="text-xl font-display text-gold">
          Mon Panier ({{ itemCount }})
        </h2>
        <button (click)="close()" class="text-text hover:text-gold transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Cart Items -->
      <div class="flex-1 overflow-y-auto p-6">
        @if (cartItems.length === 0) {
          <div class="flex flex-col items-center justify-center h-full text-center">
            <svg class="w-16 h-16 text-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p class="text-muted mb-4">Votre panier est vide</p>
            <a routerLink="/catalogue" (click)="close()" 
               class="btn-primary">
              Voir la collection
            </a>
          </div>
        } @else {
          <div class="space-y-4">
            @for (item of cartItems; track item.product.id + '-' + item.variant.id) {
              <div class="flex space-x-4 bg-surface-2 p-4 rounded">
                <!-- Image -->
                <img 
                  [src]="item.product.primaryImageUrl || 'assets/placeholder.jpg'" 
                  [alt]="item.product.name"
                  class="w-20 h-20 object-cover rounded">
                
                <!-- Details -->
                <div class="flex-1">
                  <h3 class="text-text font-medium text-sm">{{ item.product.name }}</h3>
                  <p class="text-muted text-xs">{{ item.product.brand }}</p>
                  <p class="text-gold text-sm mt-1">{{ item.variant.volumeMl }}ml</p>
                  
                  <!-- Quantity Controls -->
                  <div class="flex items-center space-x-2 mt-2">
                    <button 
                      (click)="updateQuantity(item, item.quantity - 1)"
                      class="w-6 h-6 bg-surface rounded flex items-center justify-center hover:bg-gold hover:text-bg transition-colors">
                      -
                    </button>
                    <span class="text-text text-sm w-8 text-center">{{ item.quantity }}</span>
                    <button 
                      (click)="updateQuantity(item, item.quantity + 1)"
                      class="w-6 h-6 bg-surface rounded flex items-center justify-center hover:bg-gold hover:text-bg transition-colors">
                      +
                    </button>
                    <button 
                      (click)="removeItem(item)"
                      class="ml-auto text-danger hover:text-danger/75 transition-colors">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <!-- Price -->
                <div class="text-right">
                  <p class="text-gold font-semibold">
                    {{ item.variant.price * item.quantity }} TND
                  </p>
                </div>
              </div>
            }
          </div>
        }
      </div>

      <!-- Footer -->
      @if (cartItems.length > 0) {
        <div class="border-t border-muted/20 p-6 space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-muted">Sous-total</span>
            <span class="text-gold font-bold text-xl">{{ total }} TND</span>
          </div>
          <a 
            routerLink="/checkout" 
            (click)="close()"
            class="block w-full btn-primary text-center">
            Passer la commande
          </a>
        </div>
      }
    </div>
  `
})
export class CartDrawerComponent implements OnInit {
  isOpen = false;
  cartItems: CartItem[] = [];
  total = 0;
  itemCount = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cartItems = cart;
      this.total = this.cartService.getTotal();
      this.itemCount = this.cartService.getItemCount();
    });
  }

  @HostListener('window:toggle-cart')
  toggle(): void {
    this.isOpen = !this.isOpen;
  }

  close(): void {
    this.isOpen = false;
  }

  updateQuantity(item: CartItem, newQuantity: number): void {
    if (newQuantity > 0) {
      this.cartService.updateQuantity(item.product.id, item.variant.id, newQuantity);
    }
  }

  removeItem(item: CartItem): void {
    this.cartService.removeItem(item.product.id, item.variant.id);
  }
}
