import { gql } from "@apollo/client";

export const ADD_FRIDGE_ITEM = gql`
  mutation AddFridgeItem($input: FridgeItemInput!) {
    addFridgeItem(input: $input) {
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
  }
`;

export const RESTOCK_FRIDGE_ITEM = gql`
  mutation RestockFridgeItem($input: FridgeRestockInput!) {
    restockFridgeItem(input: $input) {
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
  }
`;

export const UPDATE_FRIDGE_ITEM = gql`
  mutation UpdateFridgeItem($input: FridgeItemUpdate!) {
    updateFridgeItem(input: $input) {
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
  }
`;

export const DELETE_FRIDGE_ITEM = gql`
  mutation DeleteFridgeItem($input: String!) {
    deleteFridgeItem(fridgeItemId: $input) {
      _id
      itemStatus
    }
  }
`;
