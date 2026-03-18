import { gql } from "@apollo/client";

export const CREATE_BILL = gql`
  mutation CreateBill($input: BillInput!) {
    createBill(input: $input) {
      _id
      memberId
      vendorName
      customerName
      items {
        productName
        quantity
        unit
        unitPrice
        totalPrice
      }
      totalAmount
      billStatus
      memo
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_BILL = gql`
  mutation DeleteBill($billId: String!) {
    deleteBill(billId: $billId) {
      _id
      billStatus
    }
  }
`;
