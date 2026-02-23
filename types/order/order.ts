export interface OrderItemInput {
  itemQuantity: number;
  itemPrice: number;
  productId: string;
  orderId?: string;
}

export interface OrderItemsInput {
  ordertItemInputs: OrderItemInput[];
}
