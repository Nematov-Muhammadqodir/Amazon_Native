import { gql } from "@apollo/client";

export const ASK_VENDOR_AI_AGENT = gql`
  mutation AskVendorAiAgent($question: String!) {
    askVendorAiAgent(question: $question)
  }
`;
