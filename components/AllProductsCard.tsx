import { addItem } from "@/slice/cartSlice";
import { REACT_APP_API_URL } from "@/types/config";
import { Product } from "@/types/product/product";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useDispatch } from "react-redux";
import CustomButton from "./CustomButton";

export default function AllProductsCard({ item }: { item: Product }) {
  const dispatch = useDispatch();
  const imgPath = item?.productImages[0]
    ? `${REACT_APP_API_URL}/${item?.productImages[0]}`
    : `${REACT_APP_API_URL}/${item?.productImages[0]}`;
  return (
    <Pressable onPress={() => router.push(`/product/${item._id}`)}>
      <View key={item._id} style={styles.mainContainer}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: imgPath }} style={styles.image} />
        </View>
        <View style={{ paddingHorizontal: 10 }}>
          <Text style={styles.name}>{item.productName}</Text>
          <Text style={styles.description}>{item.productDesc}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>₩{item.productPrice}</Text>
            <View style={styles.discountContainer}>
              <Text style={styles.discountAmount}>
                -{item.productDiscountRate}%
              </Text>
            </View>
          </View>
          <View className="mt-5">
            <CustomButton
              bgVariant="dark-green"
              textVariant="green"
              IconLeft={
                <MaterialIcons
                  name="add-shopping-cart"
                  size={20}
                  color="white"
                />
              }
              className="pl-4 w-[50px] flex rounded-full items-center justify-center"
              onPress={() =>
                dispatch(
                  addItem({
                    _id: item._id,
                    quantity: 1,
                    price: Number(item.productPrice),
                    name: item.productName,
                    image: item.productImages[0],
                    discountRate: item.productDiscountRate,
                  })
                )
              }
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    height: 280,
    backgroundColor: "#fff",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  imageContainer: {
    height: 100,
    alignItems: "center",
  },
  image: {
    height: 100,
    width: 90,
    resizeMode: "contain",
  },
  descContainer: {},
  name: { fontSize: 16, fontFamily: "open-sans-bold", letterSpacing: 2 },
  description: {
    fontSize: 12,
    fontFamily: "open-sans",
    fontWeight: 500,
    position: "relative",
  },
  priceContainer: {
    flexDirection: "row",
    gap: 5,
    marginTop: 15,
  },
  price: {
    fontSize: 16,
    fontFamily: "open-sans-bold",
  },
  discountContainer: {
    width: 40,
    height: 20,
    backgroundColor: "#E00000",
    borderRadius: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  discountAmount: {
    color: "white",
  },
});
