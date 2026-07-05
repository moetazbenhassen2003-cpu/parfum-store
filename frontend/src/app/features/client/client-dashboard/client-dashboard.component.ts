import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';
import { Order } from '../../../core/models/order.model';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-10 max-w-4xl">
      <h1 class="text-4xl font-display text-gold mb-2">Mon Compte</h1>
      @if (currentUser) {
        <p class="text-muted mb-8">Bonjour, <span class="text-text">{{ currentUser.fullName }}</span></p>
      }

      <!-- Orders Section -->
      <h2 class="text-2xl font-display text-text mb-6">Mes Commandes</h2>

      @if (loading) {
        <div class="space-y-4">
          @for (i of [1,2,3]; track i) {
            <div class="animate-pulse card h-20"></div>
          }
        </div>
      } @else if (orders.length === 0) {
        <div class="card text-center py-12">
          <svg class="w-12 h-12 text-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p class="text-muted mb-4">Vous n'avez pas encore de commandes</p>
          <a routerLink="/catalogue" class="btn-primary inline-block">
            Découvrir notre catalogue
          </a>
        </div>
      } @else {
        <div class="space-y-4">
          @for (order of orders; track order.id) {
            <div class="card">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div class="flex items-center gap-3 mb-1">
                    <span class="text-text font-mono text-sm">#{{ order.id }}</span>
                    <span [ngClass]="getStatusClass(order.status)"
                          class="text-xs px-2 py-1 rounded-full font-medium">
                      {{ getStatusLabel(order.status) }}
                    </span>
                  </div>
                  <p class="text-muted text-sm">
                    {{ order.createdAt | date:'dd/MM/yyyy à HH:mm' }}
                  </p>
                  <p class="text-muted text-sm">
                    {{ order.items.length }} article(s)
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-gold font-bold text-xl">
                    {{ order.totalPrice | number:'1.0-0' }} TND
                  </p>
                  <p class="text-muted text-xs">
                    {{ order.deliveryWilaya }}, {{ order.deliveryCity }}
                  </p>
                </div>
              </div>

              <!-- Items preview -->
              <div class="mt-4 pt-4 border-t border-muted/20 flex items-center gap-3 overflow-x-auto">
                @for (item of order.items; track item.id) {
                  <div class="shrink-0 flex items-center gap-2 bg-surface-2 rounded px-3 py-2">
                    <span class="text-text text-xs">{{ item.productName }}</span>
                    <span class="text-muted text-xs">{{ item.volumeMl }}ml × {{ item.quantity }}</span>
                    <span class="text-gold text-xs">{{ item.subtotal | number:'1.0-0' }} TND</span>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class ClientDashboardComponent implements OnInit {
  orders: Order[] = [];
  currentUser: User | null = null;
  loading = true;

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(u => this.currentUser = u);
    this.orderService.getMyOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      EN_ATTENTE: 'En attente',
      CONFIRMEE: 'Confirmée',
      EN_LIVRAISON: 'En livraison',
      LIVREE: 'Livrée',
      ANNULEE: 'Annulée'
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
}
