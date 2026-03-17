import { gql } from "@apollo/client";

export const GET_ALL_MEMBERS_BY_ADMIN = gql`
  query GetAllMembersByAdmin($input: MembersInquiry!) {
    getAllMembersByAdmin(input: $input) {
      list {
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
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_ALL_PRODUCTS_BY_ADMIN = gql`
  query GetAllProductsByAdmin($input: AllProductsInquery!) {
    getAllProductsByAdmin(input: $input) {
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
        productOwnerData {
          _id
          memberNick
          memberImage
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_ALL_ORDERS_BY_ADMIN = gql`
  query GetAllOrdersByAdmin($input: OrderInquery!) {
    getAllOrdersByAdmin(input: $input) {
      list {
        _id
        orderStatus
        orderTotal
        orderQuantity
        memberId
        createdAt
        updatedAt
        memberData {
          _id
          memberNick
          memberImage
          memberPhone
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_ALL_ORDER_ITEMS_BY_ADMIN = gql`
  query GetAllOrderItemsByAdmin($input: String!) {
    getAllOrderItemsByAdmin(orderId: $input) {
      _id
      itemQuantity
      itemPrice
      orderId
      productId
      createdAt
      updatedAt
      productData {
        _id
        productName
        productImages
        productPrice
      }
    }
  }
`;

export const GET_ALL_NOTICES_BY_ADMIN = gql`
  query GetAllNoticesByAdmin {
    getAllNoticesByAdmin {
      _id
      noticeCategory
      noticeStatus
      noticeTitle
      noticeContent
      noticeFor
      memberId
      createdAt
      updatedAt
    }
  }
`;

export const GET_ALL_BOARD_ARTICLES_BY_ADMIN = gql`
  query GetAllBoardArticlesByAdmin($input: AllBoardArticlesInquiry!) {
    getAllBoardArticlesByAdmin(input: $input) {
      list {
        _id
        articleCategory
        articleStatus
        articleTitle
        articleContent
        articleImage
        articleViews
        articleLikes
        articleComments
        memberId
        createdAt
        updatedAt
        memberData {
          _id
          memberNick
          memberImage
        }
      }
      metaCounter {
        total
      }
    }
  }
`;
