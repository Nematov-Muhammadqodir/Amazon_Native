import { GET_BOARD_ARTICLES } from "@/apollo/user/query";
import { BoardArticles } from "@/types/board-article/board-article";
import { useQuery } from "@apollo/client/react";

export interface GetBlogsResponse {
  getBoardArticles: BoardArticles;
}

interface BoardArticlesInput {
  page: number;
  limit: number;
  sort: string;
  direction: string;
  search: Record<string, any>;
}

export function useBoardArticles(input: BoardArticlesInput) {
  const {
    loading: boardArticlesLoading,
    data: boardArticlesData,
    error: boardArticlesError,
    refetch: boardArticlesRefetch,
  } = useQuery<GetBlogsResponse>(GET_BOARD_ARTICLES, {
    fetchPolicy: "network-only",
    variables: { input },
    notifyOnNetworkStatusChange: true,
  });

  return {
    boardArticlesLoading,
    boardArticlesData,
    boardArticlesError,
    boardArticlesRefetch,
  };
}