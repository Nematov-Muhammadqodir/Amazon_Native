import {
  ProductCollection,
  ProductFrom,
  ProductStatus,
  ProductVolume,
} from "../../enums/product.enum";

import { Direction } from "../../enums/common.enum";

export interface ProductInput {
  productCollection: ProductCollection;
  productName: string;
  productPrice: number;
  productOriginPrice: number;
  productDiscountRate?: number;
  productOrigin: string;
  productLeftCount: number;
  productVolume?: ProductVolume;
  productImages: string[];
  productDesc?: string;
  productOwnerId?: string;
}

export interface PISearch {
  productOwnerId?: string;
  productCollection?: ProductCollection; // not array
  productVolume?: ProductVolume[]; // not array
  productDiscountRate?: number; // not array
  productOrigin?: string[];
  productPrice?: Range;
  productStatus?: ProductStatus;
  text?: string;
}

export interface ProductsInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: Direction;
  search: PISearch;
}

export interface OrdinaryInquery {
  page: number;
  limit: number;
}

export interface VPISearch {
  productStatus?: ProductStatus;
}

export interface VendorProductsInquery {
  page: number;
  limit: number;
  sort?: string;
  direction?: Direction;
  search: VPISearch;
}

interface ALPISearch {
  productStatus?: ProductStatus;
  //* Bu orqali biz harqanday turdagi Propertilarni olish imkoni bermoqdamiz ==> DELETE => ACTIVE => SOLD
  productFromList?: ProductFrom[];
}

export interface AllProductsInquery {
  page: number;
  limit: number;
  sort?: string;
  direction?: Direction;
  search: ALPISearch;
}

interface Range {
  start: number;
  end: number;
}
