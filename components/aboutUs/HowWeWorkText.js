import { StyleSheet, Text, View } from "react-native";

export default function HowWeWorkText() {
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.first}>how we work</Text>
      <Text style={styles.second}>
        Organic Goodness, Everyday Greatness Cultivating Health
      </Text>
      <Text style={styles.third}>
        We partner with trusted suppliers, carefully select fresh products, and
        deliver groceries quickly and reliably to ensure your satisfaction.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 50,
    paddingHorizontal: 20,
    gap: 10,
  },
  first: {
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  second: {
    fontSize: 20,
    fontFamily: "open-sans-bold",
    color: "brown",
  },
  third: {
    fontSize: 16,
    lineHeight: 22,
  },
});
