import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styles: [`
    .top-bar { transition: max-height 0.4s ease, opacity 0.4s ease; }
    .navbar  { transition: all .3s ease; }
    .navbar.scrolled {
      background: rgba(253, 252, 250, 0.95) !important;
      backdrop-filter: blur(16px);
      box-shadow: 0 4px 24px rgba(212, 175, 55, 0.08);
      border-bottom: 1px solid rgba(212, 175, 55, 0.15) !important;
    }
    .nav-link {
      position: relative;
    }
    .nav-link::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 1px;
      background: #D4AF37;
      transition: width 0.3s ease;
    }
    .nav-link:hover::after,
    .nav-link.active::after {
      width: 100%;
    }
  `],
  template: `
    <!-- ══ TOP BAR ══ -->
    <div class="top-bar bg-[#2C2C2C] text-white text-xs"
         [style.max-height]="isScrolled ? '0' : '40px'"
         [style.opacity]="isScrolled ? '0' : '1'"
         style="overflow:hidden;">
      <div class="container mx-auto px-4 h-10 flex items-center justify-between">
        <!-- Left: livraison -->
        <div class="flex items-center gap-4">
          <span class="flex items-center gap-1.5 text-[#D4AF37]">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12"/>
            </svg>
            <span class="hidden sm:inline font-medium">Livraison gratuite partout en Tunisie</span>
            <span class="sm:hidden font-medium">Livraison gratuite 🇹🇳</span>
          </span>
          <span class="hidden md:flex items-center gap-1.5 text-white/60">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
            +216 XX XXX XXX
          </span>
        </div>
        <!-- Right: social -->
        <div class="flex items-center gap-3">
          <a href="https://facebook.com" target="_blank"
             class="text-white/60 hover:text-[#1877F2] transition-colors">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          <a href="https://instagram.com" target="_blank"
             class="text-white/60 hover:text-[#E1306C] transition-colors">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          <a href="https://tiktok.com" target="_blank"
             class="text-white/60 hover:text-white transition-colors">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.56V6.8a4.85 4.85 0 01-1.07-.11z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>

    <!-- ══ NAVBAR ══ -->
    <nav class="navbar fixed left-0 right-0 z-50 border-b border-transparent bg-surface/90"
         [style.top]="isScrolled ? '0' : '40px'"
         [class.scrolled]="isScrolled"
         [class.!top-0]="isScrolled"
         [class.bg-surface]="mobileMenuOpen">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">

          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-2 group">
            <span class="text-2xl font-display text-[#D4AF37] tracking-widest group-hover:opacity-80 transition-opacity">PARFUM</span>
            <span class="text-[#6B6B6B] text-xs hidden sm:block">✦ Tunisie</span>
          </a>

          <!-- Desktop Nav -->
          <div class="hidden md:flex items-center gap-8">
            <a routerLink="/" routerLinkActive="text-[#D4AF37] active" [routerLinkActiveOptions]="{exact:true}"
               class="nav-link text-[#2C2C2C]/80 hover:text-[#D4AF37] transition-colors text-sm tracking-wide">
              Accueil
            </a>
            <a routerLink="/catalogue" routerLinkActive="text-[#D4AF37] active"
               class="nav-link text-[#2C2C2C]/80 hover:text-[#D4AF37] transition-colors text-sm tracking-wide">
              Catalogue
            </a>
            <a routerLink="/catalogue" [queryParams]="{gender:'HOMME'}"
               class="nav-link text-[#2C2C2C]/80 hover:text-[#D4AF37] transition-colors text-sm tracking-wide">
              Homme
            </a>
            <a routerLink="/catalogue" [queryParams]="{gender:'FEMME'}"
               class="nav-link text-[#2C2C2C]/80 hover:text-[#D4AF37] transition-colors text-sm tracking-wide">
              Femme
            </a>
            <a routerLink="/catalogue" [queryParams]="{gender:'MIXTE'}"
               class="nav-link text-[#2C2C2C]/80 hover:text-[#D4AF37] transition-colors text-sm tracking-wide">
              Mixte
            </a>
            @if (currentUser?.role === 'ADMIN') {
              <a routerLink="/admin" routerLinkActive="text-[#D4AF37]"
                 class="nav-link text-[#2C2C2C]/80 hover:text-[#D4AF37] transition-colors text-sm tracking-wide">
                Admin
              </a>
            }
          </div>

          <!-- Right -->
          <div class="flex items-center gap-3">
            @if (currentUser?.role === 'ADMIN') {
              <button (click)="logout()"
                      class="hidden md:flex items-center gap-2 text-[#6B6B6B] hover:text-[#2C2C2C] text-sm transition-colors">
                <span class="w-7 h-7 bg-[#F8F6F3] rounded-full flex items-center justify-center text-xs text-[#D4AF37] font-bold border border-[#D4AF37]/30">
                  A
                </span>
                <span class="hidden lg:block">Déconnexion</span>
              </button>
            }

            <!-- Mobile burger -->
            <button (click)="mobileMenuOpen = !mobileMenuOpen"
                    class="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
                    aria-label="Menu">
              <span [class.rotate-45]="mobileMenuOpen" [class.translate-y-2]="mobileMenuOpen"
                    class="w-5 h-px bg-[#2C2C2C] transition-all duration-300 origin-center block"></span>
              <span [class.opacity-0]="mobileMenuOpen"
                    class="w-5 h-px bg-[#2C2C2C] transition-all duration-300 block"></span>
              <span [class.-rotate-45]="mobileMenuOpen" [class.-translate-y-2]="mobileMenuOpen"
                    class="w-5 h-px bg-[#2C2C2C] transition-all duration-300 origin-center block"></span>
            </button>
          </div>
        </div>

        <!-- Mobile Menu -->
        <div [class.max-h-0]="!mobileMenuOpen"
             [class.max-h-screen]="mobileMenuOpen"
             class="md:hidden overflow-hidden transition-all duration-300 ease-in-out">
          <div class="py-3 space-y-1 border-t border-[#D4AF37]/10">
            <a routerLink="/" (click)="mobileMenuOpen=false"
               class="block px-3 py-2.5 text-[#2C2C2C]/80 hover:text-[#D4AF37] hover:bg-[#FDF8F3] rounded-lg transition-colors text-sm">
              Accueil
            </a>
            <a routerLink="/catalogue" (click)="mobileMenuOpen=false"
               class="block px-3 py-2.5 text-[#2C2C2C]/80 hover:text-[#D4AF37] hover:bg-[#FDF8F3] rounded-lg transition-colors text-sm">
              Catalogue
            </a>
            <a routerLink="/catalogue" [queryParams]="{gender:'HOMME'}" (click)="mobileMenuOpen=false"
               class="block px-3 py-2.5 text-[#2C2C2C]/80 hover:text-[#D4AF37] hover:bg-[#FDF8F3] rounded-lg transition-colors text-sm">
              Homme
            </a>
            <a routerLink="/catalogue" [queryParams]="{gender:'FEMME'}" (click)="mobileMenuOpen=false"
               class="block px-3 py-2.5 text-[#2C2C2C]/80 hover:text-[#D4AF37] hover:bg-[#FDF8F3] rounded-lg transition-colors text-sm">
              Femme
            </a>
            <a routerLink="/catalogue" [queryParams]="{gender:'MIXTE'}" (click)="mobileMenuOpen=false"
               class="block px-3 py-2.5 text-[#2C2C2C]/80 hover:text-[#D4AF37] hover:bg-[#FDF8F3] rounded-lg transition-colors text-sm">
              Mixte
            </a>
            <!-- Mobile social links -->
            <div class="flex items-center gap-4 px-3 pt-2 pb-1 border-t border-[#D4AF37]/10 mt-2">
              <a href="https://facebook.com" target="_blank" class="text-[#6B6B6B] hover:text-[#1877F2] transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" class="text-[#6B6B6B] hover:text-[#E1306C] transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://tiktok.com" target="_blank" class="text-[#6B6B6B] hover:text-[#2C2C2C] transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.56V6.8a4.85 4.85 0 01-1.07-.11z"/>
                </svg>
              </a>
            </div>
            @if (currentUser?.role === 'ADMIN') {
              <button (click)="logout()"
                      class="w-full text-left px-3 py-2.5 text-[#6B6B6B] hover:text-[#2C2C2C] hover:bg-[#FDF8F3] rounded-lg transition-colors text-sm">
                Déconnexion
              </button>
            }
          </div>
        </div>
      </div>
    </nav>

    <!-- Spacer: top bar (40px, hidden when scrolled) + navbar (64px) -->
    <div [style.height]="isScrolled ? '64px' : '104px'" class="transition-all duration-300"></div>
  `
})
export class NavbarComponent implements OnInit {
  currentUser: User | null = null;
  mobileMenuOpen = false;
  isScrolled = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(u => this.currentUser = u);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled = window.scrollY > 40;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
    this.mobileMenuOpen = false;
  }
}
