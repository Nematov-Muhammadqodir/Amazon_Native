import { gql } from "@apollo/client";

export const GET_PRESET_PRODUCTS = gql`
  query GetPresetProducts {
    getPresetProducts {
      _id
      memberId
      productName
      productCollection
      unit
      defaultUnitCost
      defaultQuantity
      productImages
      productPrice
      productOriginPrice
      productDesc
      productOrigin
      sortOrder
      createdAt
      updatedAt
    }
  }
`;
