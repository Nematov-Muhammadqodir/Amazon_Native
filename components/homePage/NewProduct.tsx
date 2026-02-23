import { images } from "@/constants";
import { REACT_APP_API_URL } from "@/types/config";
import { Product } from "@/types/product/product";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image, StyleSheet, Text, View } from "react-native";
import CustomButton from "../CustomButton";

export default function NewProductCard({ item }: { item: Product }) {
  const imgPath = item?.productImages[0]
    ? `${REACT_APP_API_URL}/${item?.productImages[0]}`
    : images.noResult;
  return (
    <View key={item._id} style={styles.mainContainer}>
      <View style={styles.imageContainer}>
        <Image source={imgPath} style={styles.image} />
      </View>
      <View>
        <Text style={styles.name}>{item.productName}</Text>
        <Text style={styles.description}>{item.productDesc}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>₩{item.productPrice}</Text>
          <View style={styles.discountContainer}>
            <Text style={styles.discountAmount}>-10%</Text>
          </View>
        </View>
        <View className="mt-5">
          <CustomButton
            title="Add to card"
            bgVariant="light-green"
            textVariant="green"
            IconLeft={
              <MaterialIcons
                name="add-shopping-cart"
                size={24}
                color="#1D805C"
              />
            }
            className="gap-2"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: 268,
    height: 301,
    marginHorizontal: 5,
    backgroundColor: "#fff",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",

    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,

    // Android shadow
    elevation: 5,
  },
  imageContainer: {
    height: 115,
  },
  image: { height: 115, width: 100 },
  descContainer: {},
  name: { fontSize: 18, fontFamily: "open-sans-bold", letterSpacing: 2 },
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
