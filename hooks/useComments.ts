import { GET_COMMENTS } from "@/apollo/user/query";
import { Comments } from "@/types/comment/comment";
import { CommentsInquiry } from "@/types/comment/comment.input";
import { useQuery } from "@apollo/client/react";

interface GetCommentsResponse {
  getComments: Comments;
}

export function useComments(input: CommentsInquiry) {
  const {
    loading: getCommentsLoading,
    data: getCommentsData,
    error: getCommentsError,
    refetch: getCommentsRefetch,
  } = useQuery<GetCommentsResponse>(GET_COMMENTS, {
    fetchPolicy: "network-only",
    variables: { input },
    notifyOnNetworkStatusChange: true,
  });

  return {
    getCommentsLoading,
    getCommentsData,
    getCommentsError,
    getCommentsRefetch,
  };
}