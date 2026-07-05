import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styles: [`
    @keyframes heroReveal {
      from { opacity:0; transform:translateY(30px); }
      to   { opacity:1; transform:translateY(0); }
    }
    .hero-title  { animation: heroReveal .8s ease both; }
    .hero-sub    { animation: heroReveal .8s .2s ease both; }
    .hero-cta    { animation: heroReveal .8s .4s ease both; }
    .hero-scroll { animation: heroReveal .8s .6s ease both; }

    @keyframes kenBurns {
      0%   { transform: scale(1) translate(0, 0); }
      50%  { transform: scale(1.03) translate(-10px, 10px); }
      100% { transform: scale(1.06) translate(10px, -10px); }
    }
    .hero-bg { animation: kenBurns 20s ease-in-out infinite alternate; }
    
    @keyframes floating {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-15px); }
      100% { transform: translateY(0px); }
    }
    .animate-float-slow { animation: floating 6s ease-in-out infinite; }
    
    @keyframes shimmer {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    .shimmer-text {
      background: linear-gradient(120deg, #2C2C2C 20%, #D4AF37 50%, #2C2C2C 80%);
      background-size: 200% auto;
      color: transparent;
      -webkit-background-clip: text;
      animation: shimmer 4s linear infinite;
    }

    /* Crossfade slide */
    .slide-img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      transition: opacity 1.2s ease-in-out;
    }
    .slide-img.active {
      opacity: 1;
    }

    /* Dots */
    .slide-dot {
      width: 6px;
      height: 6px;
      border-radius: 9999px;
      background: rgba(255,255,255,0.5);
      transition: all 0.3s;
      cursor: pointer;
    }
    .slide-dot.active {
      background: #D4AF37;
      width: 18px;
    }
  `],
  template: `
    <!-- ══ HERO ══ -->
    <section class="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-bg via-surface to-surface-2">
      <div class="hero-bg absolute inset-0 bg-cover bg-center opacity-40"
           style="background-image:url('https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1920&q=80')">
      </div>
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.08)_0%,transparent_50%)]"></div>
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(212,175,55,0.06)_0%,transparent_50%)]"></div>

      <div class="relative z-10 text-center px-4 max-w-4xl">
        <p class="hero-sub text-[#D4AF37] text-sm uppercase tracking-[0.4em] mb-6 font-medium">
          Collection Exclusive 2026
        </p>
        <h1 class="hero-title text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-display text-text leading-none mb-6">
          L'Art du<br>
          <span class="text-gradient italic">Parfum</span>
        </h1>
        <p class="hero-sub text-muted text-lg md:text-xl mb-10 font-light max-w-xl mx-auto leading-relaxed">
          Des fragrances d'exception pour les esprits raffinés.<br>
          Livraison dans toute la Tunisie.
        </p>
        <div class="hero-cta flex flex-col sm:flex-row gap-4 justify-center">
          <a routerLink="/catalogue" class="btn-primary text-base sm:text-lg px-7 py-3 sm:px-10 sm:py-4 shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] hover:-translate-y-1 transition-all duration-300">
            Découvrir la collection
          </a>
          <a routerLink="/catalogue" class="btn-secondary text-base sm:text-lg px-7 py-3 sm:px-10 sm:py-4 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300">
            Voir les nouveautés
          </a>
        </div>
      </div>

      <div class="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-float">
        <span class="text-muted text-xs uppercase tracking-widest">Défiler</span>
        <div class="w-px h-10 bg-gradient-to-b from-[#D4AF37] to-transparent animate-pulse"></div>
      </div>
    </section>

    <!-- ══ À PROPOS DE NOUS ══ -->
    <section class="py-24 bg-surface-2 relative overflow-hidden">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(212,175,55,0.05)_0%,transparent_50%)]"></div>
      <div class="container mx-auto px-4 relative z-10">
        <div class="flex flex-col lg:flex-row items-center gap-16">
          <div class="w-full lg:w-1/2 relative animate-fade-up">
            <div class="absolute -inset-4 border border-[#D4AF37]/30 rounded-2xl transform translate-x-4 translate-y-4"></div>
            <img src="https://images.pexels.com/photos/1961795/pexels-photo-1961795.jpeg?auto=compress&cs=tinysrgb&w=800" alt="À propos de notre parfumerie" class="relative z-10 w-full h-[500px] object-cover rounded-2xl shadow-2xl">
          </div>
          <div class="w-full lg:w-1/2 animate-fade-up" style="animation-delay: 0.2s">
            <p class="text-[#D4AF37] text-xs uppercase tracking-widest mb-4 font-medium">À Propos de Nous</p>
            <h2 class="text-4xl md:text-5xl font-display text-text mb-6 leading-tight">L'Élégance à l'État Pur, <br>Capturée en Flacon.</h2>
            <p class="text-muted leading-relaxed text-lg mb-6">
              Nés d'une passion inébranlable pour l'art de la parfumerie, nous sélectionnons pour vous les fragrances les plus raffinées. Chaque goutte raconte une histoire, un voyage olfactif entre l'Orient et l'Occident.
            </p>
            <p class="text-muted leading-relaxed text-lg mb-8">
              Notre mission est de vous offrir des parfums d'exception, alliant qualité premium et longue tenue, pour sublimer votre présence au quotidien. Laissez votre sillage parler pour vous.
            </p>
            <a routerLink="/catalogue" class="inline-flex items-center gap-2 text-[#D4AF37] font-semibold hover:gap-4 transition-all duration-300">
              Découvrir notre collection <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ FEATURED STRIP ══ -->
    <section class="py-20 bg-surface">
      <div class="container mx-auto px-4">
        <div class="flex items-end justify-between mb-10 animate-fade-up">
          <div>
            <p class="text-[#D4AF37] text-xs uppercase tracking-widest mb-2 font-medium">Sélection</p>
            <h2 class="text-4xl md:text-5xl font-display text-text">Nos Bestsellers</h2>
          </div>
          <a routerLink="/catalogue" class="text-[#D4AF37] text-sm hover:underline hidden md:block transition-all hover:translate-x-1">
            Voir tout →
          </a>
        </div>

        @if (loadingFeatured) {
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            @for (i of [1,2,3,4]; track i) {
              <div class="aspect-[3/4] skeleton rounded-xl"></div>
            }
          </div>
        } @else if (featuredProducts.length > 0) {
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            @for (p of featuredProducts; track p.id; let i = $index) {
              <a [routerLink]="['/produit', p.id]"
                 class="product-card group block"
                 [style.animation-delay]="(i * 0.08) + 's'"
                 [class.animate-fade-up]="productsVisible">
                <div class="relative aspect-[3/4] bg-surface-2 rounded-2xl overflow-hidden mb-4 shadow-lg hover:shadow-2xl transition-shadow duration-500">
                  @if (p.primaryImageUrl) {
                    <img [src]="p.primaryImageUrl" [alt]="p.name"
                         class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                  } @else {
                    <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface to-surface-2">
                      <svg class="w-12 h-12 text-muted/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01"/>
                      </svg>
                    </div>
                  }
                  <div class="absolute inset-0 glass opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6">
                    <span class="bg-gradient-to-r from-[#D4AF37] to-[#C19B2E] text-white text-sm font-semibold px-6 py-2.5 rounded-full
                                 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg">
                      Voir le produit
                    </span>
                  </div>
                  <span class="absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full font-medium backdrop-blur-md"
                        [ngClass]="{
                          'bg-blue-500/70 text-white': p.gender==='HOMME',
                          'bg-pink-500/70 text-white': p.gender==='FEMME',
                          'bg-purple-500/70 text-white': p.gender==='MIXTE'
                        }">
                    {{ p.gender }}
                  </span>
                </div>
                <p class="text-[#D4AF37] text-xs uppercase tracking-widest font-medium">{{ p.brand }}</p>
                <h3 class="text-text font-display text-xl mt-1 leading-tight group-hover:text-[#D4AF37] transition-colors">{{ p.name }}</h3>
                <p class="text-[#D4AF37] text-sm mt-1 font-semibold">
                  À partir de {{ p.minPrice | number:'1.0-0' }} TND
                </p>
              </a>
            }
          </div>
        }
      </div>
    </section>

    <!-- ══ BRAND MANIFESTO ══ -->
    <section class="py-24 relative overflow-hidden bg-gradient-to-br from-bg via-surface to-surface-2">
      <div class="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent"></div>
      <div class="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent"></div>
      <div class="relative container mx-auto px-4 max-w-3xl text-center animate-scale-in">
        <div class="text-[#D4AF37]/30 text-8xl font-display leading-none mb-4">"</div>
        <p class="text-3xl md:text-4xl font-display text-gradient italic leading-relaxed mb-6">
          Le parfum est la forme la plus intense de la mémoire.
        </p>
        <p class="text-muted leading-relaxed text-lg">
          Chaque fragrance de notre collection raconte une histoire unique.
          Du cuir précieux à la rose de Damas, découvrez l'art de la parfumerie
          orientale et occidentale réunis en un seul endroit.
        </p>
        <div class="mt-10 flex items-center justify-center gap-4">
          <div class="w-16 h-px bg-[#D4AF37]/40"></div>
          <span class="text-[#D4AF37] text-2xl font-display">✦</span>
          <div class="w-16 h-px bg-[#D4AF37]/40"></div>
        </div>
      </div>
    </section>

    <!-- ══ CATEGORIES avec SLIDESHOW ══ -->
    <section class="py-20 bg-surface">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12 animate-fade-up">
          <p class="text-[#D4AF37] text-xs uppercase tracking-widest mb-2 font-medium">Explorer</p>
          <h2 class="text-4xl md:text-5xl font-display text-text">Par genre</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          @for (cat of categories; track cat.gender; let ci = $index) {
            <a [routerLink]="['/catalogue']" [queryParams]="{gender: cat.gender}"
               class="group relative h-72 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
               [style.animation-delay]="(ci * 0.1) + 's'">

              <!-- Slideshow images — all stacked, active one is visible -->
              @for (img of cat.images; track img; let ii = $index) {
                <img [src]="img"
                     [alt]="cat.label"
                     class="slide-img"
                     [class.active]="activeSlides[ci] === ii">
              }

              <!-- Ken Burns effect on active image via scale on group -->
              <div class="absolute inset-0 scale-100 group-hover:scale-105 transition-transform duration-[7000ms] ease-in-out"></div>

              <!-- Gradient overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent"></div>

              <!-- Content -->
              <div class="absolute inset-0 flex flex-col items-center justify-end pb-8">
                <p class="text-white/70 text-xs uppercase tracking-[0.3em] mb-2 font-medium">Collection</p>
                <h3 class="text-white font-display text-3xl font-semibold drop-shadow-lg">{{ cat.label }}</h3>
                <div class="mt-3 w-0 h-0.5 bg-[#D4AF37] group-hover:w-14 transition-all duration-500"></div>
              </div>

              <!-- Dot indicators -->
              <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                @for (img of cat.images; track img; let di = $index) {
                  <span class="slide-dot" [class.active]="activeSlides[ci] === di"></span>
                }
              </div>
            </a>
          }
        </div>
      </div>
    </section>

    <!-- ══ REVIEWS ══ -->
    <section class="py-24 bg-surface relative">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16 animate-fade-up">
          <p class="text-[#D4AF37] text-xs uppercase tracking-widest mb-2 font-medium">Témoignages</p>
          <h2 class="text-4xl md:text-5xl font-display text-text">Avis de nos clients</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          @for (review of reviews; track review.name; let i = $index) {
            <div class="bg-surface-2 p-8 rounded-2xl relative animate-fade-up border border-[#D4AF37]/10 hover:shadow-xl hover:shadow-[#D4AF37]/5 hover:-translate-y-2 transition-all duration-500" [style.animation-delay]="(i * 0.1) + 's'">
              <div class="text-[#D4AF37] text-6xl font-serif absolute top-4 right-6 opacity-20">"</div>
              <div class="flex items-center gap-1 mb-6 relative z-10">
                @for (star of [1,2,3,4,5]; track star) {
                  <svg class="w-5 h-5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                }
              </div>
              <p class="text-muted italic mb-8 leading-relaxed relative z-10">
                "{{ review.text }}"
              </p>
              <div class="flex items-center gap-4 border-t border-[#D4AF37]/10 pt-6">
                <div class="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#C19B2E] rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                  {{ review.name.charAt(0) }}
                </div>
                <div>
                  <h4 class="text-text font-semibold">{{ review.name }}</h4>
                  <p class="text-xs text-muted flex items-center gap-1 mt-0.5">
                    <svg class="w-3.5 h-3.5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                    Achat vérifié
                  </p>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- ══ STATS ══ -->
    <section class="py-16 border-y border-[#D4AF37]/10 bg-gradient-to-r from-bg via-surface to-bg overflow-hidden relative">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.03)_0%,transparent_100%)]"></div>
      <div class="container mx-auto px-4 relative z-10">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          @for (stat of stats; track stat.label; let i = $index) {
            <div class="animate-fade-up group p-6 rounded-2xl hover:bg-surface-2 hover:shadow-xl hover:shadow-[#D4AF37]/5 transition-all duration-500 hover:-translate-y-2 backdrop-blur-sm border border-transparent hover:border-[#D4AF37]/10" [style.animation-delay]="(i * 0.1) + 's'">
              <div class="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-[#D4AF37]/20 to-transparent rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <span class="text-[#D4AF37] text-xl font-display">✦</span>
              </div>
              <p class="text-4xl md:text-5xl font-display text-gradient font-bold group-hover:text-[#D4AF37] transition-colors duration-300">{{ stat.value }}</p>
              <p class="text-muted text-sm mt-2 font-medium tracking-wide uppercase">{{ stat.label }}</p>
            </div>
          }
        </div>
      </div>
    </section>
  `
})
export class HomeComponent implements OnInit, OnDestroy {
  featuredProducts: Product[] = [];
  loadingFeatured = true;
  productsVisible = false;

  // Active slide index per category
  activeSlides: number[] = [0, 0, 0];

  categories = [
    {
      gender: 'HOMME',
      label: 'Homme',
      images: [
        'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=700&q=80',
        'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=700&q=80',
        'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=700&q=80',
        'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=700&q=80'
      ]
    },
    {
      gender: 'FEMME',
      label: 'Femme',
      images: [
        'https://images.unsplash.com/photo-1541643600914-78b084683601?w=700&q=80',
        'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=700&q=80',
        'https://images.unsplash.com/photo-1609818942742-c2a5eb17c0d5?w=700&q=80',
        'https://images.unsplash.com/photo-1512496015851-a1fbca621cb0?w=700&q=80'
      ]
    },
    {
      gender: 'MIXTE',
      label: 'Mixte',
      images: [
        'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=700&q=80',
        'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=700&q=80',
        'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=700&q=80',
        'https://images.unsplash.com/photo-1600612253971-57a5b5a4cc06?w=700&q=80'
      ]
    }
  ];

  stats = [
    { value: '200+', label: 'Références' },
    { value: '50+', label: 'Marques' },
    { value: '5000+', label: 'Clients satisfaits' },
    { value: '24', label: 'Gouvernorats livrés' }
  ];

  reviews = [
    { name: 'Amina M.', text: 'Une qualité exceptionnelle. Le parfum tient toute la journée et l\'odeur est juste magnifique. Livraison rapide et service très professionnel.' },
    { name: 'Youssef B.', text: 'J\'ai acheté la collection Homme et je suis bluffé par la tenue du parfum. C\'est exactement ce que je cherchais. Je recommande vivement!' },
    { name: 'Sarah T.', text: 'Le packaging est luxueux et les senteurs sont uniques. C\'est parfait pour un cadeau. Très satisfaite de mon expérience d\'achat, je reviendrai.' }
  ];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getFeaturedProducts().subscribe({
      next: (products) => {
        this.featuredProducts = products.slice(0, 8);
        this.loadingFeatured = false;
        setTimeout(() => { this.productsVisible = true; }, 100);
      },
      error: () => { this.loadingFeatured = false; }
    });

    this.startSlideshows();
  }

  private startSlideshows(): void {
    const intervals = [3200, 4000, 4800]; // ms per category
    this.categories.forEach((cat, i) => {
      // Stagger start time
      setTimeout(() => {
        const interval = setInterval(() => {
          this.activeSlides[i] = (this.activeSlides[i] + 1) % cat.images.length;
        }, intervals[i]);
        // Store so we can clear later
        (this as any)[`_interval_${i}`] = interval;
      }, i * 800); // stagger start by 800ms
    });
  }

  ngOnDestroy(): void {
    this.categories.forEach((_, i) => {
      if ((this as any)[`_interval_${i}`]) {
        clearInterval((this as any)[`_interval_${i}`]);
      }
    });
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.productsVisible = window.scrollY > 200;
  }
}
