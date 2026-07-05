import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { OrderService } from '../../../core/services/order.service';
import { ToastService } from '../../../core/services/toast.service';
import { Order } from '../../../core/models/order.model';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-bg p-8 max-w-5xl mx-auto">
      <!-- Back -->
      <a routerLink="/admin/commandes" class="text-muted text-sm hover:text-gold flex items-center gap-1 mb-6">
        ← Retour aux commandes
      </a>

      @if (loading) {
        <div class="animate-pulse space-y-6">
          <div class="card h-24"></div>
          <div class="card h-48"></div>
        </div>
      } @else if (order) {
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 class="text-3xl font-display text-gold">
              Commande #{{ order.id }}
            </h1>
            <p class="text-muted text-sm mt-1">
              {{ order.createdAt | date:'EEEE dd MMMM yyyy à HH:mm' }}
            </p>
          </div>
          <span [ngClass]="getStatusClass(order.status)"
                class="text-sm px-4 py-2 rounded-full font-medium self-start">
            {{ getStatusLabel(order.status) }}
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <!-- Client Info -->
          <div class="card">
            <h2 class="text-text font-semibold mb-4">Informations client</h2>
            <dl class="space-y-2 text-sm">
              <div class="flex gap-3">
                <dt class="text-muted w-28">Nom</dt>
                <dd class="text-text">{{ order.client?.fullName || order.deliveryFullName }}</dd>
              </div>
              @if (order.client?.email) {
                <div class="flex gap-3">
                  <dt class="text-muted w-28">Email</dt>
                  <dd class="text-text">{{ order.client.email }}</dd>
                </div>
              }
              <div class="flex gap-3">
                <dt class="text-muted w-28">Téléphone</dt>
                <dd class="text-text">{{ order.deliveryPhone }}</dd>
              </div>
              @if (!order.client) {
                <div class="flex gap-3">
                  <dt class="text-muted w-28">Type</dt>
                  <dd class="text-[#D4AF37] text-xs font-medium">Commande invité</dd>
                </div>
              }
            </dl>
          </div>

          <!-- Delivery Info -->
          <div class="card">
            <h2 class="text-text font-semibold mb-4">Adresse de livraison</h2>
            <dl class="space-y-2 text-sm">
              <div class="flex gap-3">
                <dt class="text-muted w-28">Destinataire</dt>
                <dd class="text-text">{{ order.deliveryFullName }}</dd>
              </div>
              <div class="flex gap-3">
                <dt class="text-muted w-28">Wilaya</dt>
                <dd class="text-text">{{ order.deliveryWilaya }}</dd>
              </div>
              <div class="flex gap-3">
                <dt class="text-muted w-28">Ville</dt>
                <dd class="text-text">{{ order.deliveryCity }}</dd>
              </div>
              <div class="flex gap-3">
                <dt class="text-muted w-28">Adresse</dt>
                <dd class="text-text">{{ order.deliveryStreet }}</dd>
              </div>
              @if (order.note) {
                <div class="flex gap-3">
                  <dt class="text-muted w-28">Note</dt>
                  <dd class="text-text italic">{{ order.note }}</dd>
                </div>
              }
            </dl>
          </div>
        </div>

        <!-- Order Items -->
        <div class="card mb-6">
          <h2 class="text-text font-semibold mb-4">Articles commandés</h2>
          <div class="space-y-4">
            @for (item of order.items; track item.id) {
              <div class="flex items-center gap-4 bg-surface-2 rounded p-4">
                @if (item.productImageUrl) {
                  <img [src]="getImageUrl(item.productImageUrl)" [alt]="item.productName"
                       class="w-16 h-16 object-cover rounded">
                } @else {
                  <div class="w-16 h-16 bg-surface rounded flex items-center justify-center">
                    <svg class="w-6 h-6 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                }
                <div class="flex-1">
                  <p class="text-text font-medium">{{ item.productName }}</p>
                  <p class="text-muted text-sm">{{ item.productBrand }} — {{ item.volumeMl }}ml</p>
                </div>
                <div class="text-right">
                  <p class="text-muted text-sm">{{ item.unitPrice | number:'1.0-0' }} TND × {{ item.quantity }}</p>
                  <p class="text-gold font-semibold">{{ item.subtotal | number:'1.0-0' }} TND</p>
                </div>
              </div>
            }
          </div>

          <!-- Total -->
          <div class="border-t border-muted/20 mt-4 pt-4 text-right">
            <span class="text-muted mr-4">Total</span>
            <span class="text-gold font-bold text-2xl">{{ order.totalPrice | number:'1.0-0' }} TND</span>
          </div>
        </div>

        <!-- Status Update -->
        <div class="card">
          <h2 class="text-text font-semibold mb-4">Mise à jour du statut</h2>
          <div class="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <div>
              <label class="block text-muted text-sm mb-2">Nouveau statut</label>
              <select [(ngModel)]="newStatus" class="input max-w-xs py-2">
                <option value="EN_ATTENTE">En attente</option>
                <option value="CONFIRMEE">Confirmée</option>
                <option value="EN_LIVRAISON">En livraison</option>
                <option value="LIVREE">Livrée</option>
                <option value="ANNULEE">Annulée</option>
              </select>
            </div>
            <button (click)="updateStatus()" [disabled]="newStatus === order.status || updating"
                    class="btn-primary disabled:opacity-50">
              {{ updating ? 'Mise à jour...' : 'Mettre à jour' }}
            </button>
          </div>

          <!-- Status Flow Guide -->
          <div class="flex items-center gap-2 mt-4 text-xs text-muted overflow-x-auto pb-2">
            @for (step of statusFlow; track step; let last = $last) {
              <span [class.text-gold]="step === order.status"
                    [class.font-semibold]="step === order.status">
                {{ getStatusLabel(step) }}
              </span>
              @if (!last) {
                <span>→</span>
              }
            }
          </div>
        </div>
      } @else {
        <div class="text-center py-16">
          <p class="text-muted">Commande non trouvée</p>
          <a routerLink="/admin/commandes" class="btn-primary inline-block mt-4">
            Retour aux commandes
          </a>
        </div>
      }
    </div>
  `
})
export class OrderDetailComponent implements OnInit {
  order: Order | null = null;
  loading = true;
  updating = false;
  newStatus = '';
  statusFlow = ['EN_ATTENTE', 'CONFIRMEE', 'EN_LIVRAISON', 'LIVREE'];

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.orderService.getOrderById(+id).subscribe({
        next: (order) => {
          this.order = order;
          this.newStatus = order.status;
          this.loading = false;
        },
        error: () => { this.loading = false; }
      });
    }
  }

  updateStatus(): void {
    if (!this.order || this.newStatus === this.order.status) return;
    this.updating = true;
    this.orderService.updateOrderStatus(this.order.id, this.newStatus).subscribe({
      next: (updated) => {
        this.order = updated;
        this.newStatus = updated.status;
        this.updating = false;
        this.toastService.success('Statut mis à jour avec succès');
      },
      error: () => { this.updating = false; }
    });
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      EN_ATTENTE: 'En attente', CONFIRMEE: 'Confirmée',
      EN_LIVRAISON: 'En livraison', LIVREE: 'Livrée', ANNULEE: 'Annulée'
    };
    return map[status] ?? status;
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      EN_ATTENTE: 'bg-yellow-500/20 text-yellow-400',
      CONFIRMEE: 'bg-blue-500/20 text-blue-400',
      EN_LIVRAISON: 'bg-purple-500/20 text-purple-400',
      LIVREE: 'bg-success/20 text-success',
      ANNULEE: 'bg-danger/20 text-danger'
    };
    return map[status] ?? 'bg-surface-2 text-muted';
  }

  getImageUrl(url?: string): string {
    if (!url) return 'assets/placeholder.jpg';
    return url.startsWith('http') ? url : environment.apiUrl + url;
  }
}
