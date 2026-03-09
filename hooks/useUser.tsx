import { GET_MEMBER } from "@/apollo/user/query";
import { Member } from "@/types/member/member";
import { useQuery } from "@apollo/client/react";

interface UserDetailInterface {
  getMember: Member;
}

export function useUser(memberId?: string) {
  const {
    loading: getUserLoading,
    data: getUserData,
    error: getUserError,
    refetch: getUserRefetch,
  } = useQuery<UserDetailInterface>(GET_MEMBER, {
    fetchPolicy: "network-only",
    variables: { input: memberId },
    skip: !memberId,
  });

  return {
    getUserLoading,
    getUserData,
    getUserError,
    getUserRefetch,
  };
}
