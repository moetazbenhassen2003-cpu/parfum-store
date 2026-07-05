import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center px-4 py-16">
      <div class="w-full max-w-md">
        <h1 class="text-4xl font-display text-gold text-center mb-8">Inscription</h1>
        
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="card space-y-4">
          <div>
            <label class="block text-text text-sm mb-2">Nom complet</label>
            <input 
              type="text" 
              formControlName="fullName"
              class="input"
              placeholder="Votre nom">
          </div>

          <div>
            <label class="block text-text text-sm mb-2">Email</label>
            <input 
              type="email" 
              formControlName="email"
              class="input"
              placeholder="votre@email.com">
          </div>

          <div>
            <label class="block text-text text-sm mb-2">Téléphone</label>
            <input 
              type="tel" 
              formControlName="phone"
              class="input"
              placeholder="0555123456">
          </div>

          <div>
            <label class="block text-text text-sm mb-2">Mot de passe</label>
            <input 
              type="password" 
              formControlName="password"
              class="input"
              placeholder="••••••••">
          </div>

          <button 
            type="submit" 
            [disabled]="registerForm.invalid || loading"
            class="w-full btn-primary">
            {{ loading ? 'Inscription...' : 'S\'inscrire' }}
          </button>

          <p class="text-center text-muted text-sm">
            Déjà un compte?
            <a routerLink="/login" class="text-gold hover:text-gold-hover ml-1">
              Se connecter
            </a>
          </p>
        </form>
      </div>
    </div>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.loading = false;
          this.toastService.success('Inscription réussie!');
          this.router.navigate(['/']);
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }
}
