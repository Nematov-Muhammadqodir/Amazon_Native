import { useQuery, useMutation } from "@apollo/client/react";
import { GET_PRESET_PRODUCTS } from "@/apollo/vendor/preset-query";
import {
  CREATE_PRESET_PRODUCT,
  UPDATE_PRESET_PRODUCT,
  DELETE_PRESET_PRODUCT,
} from "@/apollo/vendor/preset-mutation";

export function usePresets() {
  const { data, loading, error, refetch } = useQuery<any>(
    GET_PRESET_PRODUCTS,
    { fetchPolicy: "network-only" }
  );

  const [createMutation] = useMutation<any>(CREATE_PRESET_PRODUCT);
  const [updateMutation] = useMutation<any>(UPDATE_PRESET_PRODUCT);
  const [deleteMutation] = useMutation<any>(DELETE_PRESET_PRODUCT);

  return {
    presets: data?.getPresetProducts ?? [],
    loading,
    error,
    refetch,
    createPreset: async (input: any) => {
      const result = await createMutation({ variables: { input } });
      return result.data?.createPresetProduct;
    },
    updatePreset: async (input: any) => {
      const result = await updateMutation({ variables: { input } });
      return result.data?.updatePresetProduct;
    },
    deletePreset: async (presetId: string) => {
      const result = await deleteMutation({ variables: { presetId } });
      return result.data?.deletePresetProduct;
    },
  };
}
