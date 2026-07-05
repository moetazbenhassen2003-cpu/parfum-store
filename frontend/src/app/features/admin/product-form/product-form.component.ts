import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { ToastService } from '../../../core/services/toast.service';
import { Product, ProductImage } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  styles: [`
    @keyframes fadeSlideIn {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .section-card { animation: fadeSlideIn .4s ease both; }
    .img-preview:hover .img-overlay { opacity: 1; }
    .drag-over { border-color: #C9A84C !important; background: rgba(201,168,76,.06); }
  `],
  template: `
    <div class="min-h-screen bg-bg">
      <div class="max-w-5xl mx-auto px-4 py-10">

        <!-- Header -->
        <div class="flex items-center gap-4 mb-10">
          <a routerLink="/admin/produits"
             class="w-10 h-10 rounded-full bg-surface flex items-center justify-center
                    text-muted hover:text-gold hover:bg-surface-2 transition-all">
            ←
          </a>
          <div>
            <p class="text-muted text-xs uppercase tracking-widest">Admin / Produits</p>
            <h1 class="text-3xl font-display text-gold">
              {{ isEdit ? 'Modifier le produit' : 'Nouveau produit' }}
            </h1>
          </div>
        </div>

        @if (formLoading) {
          <div class="flex items-center justify-center py-32">
            <div class="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
          </div>
        } @else {
          <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="space-y-6">

            <!-- ── Section 1: Info ── -->
            <div class="section-card bg-surface rounded-xl p-7 border border-muted/10" style="animation-delay:.05s">
              <h2 class="text-gold font-semibold text-base mb-6 flex items-center gap-2">
                <span class="w-6 h-6 bg-gold/20 rounded flex items-center justify-center text-gold text-xs">1</span>
                Informations générales
              </h2>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label class="block text-muted text-xs uppercase tracking-wider mb-2">Nom *</label>
                  <input formControlName="name" type="text" class="input" placeholder="ex: La Nuit de l'Homme">
                  @if (f['name'].invalid && f['name'].touched) {
                    <p class="text-danger text-xs mt-1">Ce champ est obligatoire</p>
                  }
                </div>
                <div>
                  <label class="block text-muted text-xs uppercase tracking-wider mb-2">Marque *</label>
                  <input formControlName="brand" type="text" class="input" placeholder="ex: YSL, Dior, Chanel">
                  @if (f['brand'].invalid && f['brand'].touched) {
                    <p class="text-danger text-xs mt-1">Ce champ est obligatoire</p>
                  }
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                <div>
                  <label class="block text-muted text-xs uppercase tracking-wider mb-2">Genre *</label>
                  <div class="flex gap-2 flex-wrap">
                    @for (g of genderOptions; track g.value) {
                      <button type="button"
                              (click)="productForm.get('gender')!.setValue(g.value)"
                              [class.border-gold]="productForm.get('gender')?.value === g.value"
                              [class.text-gold]="productForm.get('gender')?.value === g.value"
                              [class.bg-gold]="productForm.get('gender')?.value === g.value"
                              [class.text-bg]="productForm.get('gender')?.value === g.value"
                              [class.bg-transparent]="productForm.get('gender')?.value !== g.value"
                              [class.text-muted]="productForm.get('gender')?.value !== g.value"
                              class="px-4 py-1.5 rounded-full border border-muted/30 text-sm transition-all duration-200">
                        {{ g.label }}
                      </button>
                    }
                  </div>
                </div>

                <div>
                  <label class="block text-muted text-xs uppercase tracking-wider mb-2">Catégorie *</label>
                  <div class="flex gap-2 flex-wrap">
                    @for (c of categoryOptions; track c.value) {
                      <button type="button"
                              (click)="productForm.get('category')!.setValue(c.value)"
                              [class.border-gold]="productForm.get('category')?.value === c.value"
                              [class.text-gold]="productForm.get('category')?.value === c.value"
                              [class.bg-gold]="productForm.get('category')?.value === c.value"
                              [class.text-bg]="productForm.get('category')?.value === c.value"
                              [class.bg-transparent]="productForm.get('category')?.value !== c.value"
                              [class.text-muted]="productForm.get('category')?.value !== c.value"
                              class="px-4 py-1.5 rounded-full border border-muted/30 text-sm transition-all duration-200">
                        {{ c.label }}
                      </button>
                    }
                  </div>
                </div>
              </div>

              <div class="mt-5">
                <label class="block text-muted text-xs uppercase tracking-wider mb-2">Description</label>
                <textarea formControlName="description" rows="4" class="input resize-none"
                          placeholder="Notes olfactives, histoire du parfum..."></textarea>
              </div>

              <!-- Tags -->
              <div class="mt-5">
                <label class="block text-muted text-xs uppercase tracking-wider mb-2">Tags olfactifs</label>
                <div class="flex flex-wrap gap-2 mb-3 min-h-[36px]">
                  @for (tag of tags; track tag) {
                    <span class="flex items-center gap-1.5 bg-gold/15 border border-gold/30
                                 text-gold text-xs px-3 py-1.5 rounded-full">
                      {{ tag }}
                      <button type="button" (click)="removeTag(tag)"
                              class="hover:text-white transition-colors leading-none">×</button>
                    </span>
                  }
                </div>
                <div class="flex gap-2">
                  <input type="text" [(ngModel)]="tagInput" [ngModelOptions]="{standalone:true}"
                         (keydown.enter)="addTag($event)"
                         class="input max-w-xs py-2 text-sm"
                         placeholder="oud, floral, oriental... + Entrée">
                  <button type="button" (click)="addTag()"
                          class="px-4 py-2 bg-surface-2 border border-muted/20 rounded text-sm
                                 text-text hover:border-gold transition-colors">
                    Ajouter
                  </button>
                </div>
              </div>
            </div>

            <!-- ── Section 2: Variants ── -->
            <div class="section-card bg-surface rounded-xl p-7 border border-muted/10" style="animation-delay:.1s">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-gold font-semibold text-base flex items-center gap-2">
                  <span class="w-6 h-6 bg-gold/20 rounded flex items-center justify-center text-gold text-xs">2</span>
                  Variantes (volumes & prix)
                </h2>
                <button type="button" (click)="addVariant()"
                        class="flex items-center gap-2 text-gold text-sm border border-gold/30
                               px-4 py-2 rounded-full hover:bg-gold/10 transition-all">
                  + Ajouter
                </button>
              </div>

              <div formArrayName="variants" class="space-y-3">
                @if (variantsArray.length === 0) {
                  <div class="text-center py-8 border border-dashed border-muted/20 rounded-lg">
                    <p class="text-muted text-sm">Aucune variante — cliquez "Ajouter"</p>
                  </div>
                }
                @for (v of variantsArray.controls; track v; let i = $index) {
                  <div [formGroupName]="i"
                       class="grid grid-cols-3 gap-4 bg-surface-2 p-4 rounded-lg border border-muted/10
                              hover:border-muted/30 transition-colors items-end">
                    <div>
                      <label class="block text-muted text-xs mb-1">Volume (ml)</label>
                      <div class="relative">
                        <input type="number" formControlName="volumeMl" class="input py-2 pr-10"
                               placeholder="100">
                        <span class="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-xs">ml</span>
                      </div>
                    </div>
                    <div>
                      <label class="block text-muted text-xs mb-1">Prix</label>
                      <div class="relative">
                        <input type="number" formControlName="price" class="input py-2 pr-12"
                               placeholder="8500">
                        <span class="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-xs">TND</span>
                      </div>
                    </div>
                    <div class="flex gap-2 items-end">
                      <div class="flex-1">
                        <label class="block text-muted text-xs mb-1">Stock</label>
                        <input type="number" formControlName="stockQuantity" class="input py-2"
                               placeholder="20">
                      </div>
                      <button type="button" (click)="removeVariant(i)"
                              class="mb-0.5 w-9 h-9 flex items-center justify-center rounded-lg
                                     bg-danger/10 text-danger hover:bg-danger hover:text-white transition-all">
                        ✕
                      </button>
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- ── Section 3: Images ── -->
            <div class="section-card bg-surface rounded-xl p-7 border border-muted/10" style="animation-delay:.15s">
              <h2 class="text-gold font-semibold text-base mb-6 flex items-center gap-2">
                <span class="w-6 h-6 bg-gold/20 rounded flex items-center justify-center text-gold text-xs">3</span>
                Images du produit
              </h2>

              <!-- Existing Images Grid -->
              @if (product && product.images.length > 0) {
                <div class="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-5">
                  @for (img of product.images; track img.id) {
                    <div class="img-preview relative group aspect-square rounded-lg overflow-hidden bg-surface-2 cursor-pointer">
                      <img [src]="img.imageUrl" [alt]="'Image'" class="w-full h-full object-cover">

                      <!-- Primary badge -->
                      @if (img.isPrimary) {
                        <div class="absolute top-1.5 left-1.5 bg-gold text-bg text-[10px]
                                    font-bold px-1.5 py-0.5 rounded">
                          ★ Principale
                        </div>
                      }

                      <!-- Overlay actions -->
                      <div class="img-overlay absolute inset-0 bg-black/60 opacity-0
                                  transition-opacity duration-200 flex flex-col items-center justify-center gap-2">
                        @if (!img.isPrimary) {
                          <button type="button" (click)="setPrimary(img)"
                                  class="text-xs bg-gold text-bg px-3 py-1 rounded-full font-medium
                                         hover:bg-gold-hover transition-colors">
                            ★ Principale
                          </button>
                        }
                        <button type="button" (click)="deleteExistingImage(img)"
                                class="text-xs bg-danger text-white px-3 py-1 rounded-full
                                       hover:bg-red-600 transition-colors">
                          Supprimer
                        </button>
                      </div>
                    </div>
                  }
                </div>
              }

              <!-- Drop Zone -->
              <div #dropZone
                   class="border-2 border-dashed border-muted/30 rounded-xl p-10
                          text-center transition-all duration-300 cursor-pointer
                          hover:border-gold/50 hover:bg-gold/5"
                   (click)="fileInput.click()"
                   (dragover)="onDragOver($event)"
                   (dragleave)="onDragLeave($event)"
                   (drop)="onFileDrop($event)">
                <div class="flex flex-col items-center gap-3">
                  <div class="w-14 h-14 rounded-full bg-surface-2 flex items-center justify-center">
                    <svg class="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-text font-medium">Glissez vos images ici</p>
                    <p class="text-muted text-sm mt-1">ou cliquez pour parcourir</p>
                  </div>
                  <p class="text-muted text-xs">JPG · PNG · WebP — max 5MB par fichier</p>
                </div>
                <input #fileInput type="file" multiple accept="image/jpeg,image/png,image/webp"
                       class="hidden" (change)="onFileSelect($event)">
              </div>

              <!-- New Files Preview -->
              @if (filePreviews.length > 0) {
                <div class="mt-5">
                  <p class="text-text text-sm font-medium mb-3">
                    {{ filePreviews.length }} fichier(s) sélectionné(s)
                  </p>
                  <div class="grid grid-cols-4 sm:grid-cols-6 gap-3 mb-4">
                    @for (preview of filePreviews; track preview; let idx = $index) {
                      <div class="relative group aspect-square rounded-lg overflow-hidden bg-surface-2">
                        <img [src]="preview" class="w-full h-full object-cover">
                        <button type="button" (click)="removePreview(idx)"
                                class="absolute top-1 right-1 w-5 h-5 bg-danger text-white rounded-full
                                       flex items-center justify-center text-xs opacity-0
                                       group-hover:opacity-100 transition-opacity">
                          ×
                        </button>
                      </div>
                    }
                  </div>

                  @if (isEdit && product) {
                    <button type="button" (click)="uploadImages()" [disabled]="uploading"
                            class="flex items-center gap-2 bg-gold/10 border border-gold/40 text-gold
                                   px-5 py-2.5 rounded-full text-sm hover:bg-gold/20 transition-all
                                   disabled:opacity-50">
                      @if (uploading) {
                        <span class="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin"></span>
                        Upload en cours...
                      } @else {
                        ↑ Uploader {{ filePreviews.length }} image(s)
                      }
                    </button>
                  } @else {
                    <p class="text-muted text-xs">
                      💡 Les images seront uploadées après la sauvegarde du produit
                    </p>
                  }
                </div>
              }
            </div>

            <!-- ── Section 4: Settings ── -->
            <div class="section-card bg-surface rounded-xl p-7 border border-muted/10" style="animation-delay:.2s">
              <h2 class="text-gold font-semibold text-base mb-6 flex items-center gap-2">
                <span class="w-6 h-6 bg-gold/20 rounded flex items-center justify-center text-gold text-xs">4</span>
                Paramètres de publication
              </h2>
              <div class="flex flex-col sm:flex-row gap-5">
                <!-- Featured toggle -->
                <div class="flex items-center justify-between flex-1 bg-surface-2 p-4 rounded-lg border border-muted/10">
                  <div>
                    <p class="text-text font-medium text-sm">Produit vedette</p>
                    <p class="text-muted text-xs mt-0.5">Affiché sur la page d'accueil</p>
                  </div>
                  <button type="button"
                          (click)="productForm.get('isFeatured')!.setValue(!productForm.get('isFeatured')!.value)"
                          [ngClass]="productForm.get('isFeatured')?.value ? 'bg-gold' : 'bg-surface-2 border border-muted/30'"
                          class="relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none">
                    <span [class.translate-x-6]="productForm.get('isFeatured')?.value"
                          [class.translate-x-1]="!productForm.get('isFeatured')?.value"
                          class="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 block">
                    </span>
                  </button>
                </div>
                <!-- Published toggle -->
                <div class="flex items-center justify-between flex-1 bg-surface-2 p-4 rounded-lg border border-muted/10">
                  <div>
                    <p class="text-text font-medium text-sm">Publié</p>
                    <p class="text-muted text-xs mt-0.5">Visible dans le catalogue client</p>
                  </div>
                  <button type="button"
                          (click)="productForm.get('isPublished')!.setValue(!productForm.get('isPublished')!.value)"
                          [ngClass]="productForm.get('isPublished')?.value ? 'bg-success' : 'bg-surface-2 border border-muted/30'"
                          class="relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none">
                    <span [class.translate-x-6]="productForm.get('isPublished')?.value"
                          [class.translate-x-1]="!productForm.get('isPublished')?.value"
                          class="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 block">
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <!-- ── Save Button ── -->
            <div class="flex flex-col items-end gap-2 pt-2">
              <div class="flex items-center gap-4">
                <a routerLink="/admin/produits"
                   class="px-6 py-3 text-muted hover:text-text transition-colors text-sm">
                  Annuler
                </a>
                <button type="submit" [disabled]="productForm.invalid || saving || variantsArray.length === 0"
                        class="relative flex items-center gap-3 bg-gold hover:bg-gold-hover
                               text-bg font-semibold px-8 py-3 rounded-full
                               transition-all duration-300 shadow-lg shadow-gold/20
                               disabled:opacity-50 disabled:cursor-not-allowed
                               hover:shadow-gold/40 hover:-translate-y-0.5">
                  @if (saving) {
                    <span class="w-4 h-4 border-2 border-bg border-t-transparent rounded-full animate-spin"></span>
                    Enregistrement...
                  } @else {
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    {{ isEdit ? 'Mettre à jour' : 'Créer le produit' }}
                  }
                </button>
              </div>
              @if (productForm.invalid || variantsArray.length === 0) {
                <p class="text-danger text-xs mt-1">
                  Veuillez remplir tous les champs obligatoires (Nom, Marque, Genre) et ajouter au moins une variante (Prix).
                </p>
              }
            </div>

          </form>
        }
      </div>
    </div>
  `
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;
  product: Product | null = null;
  isEdit = false;
  saving = false;
  formLoading = false;
  uploading = false;
  tags: string[] = [];
  tagInput = '';
  selectedFiles: File[] = [];
  filePreviews: string[] = [];
  isDragging = false;

  genderOptions = [
    { value: 'HOMME', label: '♂ Homme' },
    { value: 'FEMME', label: '♀ Femme' },
    { value: 'MIXTE', label: '⚥ Mixte' }
  ];

  categoryOptions = [
    { value: 'PARFUM', label: 'Parfum' },
    { value: 'COSMETIQUE', label: 'Cosmétique' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.initForm();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.formLoading = true;
      this.productService.getProductById(+id).subscribe({
        next: (p) => {
          this.product = p;
          this.tags = [...p.tags];
          this.productForm.patchValue({
            name: p.name, brand: p.brand, description: p.description,
            gender: p.gender, category: p.category, isFeatured: p.isFeatured, isPublished: p.isPublished
          });
          p.variants.forEach(v => {
            this.variantsArray.push(this.fb.group({
              volumeMl: [v.volumeMl, Validators.required],
              price: [v.price, Validators.required],
              stockQuantity: [v.stockQuantity, Validators.required]
            }));
          });
          this.formLoading = false;
        },
        error: () => { this.formLoading = false; }
      });
    }
  }

  initForm(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      brand: ['', Validators.required],
      description: [''],
      gender: ['', Validators.required],
      category: ['PARFUM', Validators.required],
      isFeatured: [false],
      isPublished: [true],   // Publié par défaut
      variants: this.fb.array([])
    });
  }

  get f() { return this.productForm.controls; }
  get variantsArray() { return this.productForm.get('variants') as FormArray; }

  addVariant(): void {
    this.variantsArray.push(this.fb.group({
      volumeMl: [0, Validators.required],
      price: ['', Validators.required],
      stockQuantity: [0, Validators.required]
    }));
  }

  removeVariant(i: number): void { this.variantsArray.removeAt(i); }

  addTag(event?: any): void {
    if (event) event.preventDefault();
    const t = this.tagInput.trim().toLowerCase();
    if (t && !this.tags.includes(t)) this.tags.push(t);
    this.tagInput = '';
  }

  removeTag(tag: string): void { this.tags = this.tags.filter(t => t !== tag); }

  onDragOver(e: DragEvent): void {
    e.preventDefault();
    (e.currentTarget as HTMLElement).classList.add('drag-over');
  }

  onDragLeave(e: DragEvent): void {
    (e.currentTarget as HTMLElement).classList.remove('drag-over');
  }

  onFileDrop(e: DragEvent): void {
    e.preventDefault();
    (e.currentTarget as HTMLElement).classList.remove('drag-over');
    if (e.dataTransfer?.files) this.previewFiles(Array.from(e.dataTransfer.files));
  }

  onFileSelect(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input.files) this.previewFiles(Array.from(input.files));
    input.value = '';
  }

  previewFiles(files: File[]): void {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    files.forEach(file => {
      if (!allowed.includes(file.type)) {
        this.toastService.error(`${file.name}: format non supporté`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        this.toastService.error(`${file.name}: fichier trop volumineux (max 5MB)`);
        return;
      }
      this.selectedFiles.push(file);
      const reader = new FileReader();
      reader.onload = (ev) => this.filePreviews.push(ev.target?.result as string);
      reader.readAsDataURL(file);
    });
  }

  removePreview(i: number): void {
    this.selectedFiles.splice(i, 1);
    this.filePreviews.splice(i, 1);
  }

  uploadImages(): void {
    if (!this.product || this.selectedFiles.length === 0) return;
    this.uploading = true;
    this.productService.uploadImages(this.product.id, this.selectedFiles).subscribe({
      next: () => {
        this.toastService.success(`${this.selectedFiles.length} image(s) uploadée(s) !`);
        this.selectedFiles = [];
        this.filePreviews = [];
        this.uploading = false;
        this.productService.getProductById(this.product!.id).subscribe(p => {
          this.product = p;
        });
      },
      error: (err) => {
        this.uploading = false;
        this.toastService.error(err?.error?.error || 'Erreur lors de l\'upload');
      }
    });
  }

  setPrimary(img: ProductImage): void {
    if (!this.product) return;
    this.productService.setPrimaryImage(this.product.id, img.id).subscribe({
      next: () => {
        this.product!.images.forEach(i => i.isPrimary = i.id === img.id);
        this.toastService.success('Image principale définie');
      }
    });
  }

  deleteExistingImage(img: ProductImage): void {
    if (!this.product) return;
    this.productService.deleteImage(this.product.id, img.id).subscribe({
      next: () => {
        this.product!.images = this.product!.images.filter(i => i.id !== img.id);
        this.toastService.success('Image supprimée');
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) { this.productForm.markAllAsTouched(); return; }
    this.saving = true;

    const request = { ...this.productForm.value, tags: this.tags };

    const obs = this.isEdit && this.product
      ? this.productService.updateProduct(this.product.id, request)
      : this.productService.createProduct(request);

    obs.subscribe({
      next: (saved) => {
        this.saving = false;
        if (!this.isEdit && this.selectedFiles.length > 0) {
          // Upload images after product creation
          this.productService.uploadImages(saved.id, this.selectedFiles).subscribe({
            next: () => {
              this.toastService.success('Produit créé avec images !');
              this.router.navigate(['/admin/produits', saved.id, 'edit']);
            },
            error: () => {
              this.toastService.info('Produit créé — images non uploadées');
              this.router.navigate(['/admin/produits', saved.id, 'edit']);
            }
          });
        } else {
          this.toastService.success(this.isEdit ? 'Produit mis à jour !' : 'Produit créé !');
          this.router.navigate(['/admin/produits', saved.id, 'edit']);
        }
      },
      error: () => { this.saving = false; }
    });
  }
}
