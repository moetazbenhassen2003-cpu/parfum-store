import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { ToastService } from '../../../core/services/toast.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
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
              <a routerLink="/admin/produits" routerLinkActive="bg-gold/10 text-gold"
                 class="flex items-center space-x-3 px-4 py-3 rounded text-text hover:bg-gold/10 hover:text-gold transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                <span>Produits</span>
              </a>
              <a routerLink="/admin/commandes" class="flex items-center space-x-3 px-4 py-3 rounded text-text hover:bg-gold/10 hover:text-gold transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2"/></svg>
                <span>Commandes</span>
              </a>
            </nav>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 p-8">
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <h1 class="text-3xl font-display text-gold">Produits</h1>
            <a routerLink="/admin/produits/nouveau" class="btn-primary">
              + Nouveau produit
            </a>
          </div>

          <!-- Search & Filter -->
          <div class="flex flex-col sm:flex-row gap-4 mb-6">
            <input type="text" [(ngModel)]="searchQuery" (input)="onSearch()"
                   placeholder="Rechercher un produit..."
                   class="input max-w-sm py-2">
            <div class="flex gap-2">
              <button (click)="filterPublished = null; loadProducts()"
                      [class.bg-gold]="filterPublished === null"
                      [class.text-bg]="filterPublished === null"
                      [class.bg-surface]="filterPublished !== null"
                      class="px-4 py-2 rounded text-sm transition-colors">
                Tous
              </button>
              <button (click)="filterPublished = true; loadProducts()"
                      [class.bg-gold]="filterPublished === true"
                      [class.text-bg]="filterPublished === true"
                      [class.bg-surface]="filterPublished !== true"
                      class="px-4 py-2 rounded text-sm transition-colors">
                Publiés
              </button>
              <button (click)="filterPublished = false; loadProducts()"
                      [class.bg-gold]="filterPublished === false"
                      [class.text-bg]="filterPublished === false"
                      [class.bg-surface]="filterPublished !== false"
                      class="px-4 py-2 rounded text-sm transition-colors">
                Cachés
              </button>
            </div>
          </div>

          <!-- Table -->
          <div class="bg-surface rounded overflow-hidden">
            <table class="w-full text-sm">
              <thead class="bg-surface-2">
                <tr>
                  <th class="px-4 py-3 text-left text-muted font-medium">Produit</th>
                  <th class="px-4 py-3 text-left text-muted font-medium hidden md:table-cell">Marque</th>
                  <th class="px-4 py-3 text-left text-muted font-medium hidden lg:table-cell">Genre</th>
                  <th class="px-4 py-3 text-left text-muted font-medium">Stock</th>
                  <th class="px-4 py-3 text-left text-muted font-medium">Statut</th>
                  <th class="px-4 py-3 text-left text-muted font-medium">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-muted/10">
                @if (loading) {
                  @for (i of [1,2,3,4,5]; track i) {
                    <tr>
                      @for (j of [1,2,3,4,5,6]; track j) {
                        <td class="px-4 py-3">
                          <div class="animate-pulse bg-surface-2 h-4 rounded"></div>
                        </td>
                      }
                    </tr>
                  }
                } @else {
                  @for (product of products; track product.id) {
                    <tr class="hover:bg-surface-2 transition-colors">
                      <td class="px-4 py-3">
                        <div class="flex items-center gap-3">
                          <img [src]="product.primaryImageUrl || 'assets/placeholder.jpg'"
                               [alt]="product.name"
                               class="w-10 h-10 object-cover rounded">
                          <span class="text-text font-medium">{{ product.name }}</span>
                        </div>
                      </td>
                      <td class="px-4 py-3 text-muted hidden md:table-cell">{{ product.brand }}</td>
                      <td class="px-4 py-3 hidden lg:table-cell">
                        <span class="text-xs px-2 py-1 rounded bg-surface-2 text-muted">
                          {{ product.gender }}
                        </span>
                      </td>
                      <td class="px-4 py-3">
                        <span [class.text-danger]="getTotalStock(product) < 10"
                              [class.text-success]="getTotalStock(product) >= 10"
                              class="text-sm font-medium">
                          {{ getTotalStock(product) }}
                        </span>
                      </td>
                      <td class="px-4 py-3">
                        <button (click)="togglePublished(product)"
                                [class.bg-success]="product.isPublished"
                                [class.bg-muted]="!product.isPublished"
                                class="relative w-10 h-5 rounded-full transition-colors duration-300">
                          <span [class.translate-x-5]="product.isPublished"
                                [class.translate-x-0]="!product.isPublished"
                                class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300">
                          </span>
                        </button>
                      </td>
                      <td class="px-4 py-3">
                        <div class="flex items-center gap-2">
                          <a [routerLink]="['/admin/produits', product.id, 'edit']"
                             class="text-gold text-xs hover:underline">Modifier</a>
                          <button (click)="confirmDelete(product)"
                                  class="text-danger text-xs hover:underline">
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  }
                }
              </tbody>
            </table>
            @if (!loading && products.length === 0) {
              <div class="text-center py-10 text-muted">Aucun produit trouvé</div>
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

    <!-- Delete Confirm Modal -->
    @if (productToDelete) {
      <div class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
        <div class="bg-surface rounded p-8 max-w-md w-full">
          <h3 class="text-text text-xl font-semibold mb-4">Confirmer la suppression</h3>
          <p class="text-muted mb-6">
            Êtes-vous sûr de vouloir supprimer 
            <strong class="text-text">"{{ productToDelete.name }}"</strong> ?
            Cette action est irréversible.
          </p>
          <div class="flex gap-4">
            <button (click)="deleteProduct()" class="flex-1 bg-danger text-white py-2 rounded hover:opacity-90">
              Supprimer
            </button>
            <button (click)="productToDelete = null" class="flex-1 btn-secondary">
              Annuler
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  totalPages = 0;
  currentPage = 0;
  searchQuery = '';
  filterPublished: boolean | null = null;
  productToDelete: Product | null = null;
  searchTimeout: any;

  constructor(
    private productService: ProductService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAllProducts(this.currentPage, 20).subscribe({
      next: (page) => {
        let items = page.content;
        if (this.searchQuery) {
          items = items.filter(p =>
            p.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(this.searchQuery.toLowerCase())
          );
        }
        if (this.filterPublished !== null) {
          items = items.filter(p => p.isPublished === this.filterPublished);
        }
        this.products = items;
        this.totalPages = page.totalPages;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  onSearch(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => this.loadProducts(), 350);
  }

  togglePublished(product: Product): void {
    this.productService.togglePublished(product.id).subscribe({
      next: () => {
        product.isPublished = !product.isPublished;
        this.toastService.success('Statut mis à jour');
      }
    });
  }

  getTotalStock(product: Product): number {
    return product.variants.reduce((s, v) => s + v.stockQuantity, 0);
  }

  confirmDelete(product: Product): void {
    this.productToDelete = product;
  }

  deleteProduct(): void {
    if (!this.productToDelete) return;
    this.productService.deleteProduct(this.productToDelete.id).subscribe({
      next: () => {
        this.toastService.success('Produit supprimé');
        this.products = this.products.filter(p => p.id !== this.productToDelete!.id);
        this.productToDelete = null;
      }
    });
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.loadProducts();
  }
}
