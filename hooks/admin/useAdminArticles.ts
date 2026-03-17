import { useQuery, useMutation } from "@apollo/client/react";
import { GET_ALL_BOARD_ARTICLES_BY_ADMIN } from "@/apollo/admin/query";
import {
  UPDATE_BOARD_ARTICLE_BY_ADMIN,
  REMOVE_BOARD_ARTICLE_BY_ADMIN,
  REMOVE_COMMENT_BY_ADMIN,
} from "@/apollo/admin/mutation";

export function useAdminArticles(input: {
  page: number;
  limit: number;
  sort?: string;
  direction?: string;
  search: {
    articleStatus?: string;
    articleCategory?: string;
  };
}) {
  const { data, loading, error, refetch } = useQuery<any>(
    GET_ALL_BOARD_ARTICLES_BY_ADMIN,
    {
      variables: { input },
      fetchPolicy: "network-only",
    }
  );

  const [updateArticle] = useMutation<any>(UPDATE_BOARD_ARTICLE_BY_ADMIN);
  const [removeArticle] = useMutation<any>(REMOVE_BOARD_ARTICLE_BY_ADMIN);
  const [removeComment] = useMutation<any>(REMOVE_COMMENT_BY_ADMIN);

  return {
    articles: data?.getAllBoardArticlesByAdmin?.list ?? [],
    total: data?.getAllBoardArticlesByAdmin?.metaCounter?.total ?? 0,
    loading,
    error,
    refetch,
    updateArticleByAdmin: async (articleInput: any) => {
      const result = await updateArticle({
        variables: { input: articleInput },
      });
      return result.data?.updateBoardArticleByAdmin;
    },
    removeArticleByAdmin: async (articleId: string) => {
      const result = await removeArticle({
        variables: { input: articleId },
      });
      return result.data?.removeBoardArticleByAdmin;
    },
    removeCommentByAdmin: async (commentId: string) => {
      const result = await removeComment({
        variables: { input: commentId },
      });
      return result.data?.removeCommentByAdmin;
    },
  };
}
