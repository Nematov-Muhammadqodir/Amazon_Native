import { useQuery, useMutation } from "@apollo/client/react";
import { GET_FRIDGE_ITEMS } from "@/apollo/vendor/fridge-query";
import {
  ADD_FRIDGE_ITEM,
  RESTOCK_FRIDGE_ITEM,
  UPDATE_FRIDGE_ITEM,
  DELETE_FRIDGE_ITEM,
} from "@/apollo/vendor/fridge-mutation";

export function useFridge(input: {
  page: number;
  limit: number;
  sort?: string;
  direction?: string;
  search: {
    itemStatus?: string;
    productCollection?: string;
    text?: string;
  };
}) {
  const { data, loading, error, refetch } = useQuery<any>(GET_FRIDGE_ITEMS, {
    variables: { input },
    fetchPolicy: "network-only",
  });

  const [addItemMutation] = useMutation<any>(ADD_FRIDGE_ITEM);
  const [restockMutation] = useMutation<any>(RESTOCK_FRIDGE_ITEM);
  const [updateItemMutation] = useMutation<any>(UPDATE_FRIDGE_ITEM);
  const [deleteItemMutation] = useMutation<any>(DELETE_FRIDGE_ITEM);

  return {
    fridgeItems: data?.getFridgeItems?.list ?? [],
    total: data?.getFridgeItems?.metaCounter?.[0]?.total ?? 0,
    loading,
    error,
    refetch,
    addFridgeItem: async (itemInput: any) => {
      const result = await addItemMutation({
        variables: { input: itemInput },
      });
      return result.data?.addFridgeItem;
    },
    restockFridgeItem: async (restockInput: any) => {
      const result = await restockMutation({
        variables: { input: restockInput },
      });
      return result.data?.restockFridgeItem;
    },
    updateFridgeItem: async (updateInput: any) => {
      const result = await updateItemMutation({
        variables: { input: updateInput },
      });
      return result.data?.updateFridgeItem;
    },
    deleteFridgeItem: async (fridgeItemId: string) => {
      const result = await deleteItemMutation({
        variables: { input: fridgeItemId },
      });
      return result.data?.deleteFridgeItem;
    },
  };
}
