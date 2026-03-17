import { gql } from "@apollo/client";

export const ASK_AI_AGENT = gql`
  query AskAiAgent($question: String!) {
    askAiAgent(question: $question)
  }
`;
