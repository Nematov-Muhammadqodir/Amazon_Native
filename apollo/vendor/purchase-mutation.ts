import { gql } from "@apollo/client";

export const CREATE_PURCHASE = gql`
  mutation CreatePurchase($input: PurchaseInput!) {
    createPurchase(input: $input) {
      _id
      memberId
      purchaseDate
      productName
      productCollection
      quantity
      unit
      unitCost
      totalCost
      memo
      createdAt
      updatedAt
    }
  }
`;
