import { Image, StyleSheet, Text, View } from "react-native";

// { header, text, image }
//"../../assets/images/aboutUs/goal.png"
export default function OurGoal({ image, header, text }) {
  return (
    <View style={styles.mainVrapper}>
      <View style={styles.mainContainer}>
        <View>
          <Image source={image} style={styles.image} />
        </View>
        <View>
          <Text style={styles.header}>{header}</Text>
        </View>
        <View>
          <Text style={styles.mainText}>{text}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainVrapper: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  mainContainer: {
    width: 350,
    borderWidth: 1,
    padding: 20,
    borderRadius: 8,
    borderColor: "gray",
  },
  header: {
    paddingTop: 10,
    fontSize: 20,
  },
  mainText: {
    paddingTop: 10,
    fontSize: 12,
  },
  image: {
    width: 70,
    height: 70,
  },
});
