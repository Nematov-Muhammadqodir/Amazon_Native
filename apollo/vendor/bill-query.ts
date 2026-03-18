import { gql } from "@apollo/client";

export const GET_BILLS = gql`
  query GetBills($input: BillsInquiry!) {
    getBills(input: $input) {
      list {
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
      metaCounter {
        total
      }
    }
  }
`;

export const GET_BILL = gql`
  query GetBill($billId: String!) {
    getBill(billId: $billId) {
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
