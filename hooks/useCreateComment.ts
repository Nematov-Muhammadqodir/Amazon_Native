import { CREATE_COMMENT } from "@/apollo/user/mutation";
import { useMutation } from "@apollo/client/react";

export function useCreateComment() {
  const [createComment, { loading, error }] = useMutation(CREATE_COMMENT);

  return { createComment, createCommentLoading: loading, createCommentError: error };
}