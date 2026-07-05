import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center px-4 py-16">
      <div class="w-full max-w-md">
        <h1 class="text-4xl font-display text-gold text-center mb-8">Connexion</h1>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="card space-y-4">
          <div>
            <label class="block text-text text-sm mb-2">Email</label>
            <input 
              type="email" 
              formControlName="email"
              class="input"
              placeholder="votre@email.com">
            @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
              <p class="text-danger text-sm mt-1">Email invalide</p>
            }
          </div>

          <div>
            <label class="block text-text text-sm mb-2">Mot de passe</label>
            <input 
              type="password" 
              formControlName="password"
              class="input"
              placeholder="••••••••">
            @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
              <p class="text-danger text-sm mt-1">Mot de passe requis</p>
            }
          </div>

          <div class="flex items-center justify-between">
            <a routerLink="/mot-de-passe-oublie"
               class="text-sm text-gold hover:text-gold-hover transition-colors">
              Mot de passe oublié ?
            </a>
          </div>

          <button
            type="submit"
            [disabled]="loginForm.invalid || loading"
            class="w-full btn-primary">
            {{ loading ? 'Connexion...' : 'Se connecter' }}
          </button>

          <p class="text-center text-muted text-sm">
            Pas encore de compte?
            <a routerLink="/register" class="text-gold hover:text-gold-hover ml-1">
              S'inscrire
            </a>
          </p>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.loading = false;
          this.toastService.success('Connexion réussie!');
          
          if (response.role === 'ADMIN') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/']);
          }
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }
}
