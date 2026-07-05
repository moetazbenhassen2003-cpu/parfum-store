import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const newPwd = control.get('newPassword');
  const confirm = control.get('confirmPassword');
  if (newPwd && confirm && newPwd.value !== confirm.value) {
    return { mismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center px-4 py-16">
      <div class="w-full max-w-md">

        <!-- Validating token state -->
        @if (validating) {
          <div class="card text-center py-12">
            <svg class="w-10 h-10 animate-spin text-gold mx-auto mb-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <p class="text-muted">Vérification du lien...</p>
          </div>
        }

        <!-- Token invalid -->
        @if (!validating && !tokenValid) {
          <div class="card text-center space-y-5">
            <div class="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mx-auto">
              <svg class="w-8 h-8 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              </svg>
            </div>
            <h2 class="text-2xl font-display text-text">Lien invalide ou expiré</h2>
            <p class="text-muted">Ce lien de réinitialisation n'est plus valide. Veuillez en demander un nouveau.</p>
            <a routerLink="/mot-de-passe-oublie" class="btn-primary inline-block">
              Demander un nouveau lien
            </a>
          </div>
        }

        <!-- Reset form -->
        @if (!validating && tokenValid && !success) {
          <div class="text-center mb-10">
            <div class="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
            <h1 class="text-3xl font-display text-gold mb-2">Nouveau mot de passe</h1>
            <p class="text-muted text-sm">Choisissez un mot de passe fort pour votre compte admin.</p>
          </div>

          <form [formGroup]="resetForm" (ngSubmit)="onSubmit()" class="card space-y-5">
            <div>
              <label class="block text-text text-sm font-medium mb-2">Nouveau mot de passe</label>
              <input type="password" formControlName="newPassword" class="input"
                     placeholder="Minimum 8 caractères" id="new-password">
              @if (resetForm.get('newPassword')?.invalid && resetForm.get('newPassword')?.touched) {
                <p class="text-danger text-xs mt-1">Minimum 8 caractères requis</p>
              }
            </div>
            <div>
              <label class="block text-text text-sm font-medium mb-2">Confirmer le mot de passe</label>
              <input type="password" formControlName="confirmPassword" class="input"
                     placeholder="Répétez votre mot de passe" id="confirm-password">
              @if (resetForm.hasError('mismatch') && resetForm.get('confirmPassword')?.touched) {
                <p class="text-danger text-xs mt-1">Les mots de passe ne correspondent pas</p>
              }
            </div>

            <!-- Password strength indicator -->
            @if (resetForm.get('newPassword')?.value?.length > 0) {
              <div>
                <div class="flex gap-1 mb-1">
                  @for (bar of [1,2,3,4]; track bar) {
                    <div class="h-1 flex-1 rounded-full transition-colors duration-300"
                         [class]="getStrengthColor(bar)"></div>
                  }
                </div>
                <p class="text-xs" [class]="getStrengthTextColor()">{{ getStrengthLabel() }}</p>
              </div>
            }

            @if (error) {
              <div class="bg-danger/10 border border-danger/20 rounded-lg p-3 text-danger text-sm">{{ error }}</div>
            }

            <button type="submit" [disabled]="resetForm.invalid || loading" class="w-full btn-primary flex items-center justify-center gap-2">
              @if (loading) {
                <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Réinitialisation...
              } @else {
                Réinitialiser le mot de passe
              }
            </button>
          </form>
        }

        <!-- Success state -->
        @if (success) {
          <div class="card text-center space-y-5">
            <div class="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto animate-[ping_0.4s_ease-out]">
              <div class="w-16 h-16 bg-success rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
            </div>
            <h2 class="text-2xl font-display text-text">Mot de passe réinitialisé !</h2>
            <p class="text-muted">Votre mot de passe a été changé avec succès. Vous pouvez maintenant vous connecter.</p>
            <a routerLink="/login" class="btn-primary inline-block">Se connecter</a>
          </div>
        }
      </div>
    </div>
  `
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  loading = false;
  validating = true;
  tokenValid = false;
  success = false;
  error = '';
  private token = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    if (!this.token) {
      this.validating = false;
      this.tokenValid = false;
      return;
    }
    this.authService.validateResetToken(this.token).subscribe({
      next: (res) => {
        this.validating = false;
        this.tokenValid = res.valid;
      },
      error: () => {
        this.validating = false;
        this.tokenValid = false;
      }
    });
  }

  onSubmit(): void {
    if (this.resetForm.valid) {
      this.loading = true;
      this.error = '';
      const { newPassword } = this.resetForm.value;
      this.authService.resetPassword(this.token, newPassword).subscribe({
        next: () => {
          this.loading = false;
          this.success = true;
        },
        error: (err) => {
          this.loading = false;
          this.error = err?.error?.message || 'Une erreur est survenue. Veuillez réessayer.';
        }
      });
    }
  }

  getStrength(): number {
    const pwd = this.resetForm.get('newPassword')?.value || '';
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  }

  getStrengthColor(bar: number): string {
    const s = this.getStrength();
    if (s === 0) return 'bg-muted/20';
    if (bar <= s) {
      if (s === 1) return 'bg-danger';
      if (s === 2) return 'bg-orange-400';
      if (s === 3) return 'bg-yellow-400';
      return 'bg-success';
    }
    return 'bg-muted/20';
  }

  getStrengthLabel(): string {
    const labels = ['', 'Faible', 'Moyen', 'Fort', 'Très fort'];
    return labels[this.getStrength()] || '';
  }

  getStrengthTextColor(): string {
    const s = this.getStrength();
    if (s === 1) return 'text-danger text-xs';
    if (s === 2) return 'text-orange-400 text-xs';
    if (s === 3) return 'text-yellow-500 text-xs';
    return 'text-success text-xs';
  }
}
