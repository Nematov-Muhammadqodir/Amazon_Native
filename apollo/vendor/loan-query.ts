import { gql } from "@apollo/client";

export const GET_INCOMING_REQUESTS = gql`
  query GetIncomingRequests($input: BorrowRequestsInquiry!) {
    getIncomingRequests(input: $input) {
      list {
        _id
        requesterId
        targetVendorId
        productName
        quantity
        unit
        unitPrice
        status
        loanId
        message
        createdAt
        requesterData {
          _id
          memberNick
          memberImage
          memberAddress
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_MY_REQUESTS = gql`
  query GetMyRequests($input: BorrowRequestsInquiry!) {
    getMyRequests(input: $input) {
      list {
        _id
        requesterId
        targetVendorId
        productName
        quantity
        unit
        unitPrice
        status
        loanId
        message
        createdAt
        targetVendorData {
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

export const GET_MY_LOANS = gql`
  query GetMyLoans($input: LoansInquiry!) {
    getMyLoans(input: $input) {
      list {
        _id
        lenderId
        borrowerId
        loanDate
        status
        items {
          productName
          quantity
          unit
          unitPrice
          totalPrice
          approvedAt
        }
        totalAmount
        paidAt
        memo
        createdAt
        lenderData {
          _id
          memberNick
          memberImage
          memberAddress
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_GIVEN_LOANS = gql`
  query GetGivenLoans($input: LoansInquiry!) {
    getGivenLoans(input: $input) {
      list {
        _id
        lenderId
        borrowerId
        loanDate
        status
        items {
          productName
          quantity
          unit
          unitPrice
          totalPrice
          approvedAt
        }
        totalAmount
        paidAt
        memo
        createdAt
        borrowerData {
          _id
          memberNick
          memberImage
          memberAddress
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_VENDOR_FRIDGE = gql`
  query GetVendorFridge($vendorId: String!, $input: FridgeItemsInquiry!) {
    getVendorFridge(vendorId: $vendorId, input: $input) {
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
