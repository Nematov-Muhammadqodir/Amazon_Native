import { gql } from "@apollo/client";

export const GET_FRIDGE_ITEMS = gql`
  query GetFridgeItems($input: FridgeItemsInquiry!) {
    getFridgeItems(input: $input) {
      list {
        _id
        memberId
        productName
        productCollection
        itemStatus
        currentStock
        unit
        memo
        createdAt
        updatedAt
      }
      metaCounter {
        total
      }
    }
  }
`;
