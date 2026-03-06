import { Image, StyleSheet, View } from "react-native";

export default function HowWeWorkBanner() {
  return (
    <View style={styles.mainContainer}>
      <Image
        source={require("../../assets/images/aboutUs/farm-girl.jpg")}
        style={styles.image}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 5,
    height: 200,
    alignItems: "center",
    marginTop: 30,
  },
  image: { width: 370, height: 200, borderRadius: 8 },
});
