import { OrderStatus } from "@/libs/enums/order.enum";
import { Product, TotalCounter } from "../product/product";

export interface OrderItemInput {
  itemQuantity: number;
  itemPrice: number;
  productId: string;
  orderId?: string;
}

export interface OrderItem {
  _id: string;
  itemQuantity: number;
  itemPrice: number;
  orderId: string;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItemFromAggregation {
  itemQuantity: number;
  itemPrice: number;
  orderId: string;
  productId: string;
}
export interface Order {
  _id: string;
  orderTotal: number;
  orderDelivery: number;
  orderStatus: OrderStatus;
  memberId: string;
  createdAt: Date;
  updatedAt: Date;
  orderItems: OrderItemFromAggregation[];
  // productData: Product[];
}

export interface Orders {
  list: Order[];
  metaCounter: TotalCounter[];
}

export interface OISearch {
  orderStatus?: OrderStatus;
}

export interface OrderInquery {
  page: number;
  limit: number;
  search: OISearch;
}

export interface OrderUpdateInput {
  orderId: string;
  orderStatus: OrderStatus;
}
