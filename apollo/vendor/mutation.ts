import { gql } from "@apollo/client";

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: ProductInput!) {
    createProduct(input: $input) {
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
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($input: ProductUpdate!) {
    updateProduct(input: $input) {
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
  }
`;
