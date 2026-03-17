import { useQuery, useMutation } from "@apollo/client/react";
import { GET_ALL_MEMBERS_BY_ADMIN } from "@/apollo/admin/query";
import { UPDATE_MEMBER_BY_ADMIN } from "@/apollo/admin/mutation";

export function useAdminMembers(input: {
  page: number;
  limit: number;
  sort?: string;
  direction?: string;
  search: {
    memberStatus?: string;
    memberType?: string;
    text?: string;
  };
}) {
  const { data, loading, error, refetch } = useQuery<any>(
    GET_ALL_MEMBERS_BY_ADMIN,
    {
      variables: { input },
      fetchPolicy: "network-only",
    }
  );

  const [updateMemberByAdmin] = useMutation<any>(UPDATE_MEMBER_BY_ADMIN);

  return {
    members: data?.getAllMembersByAdmin?.list ?? [],
    total: data?.getAllMembersByAdmin?.metaCounter?.total ?? 0,
    loading,
    error,
    refetch,
    updateMemberByAdmin: async (memberInput: any) => {
      const result = await updateMemberByAdmin({
        variables: { input: memberInput },
      });
      return result.data?.updateMemberByAdmin;
    },
  };
}
