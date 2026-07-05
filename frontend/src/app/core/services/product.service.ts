import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product, ProductRequest } from '../models/product.model';

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/api/products`;
  private adminUrl = `${environment.apiUrl}/api/admin/products`;

  constructor(private http: HttpClient) {}

  // Public endpoints
  getProducts(params?: {
    gender?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    size?: number;
  }): Observable<PageResponse<Product>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }
    return this.http.get<PageResponse<Product>>(this.apiUrl, { params: httpParams });
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/featured`);
  }

  searchProducts(query: string, page = 0, size = 12): Observable<PageResponse<Product>> {
    const params = new HttpParams()
      .set('q', query)
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PageResponse<Product>>(`${this.apiUrl}/search`, { params });
  }


  // Admin endpoints
  getAllProducts(page = 0, size = 20): Observable<PageResponse<Product>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PageResponse<Product>>(this.adminUrl, { params });
  }

  createProduct(product: ProductRequest): Observable<Product> {
    return this.http.post<Product>(this.adminUrl, product);
  }

  updateProduct(id: number, product: ProductRequest): Observable<Product> {
    return this.http.put<Product>(`${this.adminUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminUrl}/${id}`);
  }

  togglePublished(id: number): Observable<void> {
    return this.http.patch<void>(`${this.adminUrl}/${id}/publish`, {});
  }

  toggleFeatured(id: number): Observable<void> {
    return this.http.patch<void>(`${this.adminUrl}/${id}/featured`, {});
  }

  uploadImages(productId: number, files: File[]): Observable<string[]> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    return this.http.post<string[]>(`${this.adminUrl}/${productId}/images`, formData);
  }

  deleteImage(productId: number, imageId: number): Observable<void> {
    return this.http.delete<void>(`${this.adminUrl}/${productId}/images/${imageId}`);
  }

  setPrimaryImage(productId: number, imageId: number): Observable<void> {
    return this.http.patch<void>(`${this.adminUrl}/${productId}/images/${imageId}/primary`, {});
  }
}
