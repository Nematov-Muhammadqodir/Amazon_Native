import { LIKE_TARGET_PRODUCT } from "@/apollo/user/mutation";
import { useMutation } from "@apollo/client/react";

export function useLikeProduct() {
  const [likeTargetProduct, { loading, error }] = useMutation(LIKE_TARGET_PRODUCT);

  return { likeTargetProduct, likeLoading: loading, likeError: error };
}