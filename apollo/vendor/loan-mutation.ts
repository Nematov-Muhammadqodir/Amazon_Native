import { gql } from "@apollo/client";

export const CREATE_BORROW_REQUEST = gql`
  mutation CreateBorrowRequest($input: BorrowRequestInput!) {
    createBorrowRequest(input: $input) {
      _id
      requesterId
      targetVendorId
      productName
      quantity
      unit
      unitPrice
      status
      message
      createdAt
    }
  }
`;

export const APPROVE_BORROW_REQUEST = gql`
  mutation ApproveBorrowRequest($requestId: String!) {
    approveBorrowRequest(requestId: $requestId) {
      _id
      status
      loanId
    }
  }
`;

export const REJECT_BORROW_REQUEST = gql`
  mutation RejectBorrowRequest($requestId: String!) {
    rejectBorrowRequest(requestId: $requestId) {
      _id
      status
    }
  }
`;

export const MARK_LOAN_PAID = gql`
  mutation MarkLoanPaid($loanId: String!) {
    markLoanPaid(loanId: $loanId) {
      _id
      status
      paidAt
    }
  }
`;
