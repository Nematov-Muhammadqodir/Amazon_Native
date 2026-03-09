import { GET_ALL_USERS } from "@/apollo/user/query";
import { Member } from "@/types/member/member";
import { useQuery } from "@apollo/client/react";

interface UsersInterface {
  getAllUsers: Member[];
}

export function useUsers() {
  const {
    loading: getUsersLoading,
    data: getUsersData,
    error: getUsersError,
    refetch: getUsersRefetch,
  } = useQuery<UsersInterface>(GET_ALL_USERS, {
    fetchPolicy: "network-only",
  });

  return {
    getUsersLoading,
    getUsersData,
    getUsersError,
    getUsersRefetch,
  };
}
