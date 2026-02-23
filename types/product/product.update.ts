import { ProductCollection, ProductStatus } from "../../enums/product.enum";

export interface ProductUpdate {
  _id: string;
  productStatus?: ProductStatus;
  productCollection?: ProductCollection;
  productName?: string;
  productPrice?: number;
  productOriginPrice?: number;
  productDiscountRate?: number;
  productOrigin?: string;
  productLeftCount?: number;
  productVolume?: number;
  productDesc?: string;
  productImages?: string[];
  productViews?: number;
  soldAt?: Date;
  deletedAt?: Date;
}
