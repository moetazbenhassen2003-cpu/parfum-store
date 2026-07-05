export interface Product {
  id: number;
  name: string;
  brand: string;
  description?: string;
  gender: 'HOMME' | 'FEMME' | 'MIXTE';
  category: 'PARFUM' | 'COSMETIQUE';
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: string;
  variants: ProductVariant[];
  images: ProductImage[];
  tags: string[];
  minPrice: number;
  primaryImageUrl?: string;
}

export interface ProductVariant {
  id: number;
  volumeMl: number;
  price: number;
  stockQuantity: number;
}

export interface ProductImage {
  id: number;
  imageUrl: string;
  isPrimary: boolean;
}

export interface ProductRequest {
  name: string;
  brand: string;
  description?: string;
  gender: 'HOMME' | 'FEMME' | 'MIXTE';
  category: 'PARFUM' | 'COSMETIQUE';
  isFeatured: boolean;
  isPublished: boolean;
  tags: string[];
  variants: VariantRequest[];
}

export interface VariantRequest {
  volumeMl: number;
  price: number;
  stockQuantity: number;
}
