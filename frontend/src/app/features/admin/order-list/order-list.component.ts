import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.model';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-bg">
      <div class="flex">
        <!-- Sidebar -->
        <aside class="w-64 min-h-screen bg-surface border-r border-muted/20 sticky top-0 h-screen">
          <div class="p-6">
            <h2 class="text-2xl font-display text-gold mb-8">ADMIN</h2>
            <nav class="space-y-1">
              <a routerLink="/admin" class="flex items-center space-x-3 px-4 py-3 rounded text-text hover:bg-gold/10 hover:text-gold transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                <span>Dashboard</span>
              </a>
              <a routerLink="/admin/produits" class="flex items-center space-x-3 px-4 py-3 rounded text-text hover:bg-gold/10 hover:text-gold transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                <span>Produits</span>
              </a>
              <a routerLink="/admin/commandes" routerLinkActive="bg-gold/10 text-gold"
                 class="flex items-center space-x-3 px-4 py-3 rounded text-text hover:bg-gold/10 hover:text-gold transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2"/></svg>
                <span>Commandes</span>
              </a>
            </nav>
          </div>
        </aside>

        <main class="flex-1 p-8">
          <h1 class="text-3xl font-display text-gold mb-6">Commandes</h1>

          <!-- Status Tabs -->
          <div class="flex flex-wrap gap-2 mb-6">
            @for (tab of statusTabs; track tab.value) {
              <button (click)="selectStatus(tab.value)"
                      [class.bg-gold]="selectedStatus === tab.value"
                      [class.text-bg]="selectedStatus === tab.value"
                      [class.bg-surface]="selectedStatus !== tab.value"
                      [class.text-text]="selectedStatus !== tab.value"
                      class="px-4 py-2 rounded text-sm transition-colors">
                {{ tab.label }}
              </button>
            }
          </div>

          <!-- Table -->
          <div class="bg-surface rounded overflow-hidden">
            <table class="w-full text-sm">
              <thead class="bg-surface-2">
                <tr>
                  <th class="px-4 py-3 text-left text-muted font-medium">Commande</th>
                  <th class="px-4 py-3 text-left text-muted font-medium">Client</th>
                  <th class="px-4 py-3 text-left text-muted font-medium hidden md:table-cell">Date</th>
                  <th class="px-4 py-3 text-left text-muted font-medium">Total</th>
                  <th class="px-4 py-3 text-left text-muted font-medium">Statut</th>
                  <th class="px-4 py-3 text-left text-muted font-medium">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-muted/10">
                @if (loading) {
                  @for (i of [1,2,3,4,5]; track i) {
                    <tr>
                      @for (j of [1,2,3,4,5,6]; track j) {
                        <td class="px-4 py-4">
                          <div class="animate-pulse bg-surface-2 h-4 rounded"></div>
                        </td>
                      }
                    </tr>
                  }
                } @else {
                  @for (order of orders; track order.id) {
                    <tr class="hover:bg-surface-2 transition-colors cursor-pointer"
                        (click)="goToDetail(order.id)">
                      <td class="px-4 py-3 text-text font-mono text-xs">#{{ order.id }}</td>
                      <td class="px-4 py-3">
                        <p class="text-text">{{ order.client?.fullName || order.deliveryFullName }}</p>
                        <p class="text-muted text-xs">{{ order.deliveryPhone }}</p>
                      </td>
                      <td class="px-4 py-3 text-muted text-xs hidden md:table-cell">
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
                           (click)="$event.stopPropagation()"
                           class="text-gold text-xs hover:underline">
                          Voir →
                        </a>
                      </td>
                    </tr>
                  }
                }
              </tbody>
            </table>
            @if (!loading && orders.length === 0) {
              <div class="text-center py-10 text-muted">Aucune commande trouvée</div>
            }
          </div>

          <!-- Pagination -->
          @if (totalPages > 1) {
            <div class="flex justify-center gap-2 mt-6">
              <button (click)="changePage(currentPage - 1)" [disabled]="currentPage === 0"
                      class="px-4 py-2 bg-surface rounded disabled:opacity-30">‹</button>
              <span class="px-4 py-2 text-muted text-sm">{{ currentPage + 1 }} / {{ totalPages }}</span>
              <button (click)="changePage(currentPage + 1)" [disabled]="currentPage === totalPages - 1"
                      class="px-4 py-2 bg-surface rounded disabled:opacity-30">›</button>
            </div>
          }
        </main>
      </div>
    </div>
  `
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  loading = false;
  totalPages = 0;
  currentPage = 0;
  selectedStatus = '';

  statusTabs = [
    { value: '', label: 'Toutes' },
    { value: 'EN_ATTENTE', label: 'En attente' },
    { value: 'CONFIRMEE', label: 'Confirmée' },
    { value: 'EN_LIVRAISON', label: 'En livraison' },
    { value: 'LIVREE', label: 'Livrée' },
    { value: 'ANNULEE', label: 'Annulée' }
  ];

  constructor(
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    const status = this.selectedStatus || undefined;
    this.orderService.getAllOrders(status, this.currentPage, 20).subscribe({
      next: (page) => {
        this.orders = page.content;
        this.totalPages = page.totalPages;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  selectStatus(status: string): void {
    this.selectedStatus = status;
    this.currentPage = 0;
    this.loadOrders();
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.loadOrders();
  }

  goToDetail(id: number): void {
    this.router.navigate(['/admin/commandes', id]);
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
