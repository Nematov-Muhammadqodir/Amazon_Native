import { useQuery, useMutation } from "@apollo/client/react";
import { GET_ALL_NOTICES_BY_ADMIN } from "@/apollo/admin/query";
import { CREATE_NOTICE, UPDATE_NOTICE } from "@/apollo/admin/mutation";

export function useAdminNotices() {
  const { data, loading, error, refetch } = useQuery<any>(
    GET_ALL_NOTICES_BY_ADMIN,
    {
      fetchPolicy: "network-only",
    }
  );

  const [createNoticeMutation] = useMutation<any>(CREATE_NOTICE);
  const [updateNoticeMutation] = useMutation<any>(UPDATE_NOTICE);

  return {
    notices: data?.getAllNoticesByAdmin ?? [],
    loading,
    error,
    refetch,
    createNotice: async (input: any) => {
      const result = await createNoticeMutation({
        variables: { input },
      });
      return result.data?.createNotice;
    },
    updateNotice: async (input: any) => {
      const result = await updateNoticeMutation({
        variables: { input },
      });
      return result.data?.updateNotice;
    },
  };
}
