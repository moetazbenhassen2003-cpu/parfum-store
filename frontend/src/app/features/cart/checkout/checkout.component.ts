import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CartService } from '../../../core/services/cart.service';
import { OrderService } from '../../../core/services/order.service';
import { ToastService } from '../../../core/services/toast.service';
import { CartItem } from '../../../core/models/cart.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="container mx-auto px-4 py-10 max-w-6xl">
      <h1 class="text-4xl font-display text-gold mb-10">Finaliser la commande</h1>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-10">

        <!-- Delivery Form (60%) -->
        <div class="lg:col-span-3">
          <form [formGroup]="checkoutForm" (ngSubmit)="onSubmit()" class="space-y-5">
            <h2 class="text-text text-xl font-semibold mb-4">Informations de livraison</h2>

            <!-- Full Name -->
            <div>
              <label class="block text-text text-sm mb-2">Nom complet *</label>
              <input type="text" formControlName="deliveryFullName" class="input"
                     placeholder="Votre nom et prénom">
              @if (f['deliveryFullName'].invalid && f['deliveryFullName'].touched) {
                <p class="text-danger text-xs mt-1">Ce champ est obligatoire</p>
              }
            </div>

            <!-- Phone -->
            <div>
              <label class="block text-text text-sm mb-2">Téléphone *</label>
              <input type="tel" formControlName="deliveryPhone" class="input"
                     placeholder="XX XXX XXX">
              @if (f['deliveryPhone'].invalid && f['deliveryPhone'].touched) {
                <p class="text-danger text-xs mt-1">Numéro de téléphone invalide</p>
              }
            </div>

            <!-- Wilaya -->
            <div>
              <label class="block text-text text-sm mb-2">Gouvernorat *</label>
              <select formControlName="deliveryWilaya" class="input">
                <option value="">Choisir un gouvernorat...</option>
                @for (wilaya of wilayas; track wilaya) {
                  <option [value]="wilaya">{{ wilaya }}</option>
                }
              </select>
              @if (f['deliveryWilaya'].invalid && f['deliveryWilaya'].touched) {
                <p class="text-danger text-xs mt-1">Le gouvernorat est obligatoire</p>
              }
            </div>

            <!-- City -->
            <div>
              <label class="block text-text text-sm mb-2">Ville *</label>
              <input type="text" formControlName="deliveryCity" class="input"
                     placeholder="Votre ville">
              @if (f['deliveryCity'].invalid && f['deliveryCity'].touched) {
                <p class="text-danger text-xs mt-1">Ce champ est obligatoire</p>
              }
            </div>

            <!-- Address -->
            <div>
              <label class="block text-text text-sm mb-2">Adresse complète *</label>
              <input type="text" formControlName="deliveryStreet" class="input"
                     placeholder="Rue, numéro, quartier...">
              @if (f['deliveryStreet'].invalid && f['deliveryStreet'].touched) {
                <p class="text-danger text-xs mt-1">L'adresse est obligatoire</p>
              }
            </div>

            <!-- Note -->
            <div>
              <label class="block text-text text-sm mb-2">Note pour le livreur (optionnel)</label>
              <textarea formControlName="note" class="input resize-none" rows="3"
                        placeholder="Instructions particulières..."></textarea>
            </div>

            <button type="submit" [disabled]="checkoutForm.invalid || loading"
                    class="w-full btn-primary py-4 text-base mt-4">
              {{ loading ? 'Traitement...' : 'Confirmer la commande' }}
            </button>
          </form>
        </div>

        <!-- Order Summary (40%) -->
        <div class="lg:col-span-2">
          <div class="card sticky top-20">
            <h2 class="text-text text-xl font-semibold mb-6">Résumé de commande</h2>

            <div class="space-y-4 mb-6">
              @for (item of cartItems; track item.product.id + '-' + item.variant.id) {
                <div class="flex space-x-3">
                  <img [src]="item.product.primaryImageUrl || 'assets/placeholder.jpg'"
                       [alt]="item.product.name"
                       class="w-16 h-16 object-cover rounded">
                  <div class="flex-1">
                    <p class="text-text text-sm font-medium">{{ item.product.name }}</p>
                    <p class="text-muted text-xs">{{ item.variant.volumeMl }}ml × {{ item.quantity }}</p>
                  </div>
                  <p class="text-gold text-sm font-semibold">
                    {{ item.variant.price * item.quantity | number:'1.0-0' }} TND
                  </p>
                </div>
              }
            </div>

            <div class="border-t border-muted/20 pt-4 space-y-2">
              <div class="flex justify-between text-muted text-sm">
                <span>Sous-total</span>
                <span>{{ total | number:'1.0-0' }} TND</span>
              </div>
              <div class="flex justify-between text-muted text-sm">
                <span>Livraison</span>
                <span class="text-success font-semibold">🎁 Gratuite</span>
              </div>
              <div class="flex justify-between text-text font-bold text-lg pt-2">
                <span>Total</span>
                <span class="text-gold">{{ total | number:'1.0-0' }} TND</span>
              </div>
            </div>

            <p class="text-muted text-xs mt-4 text-center">
              💳 Paiement à la livraison — Cash ou virement
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CheckoutComponent implements OnInit {
  checkoutForm!: FormGroup;
  cartItems: CartItem[] = [];
  total = 0;
  loading = false;

  wilayas = [
    'Tunis','Ariana','Ben Arous','Manouba','Nabeul','Zaghouan','Bizerte',
    'Béja','Jendouba','Kef','Siliana','Sousse','Monastir','Mahdia',
    'Sfax','Kairouan','Kasserine','Sidi Bouzid','Gabès','Médenine',
    'Tataouine','Gafsa','Tozeur','Kébili'
  ];

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkoutForm = this.fb.group({
      deliveryFullName: ['', Validators.required],
      deliveryPhone: ['', [Validators.required, Validators.pattern(/^[2-9]\d{7}$/)]],
      deliveryWilaya: ['', Validators.required],
      deliveryCity: ['', Validators.required],
      deliveryStreet: ['', Validators.required],
      note: ['']
    });

    this.cartService.cart$.subscribe(cart => {
      this.cartItems = cart;
      this.total = this.cartService.getTotal();
    });
  }

  get f() { return this.checkoutForm.controls; }

  onSubmit(): void {
    if (this.checkoutForm.invalid || this.cartItems.length === 0) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const orderRequest = {
      ...this.checkoutForm.value,
      items: this.cartItems.map(item => ({
        productVariantId: item.variant.id,
        quantity: item.quantity
      }))
    };

    this.orderService.createOrder(orderRequest).subscribe({
      next: (order) => {
        this.cartService.clearCart();
        this.loading = false;
        this.router.navigate(['/commande-confirmee'], {
          state: { orderId: order.id, orderItems: order.items }
        });
      },
      error: () => { this.loading = false; }
    });
  }
}
