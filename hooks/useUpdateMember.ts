import { UPDATE_MEMBER } from "@/apollo/user/mutation";
import { useMutation } from "@apollo/client/react";

interface UpdateMemberResponse {
  updateMember: {
    accessToken: string;
  };
}

export function useUpdateMember() {
  const [updateMember, { loading, error }] = useMutation<UpdateMemberResponse>(UPDATE_MEMBER);

  return { updateMember, updateMemberLoading: loading, updateMemberError: error };
}