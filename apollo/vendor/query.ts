import { gql } from "@apollo/client";

export const GET_VENDOR_PRODUCTS = gql`
  query GetVendorProducts($input: VendorProductsInquery!) {
    getVendorProducts(input: $input) {
      list {
        _id
        productCollection
        productStatus
        productName
        productPrice
        productOriginPrice
        productViews
        productLikes
        productComments
        productRank
        productVolume
        productLeftCount
        productSoldCount
        productOrigin
        productDiscountRate
        productImages
        productDesc
        productOwnerId
        deletedAt
        createdAt
        updatedAt
      }
      metaCounter {
        total
      }
    }
  }
`;
