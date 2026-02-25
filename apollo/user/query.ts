import { gql } from "@apollo/client";

export const CHECK_AUTH = gql`
  query CheckAuth {
    checkAuth
  }
`;

/**************************
 *        PRODUCT        *
 *************************/

export const GET_PRODUCTS = gql`
  query GetProducts($input: ProductsInquiry!) {
    getProducts(input: $input) {
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
        productDiscountRate
        productLeftCount
        productSoldCount
        productOrigin
        productImages
        productDesc
        productOwnerId
        deletedAt
        createdAt
        updatedAt
        productOwnerData {
          _id
          memberPhone
          memberNick
          memberFullName
          memberImage
          memberAddress
        }
        meLiked {
          memberId
          likeRefId
          myFavorite
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($input: String!) {
    getProduct(productId: $input) {
      _id
      productCollection
      productStatus
      productName
      productPrice
      productViews
      productLikes
      productComments
      productRank
      productImages
      productDesc
      productOwnerId
      deletedAt
      createdAt
      updatedAt
      productOriginPrice
      productVolume
      productLeftCount
      productSoldCount
      productOrigin
      productDiscountRate
      productOwnerData {
        _id
        memberPhone
        memberNick
        memberFullName
        memberImage
        memberAddress
      }
      meLiked {
        memberId
        likeRefId
        myFavorite
      }
    }
  }
`;
