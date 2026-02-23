import { getToken } from "@/libs/auth";
import {
  ApolloClient,
  from,
  HttpLink,
  InMemoryCache,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import fetch from "cross-fetch";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { createClient } from "graphql-ws";

const GRAPHQL_URL = "http://192.168.0.27:3003/graphql";
const WS_URL = "ws://192.168.0.27:3004/graphql";

/* ---------------- HTTP LINK ---------------- */

const httpLink = new HttpLink({
  uri: GRAPHQL_URL,
  fetch,
});

/* ---------------- AUTH LINK ---------------- */

const authLink = setContext(async (_, { headers }) => {
  const token = await getToken();

  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

/* ---------------- ERROR LINK ---------------- */

const errorLink = onError(({ error }) => {
  if (!error) return;

  // GraphQL errors
  if ("errors" in error && Array.isArray(error.errors)) {
    error.errors.forEach((err: any) => {
      console.log("GraphQL error:", err.message);

      if (err.message.includes("Unauthorized")) {
        SecureStore.deleteItemAsync("accessToken");
        router.replace("/(auth)/sign-up");
      }
    });
  }

  // Network errors
  if ("statusCode" in error) {
    console.log("Network error:", error);
  }
});

/* ---------------- WEBSOCKET LINK ---------------- */

const wsLink = new GraphQLWsLink(
  createClient({
    url: WS_URL,
    connectionParams: async () => {
      const token = await getToken();
      return {
        Authorization: token ? `Bearer ${token}` : "",
      };
    },
  })
);

/* ---------------- SPLIT LINK ---------------- */

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

/* ---------------- CLIENT ---------------- */

export const client = new ApolloClient({
  link: from([errorLink, splitLink]),
  cache: new InMemoryCache(),
});
