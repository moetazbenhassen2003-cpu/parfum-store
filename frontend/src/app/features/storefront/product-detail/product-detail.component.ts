import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { ToastService } from '../../../core/services/toast.service';
import { Product, ProductVariant } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    @if (loading) {
      <div class="container mx-auto px-4 py-10">
        <div class="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-12">
          <div class="bg-surface-2 aspect-square rounded"></div>
          <div class="space-y-4">
            <div class="bg-surface-2 h-6 rounded w-1/3"></div>
            <div class="bg-surface-2 h-10 rounded w-2/3"></div>
            <div class="bg-surface-2 h-24 rounded"></div>
          </div>
        </div>
      </div>
    }

    @if (!loading && product) {
      <div class="container mx-auto px-4 py-6 md:py-10">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">

          <!-- Image Gallery -->
          <div>
            <!-- Main Image -->
            <div class="aspect-square bg-surface-2 rounded overflow-hidden mb-4">
              <img [src]="activeImage?.imageUrl || product.primaryImageUrl || 'assets/placeholder.jpg'"
                   [alt]="product.name"
                   class="w-full h-full object-cover">
            </div>
            <!-- Thumbnails -->
            @if (product.images.length > 1) {
              <div class="flex space-x-3 overflow-x-auto pb-2">
                @for (img of product.images; track img.id) {
                  <button (click)="activeImage = img"
                          [class.border-gold]="activeImage?.id === img.id"
                          [class.border-muted]="activeImage?.id !== img.id"
                          class="shrink-0 w-20 h-20 border-2 rounded overflow-hidden transition-colors">
                    <img [src]="img.imageUrl" class="w-full h-full object-cover">
                  </button>
                }
              </div>
            }
          </div>

          <!-- Product Info -->
          <div class="flex flex-col justify-start space-y-6">
            <!-- Brand + Share -->
            <div class="flex items-center justify-between">
              <span class="text-gold text-sm uppercase tracking-widest font-medium">
                {{ product.brand }}
              </span>
              <!-- Gender Badge -->
              <span class="text-xs px-3 py-1 rounded"
                    [ngClass]="{
                      'bg-blue-500/20 text-blue-400': product.gender === 'HOMME',
                      'bg-pink-500/20 text-pink-400': product.gender === 'FEMME',
                      'bg-purple-500/20 text-purple-400': product.gender === 'MIXTE'
                    }">
                {{ product.gender }}
              </span>
            </div>

            <!-- Name -->
            <h1 class="text-3xl sm:text-4xl md:text-5xl font-display text-text leading-tight">
              {{ product.name }}
            </h1>

            <!-- Description -->
            <p class="text-muted leading-relaxed">{{ product.description }}</p>

            <!-- Tags -->
            @if (product.tags.length > 0) {
              <div class="flex flex-wrap gap-2">
                @for (tag of product.tags; track tag) {
                  <span class="text-xs px-3 py-1 bg-surface-2 text-muted rounded-full capitalize">
                    {{ tag }}
                  </span>
                }
              </div>
            }

            <!-- Variant Selector -->
            @if (product.variants.length > 0) {
              <div>
                <p class="text-text text-sm font-medium mb-3">Contenance</p>
                <div class="flex flex-wrap gap-3">
                  @for (variant of product.variants; track variant.id) {
                    <button
                      (click)="selectVariant(variant)"
                      [disabled]="variant.stockQuantity === 0"
                      [class.border-gold]="selectedVariant?.id === variant.id"
                      [class.text-gold]="selectedVariant?.id === variant.id"
                      [class.border-muted]="selectedVariant?.id !== variant.id"
                      [class.text-muted]="selectedVariant?.id !== variant.id"
                      [class.opacity-40]="variant.stockQuantity === 0"
                      class="px-5 py-2 border rounded text-sm transition-all duration-200 hover:border-gold hover:text-gold disabled:cursor-not-allowed">
                      {{ variant.volumeMl }} ml
                    </button>
                  }
                </div>
              </div>
            }

            <!-- Price -->
            @if (selectedVariant) {
              <div class="flex items-end gap-4">
                <span class="text-5xl font-display text-gold">
                  {{ selectedVariant.price | number:'1.0-0' }}
                </span>
                <span class="text-gold text-xl mb-1">TND</span>
              </div>

              <!-- Stock Badge -->
              <div>
                @if (selectedVariant.stockQuantity > 10) {
                  <span class="text-success text-sm flex items-center gap-2">
                    <span class="w-2 h-2 bg-success rounded-full inline-block"></span>
                    En stock
                  </span>
                } @else if (selectedVariant.stockQuantity > 0) {
                  <span class="text-yellow-400 text-sm flex items-center gap-2">
                    <span class="w-2 h-2 bg-yellow-400 rounded-full inline-block"></span>
                    Stock limité ({{ selectedVariant.stockQuantity }} restants)
                  </span>
                } @else {
                  <span class="text-danger text-sm flex items-center gap-2">
                    <span class="w-2 h-2 bg-danger rounded-full inline-block"></span>
                    Épuisé
                  </span>
                }
              </div>
            }

            <!-- Add to Cart -->
            <button
              (click)="addToCart()"
              [disabled]="!selectedVariant || selectedVariant.stockQuantity === 0 || addedToCart"
              class="w-full py-4 font-medium text-base transition-all duration-300 rounded"
              [ngClass]="{
                'bg-gold hover:bg-gold-hover text-bg': !addedToCart && selectedVariant && selectedVariant.stockQuantity > 0,
                'bg-success text-white': addedToCart,
                'bg-surface-2 text-muted cursor-not-allowed': !selectedVariant || selectedVariant.stockQuantity === 0
              }">
              @if (addedToCart) {
                ✓ Ajouté au panier
              } @else {
                Ajouter au panier
              }
            </button>
          </div>
        </div>

        <!-- Related Products -->
        @if (relatedProducts.length > 0) {
          <div class="mt-20">
            <h2 class="text-3xl font-display text-gold mb-8">Vous aimerez aussi</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
              @for (p of relatedProducts; track p.id) {
                <a [routerLink]="['/produit', p.id]" class="group block">
                  <div class="aspect-[3/4] bg-surface-2 rounded overflow-hidden mb-3">
                    <img [src]="p.primaryImageUrl || 'assets/placeholder.jpg'"
                         [alt]="p.name"
                         class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                  </div>
                  <p class="text-muted text-xs uppercase tracking-wider">{{ p.brand }}</p>
                  <h3 class="text-text text-sm font-medium truncate">{{ p.name }}</h3>
                  <p class="text-gold text-sm mt-1">{{ p.minPrice | number:'1.0-0' }} TND</p>
                </a>
              }
            </div>
          </div>
        }
      </div>
    }

    @if (!loading && !product) {
      <div class="container mx-auto px-4 py-16 text-center">
        <p class="text-muted text-xl">Produit non trouvé</p>
        <a routerLink="/catalogue" class="btn-primary inline-block mt-6">
          Retour au catalogue
        </a>
      </div>
    }
  `
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  relatedProducts: Product[] = [];
  selectedVariant: ProductVariant | null = null;
  activeImage: any = null;
  loading = true;
  addedToCart = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.loading = true;
      this.product = null;
      this.productService.getProductById(+params['id']).subscribe({
        next: (product) => {
          this.product = product;
          this.selectedVariant = product.variants[0] || null;
          this.activeImage = product.images.find(i => i.isPrimary) || product.images[0] || null;
          this.loading = false;
          this.loadRelated(product);
        },
        error: () => { this.loading = false; }
      });
    });
  }

  selectVariant(variant: ProductVariant): void {
    if (variant.stockQuantity > 0) {
      this.selectedVariant = variant;
    }
  }

  addToCart(): void {
    if (!this.product || !this.selectedVariant) return;
    this.cartService.addItem(this.product, this.selectedVariant, 1);
    this.toastService.success('Produit ajouté au panier');
    this.addedToCart = true;
    window.dispatchEvent(new CustomEvent('toggle-cart'));
    setTimeout(() => { this.addedToCart = false; }, 3000);
  }

  private loadRelated(product: Product): void {
    this.productService.getProducts({ page: 0, size: 8 }).subscribe({
      next: (page) => {
        this.relatedProducts = page.content
          .filter(p => p.id !== product.id && (p.brand === product.brand || p.gender === product.gender))
          .slice(0, 4);
      }
    });
  }
}
