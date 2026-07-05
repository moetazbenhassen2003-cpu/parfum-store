import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/storefront/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'catalogue',
    loadComponent: () => import('./features/storefront/catalogue/catalogue.component').then(m => m.CatalogueComponent)
  },
  {
    path: 'produit/:id',
    loadComponent: () => import('./features/storefront/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
  },
  {
    path: 'acces-securise',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'mot-de-passe-oublie',
    loadComponent: () => import('./features/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./features/auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
  },
  {
    path: 'checkout',
    loadComponent: () => import('./features/cart/checkout/checkout.component').then(m => m.CheckoutComponent)
  },
  {
    path: 'commande-confirmee',
    loadComponent: () => import('./features/cart/order-confirmation/order-confirmation.component').then(m => m.OrderConfirmationComponent)
  },
  {
    path: 'mon-compte',
    loadComponent: () => import('./features/client/client-dashboard/client-dashboard.component').then(m => m.ClientDashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'produits',
        loadComponent: () => import('./features/admin/product-list/product-list.component').then(m => m.ProductListComponent)
      },
      {
        path: 'produits/nouveau',
        loadComponent: () => import('./features/admin/product-form/product-form.component').then(m => m.ProductFormComponent)
      },
      {
        path: 'produits/:id/edit',
        loadComponent: () => import('./features/admin/product-form/product-form.component').then(m => m.ProductFormComponent)
      },
      {
        path: 'commandes',
        loadComponent: () => import('./features/admin/order-list/order-list.component').then(m => m.OrderListComponent)
      },
      {
        path: 'commandes/:id',
        loadComponent: () => import('./features/admin/order-detail/order-detail.component').then(m => m.OrderDetailComponent)
      },
      {
        path: 'changer-mot-de-passe',
        loadComponent: () => import('./features/admin/change-password/change-password.component').then(m => m.ChangePasswordComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
