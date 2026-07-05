import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const newPwd = control.get('newPassword');
  const confirm = control.get('confirmPassword');
  if (newPwd && confirm && newPwd.value !== confirm.value) {
    return { mismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center px-4 py-16">
      <div class="w-full max-w-md">
        <div class="text-center mb-10">
          <div class="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
            </svg>
          </div>
          <h1 class="text-3xl font-display text-gold mb-2">Changer le mot de passe</h1>
          <p class="text-muted text-sm">Modifiez le mot de passe de votre compte administrateur.</p>
        </div>

        <form [formGroup]="changeForm" (ngSubmit)="onSubmit()" class="card space-y-5">

          <div>
            <label class="block text-text text-sm font-medium mb-2">Mot de passe actuel</label>
            <div class="relative">
              <input [type]="showCurrent ? 'text' : 'password'"
                     formControlName="currentPassword"
                     class="input pr-12"
                     placeholder="Votre mot de passe actuel"
                     id="current-password">
              <button type="button" (click)="showCurrent = !showCurrent"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  @if (showCurrent) {
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                  } @else {
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  }
                </svg>
              </button>
            </div>
            @if (changeForm.get('currentPassword')?.invalid && changeForm.get('currentPassword')?.touched) {
              <p class="text-danger text-xs mt-1">Mot de passe actuel requis</p>
            }
          </div>

          <div class="border-t border-gold/10 pt-4">
            <div class="mb-4">
              <label class="block text-text text-sm font-medium mb-2">Nouveau mot de passe</label>
              <input type="password" formControlName="newPassword" class="input"
                     placeholder="Minimum 8 caractères" id="new-password-admin">
              @if (changeForm.get('newPassword')?.invalid && changeForm.get('newPassword')?.touched) {
                <p class="text-danger text-xs mt-1">Minimum 8 caractères requis</p>
              }

              <!-- Password strength -->
              @if (changeForm.get('newPassword')?.value?.length > 0) {
                <div class="mt-2">
                  <div class="flex gap-1 mb-1">
                    @for (bar of [1,2,3,4]; track bar) {
                      <div class="h-1 flex-1 rounded-full transition-colors duration-300"
                           [class]="getStrengthColor(bar)"></div>
                    }
                  </div>
                  <p class="text-xs" [class]="getStrengthTextColor()">{{ getStrengthLabel() }}</p>
                </div>
              }
            </div>

            <div>
              <label class="block text-text text-sm font-medium mb-2">Confirmer le nouveau mot de passe</label>
              <input type="password" formControlName="confirmPassword" class="input"
                     placeholder="Répétez votre nouveau mot de passe" id="confirm-password-admin">
              @if (changeForm.hasError('mismatch') && changeForm.get('confirmPassword')?.touched) {
                <p class="text-danger text-xs mt-1">Les mots de passe ne correspondent pas</p>
              }
            </div>
          </div>

          @if (error) {
            <div class="bg-danger/10 border border-danger/20 rounded-lg p-3 text-danger text-sm">{{ error }}</div>
          }

          <div class="flex gap-3">
            <a routerLink="/admin" class="flex-1 btn-secondary text-center text-sm">
              Annuler
            </a>
            <button type="submit" [disabled]="changeForm.invalid || loading"
                    class="flex-1 btn-primary flex items-center justify-center gap-2 text-sm">
              @if (loading) {
                <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              }
              {{ loading ? 'Modification...' : 'Modifier le mot de passe' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ChangePasswordComponent {
  changeForm: FormGroup;
  loading = false;
  error = '';
  showCurrent = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.changeForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  onSubmit(): void {
    if (this.changeForm.valid) {
      this.loading = true;
      this.error = '';
      const { currentPassword, newPassword } = this.changeForm.value;
      this.authService.changePassword(currentPassword, newPassword).subscribe({
        next: () => {
          this.loading = false;
          this.toastService.success('Mot de passe modifié avec succès !');
          this.changeForm.reset();
        },
        error: (err) => {
          this.loading = false;
          this.error = err?.error?.message || 'Mot de passe actuel incorrect.';
        }
      });
    }
  }

  getStrength(): number {
    const pwd = this.changeForm.get('newPassword')?.value || '';
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
    return ['', 'Faible', 'Moyen', 'Fort', 'Très fort'][this.getStrength()] || '';
  }

  getStrengthTextColor(): string {
    const s = this.getStrength();
    if (s === 1) return 'text-danger text-xs';
    if (s === 2) return 'text-orange-400 text-xs';
    if (s === 3) return 'text-yellow-500 text-xs';
    return 'text-success text-xs';
  }
}
