import { gql } from "@apollo/client";

export const CHECK_AUTH = gql`
  query CheckAuth {
    checkAuth
  }
`;

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
          memberType
          memberStatus
          memberAuthType
          memberPhone
          memberNick
          memberFullName
          memberImage
          memberAddress
          memberDesc
          memberProducts
          memberArticles
          memberFollowers
          memberFollowings
          memberPoints
          memberLikes
          memberViews
          memberComments
          memberRank
          memberWarnings
          memberBlocks
          deletedAt
          createdAt
          updatedAt
          accessToken
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
