import { LinearGradient } from "expo-linear-gradient";
import { ImageBackground, StyleSheet, Text, View } from "react-native";

export default function SmallAboutUsBanner() {
  return (
    <View style={styles.mainContainer}>
      <ImageBackground
        source={require("../../assets/images/aboutUs/farmImage.jpg")}
        resizeMode="cover"
        style={styles.image}
        imageStyle={styles.backgroundImage}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.75)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.overlay}
        >
          <Text style={styles.smallIntro}>Fresh • Fast • Affordable</Text>

          <Text style={styles.bigIntro}>Welcome to{"\n"}Annachi Kadai</Text>

          <Text style={styles.description}>
            Your trusted online grocery store delivering fresh food directly to
            your home.
          </Text>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    height: 200,
    marginTop: 20,
    borderRadius: 0,
    overflow: "hidden",
  },

  image: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  smallIntro: {
    color: "white",
    fontFamily: "Jakarta-SemiBold",
    textTransform: "uppercase",
    fontSize: 11,
    letterSpacing: 3,
    opacity: 0.9,
  },

  bigIntro: {
    color: "white",
    textAlign: "center",
    fontSize: 26,
    fontFamily: "Jakarta-Bold",
    marginTop: 6,
  },

  description: {
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    fontSize: 13,
    marginTop: 8,
    lineHeight: 18,
    fontFamily: "Jakarta",
  },

  backgroundImage: {
    opacity: 0.9,
  },
});
