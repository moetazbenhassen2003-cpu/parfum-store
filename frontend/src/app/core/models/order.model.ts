import { User } from './user.model';

export interface Order {
  id: number;
  client: User;
  totalPrice: number;
  status: OrderStatus;
  note?: string;
  deliveryFullName: string;
  deliveryPhone: string;
  deliveryWilaya: string;
  deliveryCity: string;
  deliveryStreet: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export type OrderStatus = 'EN_ATTENTE' | 'CONFIRMEE' | 'EN_LIVRAISON' | 'LIVREE' | 'ANNULEE';

export interface OrderItem {
  id: number;
  productName: string;
  productBrand: string;
  productImageUrl?: string;
  volumeMl: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderRequest {
  items: OrderItemRequest[];
  deliveryFullName: string;
  deliveryPhone: string;
  deliveryWilaya: string;
  deliveryCity: string;
  deliveryStreet: string;
  note?: string;
}

export interface OrderItemRequest {
  productVariantId: number;
  quantity: number;
}

export interface DashboardStats {
  todayOrdersCount: number;
  weekRevenue: number;
  pendingOrdersCount: number;
  lowStockProductsCount: number;
}
