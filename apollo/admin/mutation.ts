import { gql } from "@apollo/client";

export const UPDATE_MEMBER_BY_ADMIN = gql`
  mutation UpdateMemberByAdmin($input: MemberUpdate!) {
    updateMemberByAdmin(input: $input) {
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
  }
`;

export const UPDATE_PRODUCT_BY_ADMIN = gql`
  mutation UpdateProductByAdmin($input: ProductUpdate!) {
    updateProductByAdmin(input: $input) {
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

export const DELETE_PRODUCT_BY_ADMIN = gql`
  mutation DeleteProductByAdmin($input: String!) {
    deleteProductByAdmin(productId: $input) {
      _id
      productStatus
    }
  }
`;

export const UPDATE_ORDER_BY_ADMIN = gql`
  mutation UpdateOrderByAdmin($input: OrderUpdateInput!) {
    updateOrderByAdmin(input: $input) {
      _id
      orderStatus
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_NOTICE = gql`
  mutation CreateNotice($input: NoticeInput!) {
    createNotice(input: $input) {
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

export const UPDATE_NOTICE = gql`
  mutation UpdateNotice($input: NoticeUpdate!) {
    updateNotice(input: $input) {
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

export const UPDATE_BOARD_ARTICLE_BY_ADMIN = gql`
  mutation UpdateBoardArticleByAdmin($input: BoardArticleUpdate!) {
    updateBoardArticleByAdmin(input: $input) {
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
    }
  }
`;

export const REMOVE_BOARD_ARTICLE_BY_ADMIN = gql`
  mutation RemoveBoardArticleByAdmin($input: String!) {
    removeBoardArticleByAdmin(articleId: $input) {
      _id
      articleStatus
    }
  }
`;

export const REMOVE_COMMENT_BY_ADMIN = gql`
  mutation RemoveCommentByAdmin($input: String!) {
    removeCommentByAdmin(commentId: $input) {
      _id
      commentStatus
    }
  }
`;
