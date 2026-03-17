import { useQuery, useMutation } from "@apollo/client/react";
import {
  GET_ALL_ORDERS_BY_ADMIN,
  GET_ALL_ORDER_ITEMS_BY_ADMIN,
} from "@/apollo/admin/query";
import { UPDATE_ORDER_BY_ADMIN } from "@/apollo/admin/mutation";

export function useAdminOrders(input: {
  page: number;
  limit: number;
  search: {
    orderStatus?: string;
  };
}) {
  const { data, loading, error, refetch } = useQuery<any>(
    GET_ALL_ORDERS_BY_ADMIN,
    {
      variables: { input },
      fetchPolicy: "network-only",
    }
  );

  const [updateOrder] = useMutation<any>(UPDATE_ORDER_BY_ADMIN);

  return {
    orders: data?.getAllOrdersByAdmin?.list ?? [],
    total: data?.getAllOrdersByAdmin?.metaCounter?.total ?? 0,
    loading,
    error,
    refetch,
    updateOrderByAdmin: async (orderInput: any) => {
      const result = await updateOrder({
        variables: { input: orderInput },
      });
      return result.data?.updateOrderByAdmin;
    },
  };
}

export function useAdminOrderItems(orderId: string) {
  const { data, loading, error } = useQuery<any>(GET_ALL_ORDER_ITEMS_BY_ADMIN, {
    variables: { input: orderId },
    skip: !orderId,
    fetchPolicy: "network-only",
  });

  return {
    orderItems: data?.getAllOrderItemsByAdmin ?? [],
    loading,
    error,
  };
}
