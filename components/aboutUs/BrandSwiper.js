import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, Image, StyleSheet, View } from "react-native";

const { width } = Dimensions.get("window");

const logos = [
  require("../../assets/images/aboutUs/logo1.png"),
  require("../../assets/images/aboutUs/logo2.png"),
  require("../../assets/images/aboutUs/logo3.png"),
  require("../../assets/images/aboutUs/logo4.png"),
  require("../../assets/images/aboutUs/logo5.png"),
  require("../../assets/images/aboutUs/logo6.png"),
];

export default function BrandSwiper() {
  const scrollX = useRef(new Animated.Value(0)).current;

  // width of one logo + margin (must match styles.logo)
  const logoWidth = 100 + 20; // 100 width + 10 left + 10 right margin
  const totalWidth = logos.length * logoWidth;

  useEffect(() => {
    const loopAnimation = () => {
      scrollX.setValue(0);
      Animated.timing(scrollX, {
        toValue: totalWidth, // move across all logos
        duration: 25000, // adjust speed here
        useNativeDriver: true,
      }).start(() => loopAnimation()); // repeat forever
    };

    loopAnimation();
  }, [scrollX]);

  const translateX = scrollX.interpolate({
    inputRange: [0, totalWidth],
    outputRange: [0, -totalWidth],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.row,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        {/* duplicate logos for infinite scrolling */}
        {[...logos, ...logos].map((logo, index) => (
          <Image key={index} source={logo} style={styles.logo} />
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 80,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
  },
  logo: {
    width: 100,
    height: 60,
    resizeMode: "contain",
    marginHorizontal: 10,
  },
});
