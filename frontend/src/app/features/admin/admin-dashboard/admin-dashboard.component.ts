import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';
import { DashboardStats, Order } from '../../../core/models/order.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-bg">
      <div class="flex">
        <!-- Sidebar -->
        <aside class="w-64 min-h-screen bg-surface border-r border-muted/20 sticky top-0 h-screen overflow-y-auto">
          <div class="p-6">
            <h2 class="text-2xl font-display text-gold mb-8">ADMIN</h2>
            <nav class="space-y-1">
              <a routerLink="/admin" routerLinkActive="bg-gold/10 text-gold"
                 [routerLinkActiveOptions]="{exact:true}"
                 class="flex items-center space-x-3 px-4 py-3 rounded text-text hover:bg-gold/10 hover:text-gold transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
                <span>Dashboard</span>
              </a>
              <a routerLink="/admin/produits" routerLinkActive="bg-gold/10 text-gold"
                 class="flex items-center space-x-3 px-4 py-3 rounded text-text hover:bg-gold/10 hover:text-gold transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
                <span>Produits</span>
              </a>
              <a routerLink="/admin/commandes" routerLinkActive="bg-gold/10 text-gold"
                 class="flex items-center space-x-3 px-4 py-3 rounded text-text hover:bg-gold/10 hover:text-gold transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2"/>
                </svg>
                <span>Commandes</span>
              </a>
              <a routerLink="/admin/changer-mot-de-passe" routerLinkActive="bg-gold/10 text-gold"
                 class="flex items-center space-x-3 px-4 py-3 rounded text-text hover:bg-gold/10 hover:text-gold transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                </svg>
                <span>Mot de passe</span>
              </a>
            </nav>
          </div>
          <div class="absolute bottom-0 w-64 p-6 border-t border-muted/20 space-y-3">
            <a routerLink="/" class="text-muted text-sm hover:text-gold transition-colors flex items-center gap-2">
              ← Voir la boutique
            </a>
            <button (click)="logout()"
                    class="text-danger text-sm hover:text-danger/70 transition-colors flex items-center gap-2 w-full">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              Se déconnecter
            </button>
          </div>
        </aside>

        <!-- Main -->
        <main class="flex-1 p-8">
          <h1 class="text-3xl font-display text-gold mb-8">Tableau de bord</h1>

          <!-- Stats Cards -->
          @if (statsLoading) {
            <div class="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
              @for (i of [1,2,3,4]; track i) {
                <div class="animate-pulse card h-28"></div>
              }
            </div>
          } @else if (stats) {
            <div class="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
              <div class="card border-l-4 border-blue-500">
                <p class="text-muted text-sm">Commandes aujourd'hui</p>
                <p class="text-4xl font-bold text-blue-400 mt-2">{{ stats.todayOrdersCount }}</p>
              </div>
              <div class="card border-l-4 border-gold">
                <p class="text-muted text-sm">Revenus cette semaine</p>
                <p class="text-4xl font-bold text-gold mt-2">
                  {{ stats.weekRevenue | number:'1.0-0' }}<span class="text-lg ml-1">TND</span>
                </p>
              </div>
              <div class="card border-l-4 border-yellow-500">
                <p class="text-muted text-sm">En attente</p>
                <p class="text-4xl font-bold text-yellow-400 mt-2">{{ stats.pendingOrdersCount }}</p>
              </div>
              <div class="card border-l-4 border-danger">
                <p class="text-muted text-sm">Stock faible</p>
                <p class="text-4xl font-bold text-danger mt-2">{{ stats.lowStockProductsCount }}</p>
              </div>
            </div>
          }

          <!-- Recent Orders -->
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-text">Commandes récentes</h2>
            <a routerLink="/admin/commandes" class="text-gold text-sm hover:underline">
              Voir toutes →
            </a>
          </div>

          @if (ordersLoading) {
            <div class="space-y-2">
              @for (i of [1,2,3,4,5]; track i) {
                <div class="animate-pulse bg-surface h-14 rounded"></div>
              }
            </div>
          } @else {
            <div class="bg-surface rounded overflow-hidden">
              <table class="w-full text-sm">
                <thead class="bg-surface-2">
                  <tr>
                    <th class="px-4 py-3 text-left text-muted font-medium">#</th>
                    <th class="px-4 py-3 text-left text-muted font-medium">Client</th>
                    <th class="px-4 py-3 text-left text-muted font-medium hidden md:table-cell">Date</th>
                    <th class="px-4 py-3 text-left text-muted font-medium">Total</th>
                    <th class="px-4 py-3 text-left text-muted font-medium">Statut</th>
                    <th class="px-4 py-3 text-left text-muted font-medium"></th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-muted/10">
                  @for (order of recentOrders; track order.id) {
                    <tr class="hover:bg-surface-2 transition-colors">
                      <td class="px-4 py-3 text-text font-mono text-xs">#{{ order.id }}</td>
                      <td class="px-4 py-3">
                        <p class="text-text">{{ order.client.fullName }}</p>
                        <p class="text-muted text-xs">{{ order.client.phone }}</p>
                      </td>
                      <td class="px-4 py-3 text-muted hidden md:table-cell text-xs">
                        {{ order.createdAt | date:'dd/MM/yy HH:mm' }}
                      </td>
                      <td class="px-4 py-3 text-gold font-semibold">
                        {{ order.totalPrice | number:'1.0-0' }} TND
                      </td>
                      <td class="px-4 py-3">
                        <span [ngClass]="getStatusClass(order.status)"
                              class="text-xs px-2 py-1 rounded-full font-medium">
                          {{ getStatusLabel(order.status) }}
                        </span>
                      </td>
                      <td class="px-4 py-3">
                        <a [routerLink]="['/admin/commandes', order.id]"
                           class="text-gold text-xs hover:underline">Voir</a>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
              @if (recentOrders.length === 0) {
                <div class="text-center py-10 text-muted">Aucune commande</div>
              }
            </div>
          }
        </main>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  recentOrders: Order[] = [];
  statsLoading = true;
  ordersLoading = true;

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.orderService.getDashboardStats().subscribe({
      next: (s) => { this.stats = s; this.statsLoading = false; },
      error: () => { this.statsLoading = false; }
    });

    this.orderService.getAllOrders(undefined, 0, 10).subscribe({
      next: (page) => { this.recentOrders = page.content; this.ordersLoading = false; },
      error: () => { this.ordersLoading = false; }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/acces-securise']);
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
}
