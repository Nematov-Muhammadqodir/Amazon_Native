import { gql } from "@apollo/client";

export const CREATE_PRESET_PRODUCT = gql`
  mutation CreatePresetProduct($input: PresetProductInput!) {
    createPresetProduct(input: $input) {
      _id
      productName
      productCollection
      unit
      defaultUnitCost
      defaultQuantity
      productImages
      productPrice
      productOriginPrice
      productDesc
      productOrigin
      sortOrder
    }
  }
`;

export const UPDATE_PRESET_PRODUCT = gql`
  mutation UpdatePresetProduct($input: PresetProductUpdate!) {
    updatePresetProduct(input: $input) {
      _id
      productName
      productCollection
      unit
      defaultUnitCost
      defaultQuantity
      productImages
      productPrice
      productOriginPrice
      productDesc
      productOrigin
      sortOrder
    }
  }
`;

export const DELETE_PRESET_PRODUCT = gql`
  mutation DeletePresetProduct($presetId: String!) {
    deletePresetProduct(presetId: $presetId) {
      _id
    }
  }
`;
