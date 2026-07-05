import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center px-4 py-16">
      <div class="w-full max-w-md">

        <!-- Header -->
        <div class="text-center mb-10">
          <div class="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
            </svg>
          </div>
          <h1 class="text-3xl font-display text-gold mb-2">Mot de passe oublié</h1>
          <p class="text-muted text-sm">Entrez votre email administrateur et nous vous enverrons un lien de réinitialisation.</p>
        </div>

        @if (!sent) {
          <form [formGroup]="forgotForm" (ngSubmit)="onSubmit()" class="card space-y-5">
            <div>
              <label class="block text-text text-sm font-medium mb-2">Email administrateur</label>
              <input
                type="email"
                formControlName="email"
                class="input"
                placeholder="admin@exemple.com"
                id="forgot-email">
              @if (forgotForm.get('email')?.invalid && forgotForm.get('email')?.touched) {
                <p class="text-danger text-xs mt-1">Entrez un email valide</p>
              }
            </div>

            <button
              type="submit"
              [disabled]="forgotForm.invalid || loading"
              class="w-full btn-primary flex items-center justify-center gap-2">
              @if (loading) {
                <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Envoi en cours...
              } @else {
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                Envoyer le lien
              }
            </button>

            <p class="text-center text-muted text-sm">
              <a routerLink="/login" class="text-gold hover:text-gold-hover transition-colors">
                ← Retour à la connexion
              </a>
            </p>
          </form>
        } @else {
          <!-- Success state -->
          <div class="card text-center space-y-5">
            <div class="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto">
              <svg class="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <h2 class="text-2xl font-display text-text mb-3">Email envoyé !</h2>
              <p class="text-muted leading-relaxed">
                Si un compte administrateur existe avec cet email, vous recevrez un lien dans les prochaines minutes.
              </p>
              <p class="text-muted text-sm mt-3">
                ⏰ Le lien expire dans <strong class="text-gold">30 minutes</strong>.
              </p>
            </div>
            <div class="border-t border-gold/10 pt-4">
              <p class="text-muted text-sm">Vous n'avez pas reçu l'email ? Vérifiez votre dossier spam.</p>
              <button (click)="sent = false" class="text-gold text-sm hover:underline mt-2">
                Réessayer avec un autre email
              </button>
            </div>
            <a routerLink="/login" class="btn-secondary inline-block text-sm">
              Retour à la connexion
            </a>
          </div>
        }
      </div>
    </div>
  `
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  loading = false;
  sent = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotForm.valid) {
      this.loading = true;
      const { email } = this.forgotForm.value;
      this.authService.forgotPassword(email).subscribe({
        next: () => {
          this.loading = false;
          this.sent = true;
        },
        error: () => {
          this.loading = false;
          this.sent = true; // Still show success (don't leak info)
        }
      });
    }
  }
}
