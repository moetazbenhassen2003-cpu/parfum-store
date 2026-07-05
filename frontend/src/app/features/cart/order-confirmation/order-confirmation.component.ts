import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center px-4 py-16">
      <div class="max-w-lg w-full card text-center">
        <!-- Animated Checkmark -->
        <div class="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6
                    animate-[ping_0.4s_ease-out]">
          <div class="w-16 h-16 bg-success rounded-full flex items-center justify-center">
            <svg class="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 class="text-4xl font-display text-gold mb-4">Commande reçue !</h1>

        @if (orderId) {
          <p class="text-muted text-sm mb-4">
            Référence : <span class="text-gold font-mono">#{{ orderId }}</span>
          </p>
        }

        @if (orderItems.length > 0) {
          <div class="mb-6 flex flex-wrap justify-center gap-4">
            @for (item of orderItems; track item.id) {
              <div class="flex flex-col items-center">
                <img [src]="getImageUrl(item.productImageUrl)" 
                     [alt]="item.productName"
                     class="w-20 h-20 object-cover rounded-lg shadow-md border border-muted/20">
                <p class="text-xs text-text mt-2 font-medium w-24 truncate" [title]="item.productName">
                  {{ item.productName }}
                </p>
                <p class="text-xs text-muted">x{{ item.quantity }}</p>
              </div>
            }
          </div>
        }

        <p class="text-text mb-2 leading-relaxed">
          Merci pour votre commande ! Nous vous contacterons sous <strong class="text-gold">24h</strong>
          pour confirmer votre commande et vous communiquer les modalités de paiement.
        </p>

        <p class="text-muted text-sm mb-8">
          💳 Paiement à la livraison — Cash ou CCP
        </p>

        <div class="flex justify-center mt-6">
          <a routerLink="/" class="btn-primary text-center px-12 py-3 shadow-lg hover:-translate-y-1 transition-all">
            Retour à l'accueil
          </a>
        </div>

        <!-- WhatsApp CTA -->
        <a href="https://wa.me/21692584454?text=Bonjour, j'ai passé la commande et j'aimerais confirmer."
           target="_blank"
           class="mt-6 inline-flex items-center space-x-2 text-[#25D366] hover:underline text-sm">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
          </svg>
          <span>Nous contacter sur WhatsApp</span>
        </a>
      </div>
    </div>
  `
})
export class OrderConfirmationComponent implements OnInit {
  orderId: number | null = null;
  orderItems: any[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    const state = this.router.lastSuccessfulNavigation?.extras?.state as any;
    this.orderId = state?.orderId ?? null;
    this.orderItems = state?.orderItems ?? [];
  }

  getImageUrl(url?: string): string {
    if (!url) return 'assets/placeholder.jpg';
    return url.startsWith('http') ? url : environment.apiUrl + url;
  }
}
