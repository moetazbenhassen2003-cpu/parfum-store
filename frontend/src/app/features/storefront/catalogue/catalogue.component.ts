import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  styles: [`.filter-drawer { transition: max-height 0.35s ease, opacity 0.3s ease; }`],

  template: `
    <div class="min-h-screen bg-gradient-to-br from-[#FDF8F3] via-white to-[#F5F0EA]">
      <div class="container mx-auto px-4 py-8 md:py-10">

        <!-- Header -->
        <div class="mb-6 animate-fade-up">
          <h1 class="text-4xl md:text-6xl font-display text-gradient mb-1">Catalogue</h1>
          <p class="text-[#6B6B6B] text-base md:text-lg">Découvrez notre collection de fragrances d'exception</p>
        </div>

        <!-- Category Tabs -->
        <div class="flex justify-start md:justify-center gap-2 md:gap-4 mb-6 md:mb-10 animate-fade-up overflow-x-auto pb-1 no-scrollbar">
          <button (click)="setCategory('')"
                  [class.bg-[#D4AF37]]="selectedCategory === ''" [class.text-white]="selectedCategory === ''"
                  [class.bg-white]="selectedCategory !== ''" [class.text-[#2C2C2C]]="selectedCategory !== ''"
                  class="shrink-0 px-5 py-2.5 md:px-8 md:py-3 rounded-full text-sm md:text-base font-medium transition-all shadow-sm hover:shadow">
            Tout voir
          </button>
          <button (click)="setCategory('PARFUM')"
                  [class.bg-[#D4AF37]]="selectedCategory === 'PARFUM'" [class.text-white]="selectedCategory === 'PARFUM'"
                  [class.bg-white]="selectedCategory !== 'PARFUM'" [class.text-[#2C2C2C]]="selectedCategory !== 'PARFUM'"
                  class="shrink-0 px-5 py-2.5 md:px-8 md:py-3 rounded-full text-sm md:text-base font-medium transition-all shadow-sm hover:shadow">
            Parfums
          </button>
          <button (click)="setCategory('COSMETIQUE')"
                  [class.bg-[#D4AF37]]="selectedCategory === 'COSMETIQUE'" [class.text-white]="selectedCategory === 'COSMETIQUE'"
                  [class.bg-white]="selectedCategory !== 'COSMETIQUE'" [class.text-[#2C2C2C]]="selectedCategory !== 'COSMETIQUE'"
                  class="shrink-0 px-5 py-2.5 md:px-8 md:py-3 rounded-full text-sm md:text-base font-medium transition-all shadow-sm hover:shadow">
            Cosmétiques
          </button>
        </div>

        <!-- Mobile Filter Toggle -->
        <div class="lg:hidden mb-4">
          <button (click)="filtersOpen = !filtersOpen"
                  class="flex items-center gap-2 w-full bg-white border border-[#D4AF37]/30 rounded-xl px-4 py-3 text-sm font-medium text-[#2C2C2C] shadow-sm">
            <svg class="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
            </svg>
            Filtres &amp; Recherche
            <svg class="w-4 h-4 ml-auto transition-transform duration-300" [class.rotate-180]="filtersOpen" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
        </div>

        <div class="flex flex-col lg:flex-row gap-8">

          <!-- Sidebar Filters -->
          <aside class="w-full lg:w-64 shrink-0">
            <!-- Mobile collapsible / Desktop always visible -->
            <div class="filter-drawer lg:block"
                 [class.hidden]="!filtersOpen"
                 [class.block]="filtersOpen">
              <div class="card space-y-6 lg:sticky lg:top-20 animate-slide-right">
                <h2 class="text-[#D4AF37] font-semibold text-lg hidden lg:flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
                  </svg>
                  Filtres
                </h2>

                <!-- Genre -->
                <div>
                  <h3 class="text-[#2C2C2C] font-medium mb-3 text-sm uppercase tracking-wide">Genre</h3>
                  <div class="grid grid-cols-2 lg:grid-cols-1 gap-2">
                    @for (g of genders; track g.value) {
                      <label class="flex items-center space-x-2 cursor-pointer group">
                        <input type="radio" name="gender" [value]="g.value"
                               [(ngModel)]="selectedGender" (change)="applyFilters()"
                               class="accent-[#D4AF37] w-4 h-4">
                        <span class="text-[#2C2C2C] text-sm group-hover:text-[#D4AF37] transition-colors">{{ g.label }}</span>
                      </label>
                    }
                  </div>
                </div>

                <!-- Price Range -->
                <div>
                  <h3 class="text-[#2C2C2C] font-medium mb-3 text-sm uppercase tracking-wide">Prix (TND)</h3>
                  <div class="flex items-center gap-2">
                    <input type="number" [(ngModel)]="minPrice" (change)="applyFilters()"
                           placeholder="Min" class="input text-sm py-2 w-1/2">
                    <span class="text-[#6B6B6B]">-</span>
                    <input type="number" [(ngModel)]="maxPrice" (change)="applyFilters()"
                           placeholder="Max" class="input text-sm py-2 w-1/2">
                  </div>
                </div>

                <!-- Tags -->
                <div>
                  <h3 class="text-[#2C2C2C] font-medium mb-3 text-sm uppercase tracking-wide">Notes</h3>
                  <div class="grid grid-cols-2 lg:grid-cols-1 gap-2">
                    @for (tag of availableTags; track tag) {
                      <label class="flex items-center space-x-2 cursor-pointer group">
                        <input type="checkbox" [value]="tag"
                               (change)="toggleTag(tag)"
                               [checked]="selectedTags.includes(tag)"
                               class="accent-[#D4AF37] w-4 h-4 rounded">
                        <span class="text-[#2C2C2C] text-sm capitalize group-hover:text-[#D4AF37] transition-colors">{{ tag }}</span>
                      </label>
                    }
                  </div>
                </div>

                <!-- Clear Filters -->
                <button (click)="clearFilters(); filtersOpen = false"
                        class="w-full text-sm text-[#6B6B6B] hover:text-[#D4AF37] transition-colors text-left flex items-center gap-2 pt-2 border-t border-[#D4AF37]/10">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                  Effacer les filtres
                </button>
              </div>
            </div>
          </aside>

          <!-- Product Grid -->
          <div class="flex-1">
            <!-- Search + Count -->
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 animate-fade-up">
              <p class="text-[#6B6B6B] text-sm">
                <span class="text-[#D4AF37] font-semibold text-lg">{{ totalElements }}</span> produit(s) trouvé(s)
              </p>
              <div class="relative max-w-xs w-full">
                <input type="text" [(ngModel)]="searchQuery" (input)="onSearch()"
                       placeholder="Rechercher un parfum..."
                       class="input py-2 pl-10 pr-4">
                <svg class="w-5 h-5 text-[#6B6B6B] absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
            </div>

          <!-- Loading Skeletons -->
          @if (loading) {
            <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              @for (i of [1,2,3,4,5,6,7,8]; track i) {
                <div class="animate-pulse">
                  <div class="bg-[#F8F6F3] aspect-[3/4] rounded-2xl mb-3"></div>
                  <div class="bg-[#F8F6F3] h-4 rounded mb-2 w-3/4"></div>
                  <div class="bg-[#F8F6F3] h-4 rounded w-1/2"></div>
                </div>
              }
            </div>
          }

          <!-- Empty State -->
          @if (!loading && products.length === 0) {
            <div class="text-center py-20 animate-scale-in">
              <div class="w-20 h-20 bg-gradient-to-br from-[#D4AF37]/20 to-[#C19B2E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-10 h-10 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p class="text-[#6B6B6B] text-lg mb-4 font-display">Aucun produit trouvé</p>
              <p class="text-[#6B6B6B]/70 text-sm mb-6">Essayez d'ajuster vos filtres pour voir plus de résultats</p>
              <button (click)="clearFilters()" class="btn-primary">Effacer les filtres</button>
            </div>
          }

          <!-- Products -->
          @if (!loading && products.length > 0) {
            <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              @for (product of products; track product.id; let i = $index) {
                <a [routerLink]="['/produit', product.id]"
                   class="product-card group block cursor-pointer animate-fade-up"
                   [style.animation-delay]="(i * 0.05) + 's'">
                  <div class="relative aspect-[3/4] bg-[#F8F6F3] rounded-2xl overflow-hidden mb-3 shadow-md hover:shadow-2xl transition-all duration-500">
                    <img
                      [src]="product.primaryImageUrl || 'assets/placeholder.jpg'"
                      [alt]="product.name"
                      class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                    <!-- Gender Badge -->
                    <span class="absolute top-2 left-2 text-xs px-2.5 py-1 rounded-full backdrop-blur-md font-medium"
                          [ngClass]="{
                            'bg-blue-500/70 text-white border border-blue-300/30': product.gender === 'HOMME',
                            'bg-pink-500/70 text-white border border-pink-300/30': product.gender === 'FEMME',
                            'bg-purple-500/70 text-white border border-purple-300/30': product.gender === 'MIXTE'
                          }">
                      {{ product.gender }}
                    </span>
                    <!-- Glass Hover Overlay -->
                    <div class="absolute inset-0 glass opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span class="bg-gradient-to-r from-[#D4AF37] to-[#C19B2E] text-white text-sm font-medium px-6 py-2.5 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                        Voir le produit
                      </span>
                    </div>
                  </div>
                  <p class="text-[#D4AF37] text-xs uppercase tracking-wider font-medium">{{ product.brand }}</p>
                  <h3 class="text-[#2C2C2C] font-medium truncate group-hover:text-[#D4AF37] transition-colors">{{ product.name }}</h3>
                  <p class="text-[#D4AF37] text-sm font-semibold mt-1">
                    À partir de {{ product.minPrice | number:'1.0-0' }} TND
                  </p>
                </a>
              }
            </div>

            <!-- Pagination -->
            @if (totalPages > 1) {
              <div class="flex items-center justify-center space-x-2 mt-12">
                <button (click)="changePage(currentPage - 1)"
                        [disabled]="currentPage === 0"
                        class="px-4 py-2 bg-surface text-text rounded disabled:opacity-30 hover:bg-surface-2 transition-colors">
                  ‹
                </button>
                @for (p of getPages(); track p) {
                  <button (click)="changePage(p)"
                          [class.bg-gold]="p === currentPage"
                          [class.text-bg]="p === currentPage"
                          [class.bg-surface]="p !== currentPage"
                          [class.text-text]="p !== currentPage"
                          class="px-4 py-2 rounded hover:bg-gold hover:text-bg transition-colors">
                    {{ p + 1 }}
                  </button>
                }
                <button (click)="changePage(currentPage + 1)"
                        [disabled]="currentPage === totalPages - 1"
                        class="px-4 py-2 bg-surface text-text rounded disabled:opacity-30 hover:bg-surface-2 transition-colors">
                  ›
                </button>
              </div>
            }
          }
        </div>
      </div>
    </div>
  `
})
export class CatalogueComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  pageSize = 12;
  filtersOpen = false;

  selectedGender = '';
  selectedCategory = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  selectedTags: string[] = [];
  searchQuery = '';
  searchTimeout: any;

  genders = [
    { value: '', label: 'Tous' },
    { value: 'HOMME', label: 'Homme' },
    { value: 'FEMME', label: 'Femme' },
    { value: 'MIXTE', label: 'Mixte' }
  ];

  availableTags = ['oud', 'floral', 'oriental', 'fresh', 'boisé', 'épicé', 'citrus', 'musc'];

  constructor(private productService: ProductService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['gender']) this.selectedGender = params['gender'];
      if (params['search']) this.searchQuery = params['search'];
      this.loadProducts();
    });
  }

  setCategory(category: string): void {
    this.selectedCategory = category;
    this.currentPage = 0;
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    const params: any = {
      page: this.currentPage,
      size: this.pageSize
    };
    if (this.selectedGender) params['gender'] = this.selectedGender;
    if (this.selectedCategory) params['category'] = this.selectedCategory;
    if (this.minPrice) params['minPrice'] = this.minPrice;
    if (this.maxPrice) params['maxPrice'] = this.maxPrice;

    const obs = this.searchQuery.trim().length > 1
      ? this.productService.searchProducts(this.searchQuery, this.currentPage, this.pageSize)
      : this.productService.getProducts(params);

    obs.subscribe({
      next: (page) => {
        this.products = page.content;
        this.totalElements = page.totalElements;
        this.totalPages = page.totalPages;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  applyFilters(): void {
    this.currentPage = 0;
    this.loadProducts();
  }

  onSearch(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.currentPage = 0;
      this.loadProducts();
    }, 400);
  }

  toggleTag(tag: string): void {
    const idx = this.selectedTags.indexOf(tag);
    if (idx > -1) this.selectedTags.splice(idx, 1);
    else this.selectedTags.push(tag);
    this.applyFilters();
  }

  clearFilters(): void {
    this.selectedGender = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.selectedTags = [];
    this.searchQuery = '';
    this.currentPage = 0;
    this.loadProducts();
  }

  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadProducts();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getPages(): number[] {
    const start = Math.max(0, this.currentPage - 2);
    const end = Math.min(this.totalPages, start + 5);
    return Array.from({ length: end - start }, (_, i) => start + i);
  }
}
