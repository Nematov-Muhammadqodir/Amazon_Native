import { ProductCollection, ProductStatus } from "@/libs/enums/product.enum";
import { Member } from "../member/member";

export interface MeLiked {
  memberId: string;
  likeRefId: string;
  myFavorite: boolean;
}

export interface TotalCounter {
  total: number;
}
export interface Product {
  _id: string;
  productCollection: ProductCollection;
  productStatus: ProductStatus;
  productName: string;
  productPrice: string;
  productOriginPrice?: string;
  productViews: number;
  productLikes: number;
  productComments: number;
  productRank: number;
  productVolume: number;
  productLeftCount: number;
  productSoldCount: number;
  productOrigin: string;
  productDiscountRate: number;
  productImages: string[];
  productDesc?: string;
  productOwnerId: string;
  deletedAt?: Date;
  // from aggregation
  productOwnerData?: Member;
  //================
  createdAt: Date;
  updatedAt: Date;
  accessToken: any;
  // From Aggregation
  meLiked?: MeLiked[];
}

export interface Products {
  list: Product[];

  metaCounter?: TotalCounter[];
}
