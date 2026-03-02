import { CartItem } from "@/types/search";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartSliceState {
  items: CartItem[];
}

const initialState: CartSliceState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(
        (item: any) => item._id === action.payload._id
      );

      if (existing) {
        existing.quantity = (existing.quantity ?? 1) + 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },

    removeItem: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(
        (item: any) => item._id === action.payload._id
      );

      if (!existing) return;

      if ((existing.quantity ?? 1) === 1) {
        state.items = state.items.filter(
          (item: any) => item._id !== action.payload._id
        );
      } else {
        existing.quantity = (existing.quantity ?? 1) - 1;
      }
    },

    deleteItem: (state, action: PayloadAction<CartItem>) => {
      state.items = state.items.filter(
        (item: any) => item._id !== action.payload._id
      );
    },

    deleteAll: (state) => {
      state.items = [];
    },
  },
});
export const { addItem, removeItem, deleteItem, deleteAll } = cartSlice.actions;

export default cartSlice.reducer;
