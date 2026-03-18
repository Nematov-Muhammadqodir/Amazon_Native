import { gql } from "@apollo/client";

export const GET_PURCHASES = gql`
  query GetPurchases($input: PurchasesInquiry!) {
    getPurchases(input: $input) {
      list {
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
      metaCounter {
        total
      }
    }
  }
`;

export const GET_PURCHASE_SUMMARY = gql`
  query GetPurchaseSummary($input: PurchaseSummaryInput!) {
    getPurchaseSummary(input: $input) {
      items {
        productName
        totalQuantity
        unit
        totalCost
      }
      grandTotal
    }
  }
`;
