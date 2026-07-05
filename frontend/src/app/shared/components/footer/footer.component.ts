import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- ══ LIVRAISON BANNER ══ -->
    <div class="bg-gradient-to-r from-[#D4AF37] via-[#C8A227] to-[#D4AF37] py-4">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div class="flex items-center justify-center gap-3 text-white">
            <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12"/>
            </svg>
            <div class="text-left">
              <p class="font-semibold text-sm">Livraison Gratuite</p>
              <p class="text-white/80 text-xs">Partout en Tunisie 🇹🇳</p>
            </div>
          </div>
          <div class="flex items-center justify-center gap-3 text-white">
            <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
            <div class="text-left">
              <p class="font-semibold text-sm">100% Authentique</p>
              <p class="text-white/80 text-xs">Parfums originaux garantis</p>
            </div>
          </div>
          <div class="flex items-center justify-center gap-3 text-white">
            <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
            <div class="text-left">
              <p class="font-semibold text-sm">Paiement à la livraison</p>
              <p class="text-white/80 text-xs">Cash ou virement</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══ MAIN FOOTER ══ -->
    <footer class="bg-[#2C2C2C] text-white">
      <div class="container mx-auto px-4 py-14">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-10">

          <!-- Brand -->
          <div class="md:col-span-1">
            <h3 class="text-3xl font-display text-[#D4AF37] mb-4 tracking-widest">PARFUM</h3>
            <p class="text-white/50 text-sm leading-relaxed mb-6">
              Votre destination parfums de luxe en Tunisie. 
              Des fragrances d'exception livrées chez vous.
            </p>
            <!-- Social Icons -->
            <div class="flex items-center gap-4">
              <a href="https://facebook.com" target="_blank"
                 class="w-9 h-9 rounded-full bg-white/10 hover:bg-[#1877F2] flex items-center justify-center transition-all duration-300 hover:scale-110">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank"
                 class="w-9 h-9 rounded-full bg-white/10 hover:bg-gradient-to-br hover:from-[#833AB4] hover:via-[#E1306C] hover:to-[#FCAF45] flex items-center justify-center transition-all duration-300 hover:scale-110"
                 style="background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.1));">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://tiktok.com" target="_blank"
                 class="w-9 h-9 rounded-full bg-white/10 hover:bg-black flex items-center justify-center transition-all duration-300 hover:scale-110">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.56V6.8a4.85 4.85 0 01-1.07-.11z"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- Navigation -->
          <div>
            <h4 class="text-white font-semibold mb-5 text-sm uppercase tracking-widest">Navigation</h4>
            <ul class="space-y-3">
              <li><a routerLink="/" class="text-white/50 hover:text-[#D4AF37] transition-colors text-sm">Accueil</a></li>
              <li><a routerLink="/catalogue" class="text-white/50 hover:text-[#D4AF37] transition-colors text-sm">Catalogue</a></li>
              <li><a routerLink="/catalogue" [queryParams]="{gender:'HOMME'}" class="text-white/50 hover:text-[#D4AF37] transition-colors text-sm">Collection Homme</a></li>
              <li><a routerLink="/catalogue" [queryParams]="{gender:'FEMME'}" class="text-white/50 hover:text-[#D4AF37] transition-colors text-sm">Collection Femme</a></li>
              <li><a routerLink="/catalogue" [queryParams]="{gender:'MIXTE'}" class="text-white/50 hover:text-[#D4AF37] transition-colors text-sm">Collection Mixte</a></li>
            </ul>
          </div>

          <!-- Marques -->
          <div>
            <h4 class="text-white font-semibold mb-5 text-sm uppercase tracking-widest">Nos marques</h4>
            <ul class="space-y-3">
              <li class="text-white/50 text-sm">Dior</li>
              <li class="text-white/50 text-sm">Chanel</li>
              <li class="text-white/50 text-sm">Tom Ford</li>
              <li class="text-white/50 text-sm">Yves Saint Laurent</li>
              <li class="text-white/50 text-sm">Creed</li>
              <li class="text-white/50 text-sm">Maison Margiela</li>
            </ul>
          </div>

          <!-- Contact -->
          <div>
            <h4 class="text-white font-semibold mb-5 text-sm uppercase tracking-widest">Contact</h4>
            <ul class="space-y-3 text-sm">
              <li class="flex items-center gap-2 text-white/50">
                <svg class="w-4 h-4 text-[#D4AF37] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                contact&#64;parfum.tn
              </li>
              <li class="flex items-center gap-2 text-white/50">
                <svg class="w-4 h-4 text-[#D4AF37] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                +216 XX XXX XXX
              </li>
              <li class="flex items-center gap-2 text-white/50">
                <svg class="w-4 h-4 text-[#D4AF37] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                Tunisie 🇹🇳
              </li>
            </ul>
            <!-- WhatsApp CTA -->
            <a href="https://wa.me/21692584454" target="_blank"
               class="flex items-center gap-3 text-white/70 hover:text-[#D4AF37] transition-colors group/link mt-5">
              <div class="w-10 h-10 rounded-full bg-white/5 group-hover/link:bg-[#D4AF37]/10 flex items-center justify-center transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/></svg>
              </div>
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="border-t border-white/10">
        <div class="container mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p class="text-white/30 text-xs">© {{ currentYear }} Parfum Tunisie. Tous droits réservés.</p>
          <div class="flex items-center gap-4 text-white/30 text-xs">
            <span>Livraison gratuite 🇹🇳</span>
            <span>·</span>
            <span>Paiement à la livraison</span>
            <span>·</span>
            <span>100% Authentique</span>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
