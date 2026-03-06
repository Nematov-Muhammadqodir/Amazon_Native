import { View, Text, Image, StyleSheet } from "react-native";

const Experience = () => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.secondaryContainer}>
        <Image
          source={require("../../assets/images/aboutUs/10+.png")}
          style={styles.image}
        />
        <Text style={styles.text}>Years Of Experience</Text>
      </View>
      <View style={styles.secondaryContainer}>
        <Image
          source={require("../../assets/images/aboutUs/250K.png")}
          style={styles.image}
        />
        <Text style={styles.text}>Statisfied Clients</Text>
      </View>
    </View>
  );
};

export default Experience;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  secondaryContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  imageContainer: { width: 100, height: "auto" },
  image: { alignSelf: "center" },
  text: {
    fontSize: 18,
  },
});
