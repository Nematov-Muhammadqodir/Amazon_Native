// FloatingFoodIcons.tsx
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";

const { width, height } = Dimensions.get("window");

const FOOD_ICONS = [
  { name: "food-apple", color: "#FF6B6B" },
  { name: "leaf", color: "#4CAF50" },
  { name: "fruit-cherries", color: "#E91E63" },
  { name: "food-drumstick", color: "#FF9800" },
  { name: "carrot", color: "#FF7043" },
  { name: "corn", color: "#FFC107" },
  { name: "food-croissant", color: "#A1887F" },
  { name: "mushroom", color: "#8D6E63" },
  { name: "fruit-grapes", color: "#7B1FA2" },
  { name: "seed", color: "#66BB6A" },
];

function FloatingIcon({
  icon,
  index,
}: {
  icon: (typeof FOOD_ICONS)[0];
  index: number;
}) {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0.15)).current;

  // Random initial position
  const initialX = Math.random() * (width - 40);
  const initialY = Math.random() * (height * 0.35); // top 35% of screen

  useEffect(() => {
    const duration = 3000 + Math.random() * 4000;
    const delay = index * 300;

    const floatAnimation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -15 - Math.random() * 20,
            duration: duration / 2,
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: (Math.random() - 0.5) * 20,
            duration: duration / 2,
            useNativeDriver: true,
          }),
          Animated.timing(rotate, {
            toValue: 1,
            duration: duration / 2,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.25,
            duration: duration / 2,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: 0,
            duration: duration / 2,
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: 0,
            duration: duration / 2,
            useNativeDriver: true,
          }),
          Animated.timing(rotate, {
            toValue: 0,
            duration: duration / 2,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.12,
            duration: duration / 2,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    const timeout = setTimeout(() => floatAnimation.start(), delay);
    return () => {
      clearTimeout(timeout);
      floatAnimation.stop();
    };
  }, []);

  const rotateInterpolate = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["-10deg", "10deg"],
  });

  return (
    <Animated.View
      style={[
        styles.icon,
        {
          left: initialX,
          top: initialY,
          opacity,
          transform: [
            { translateX },
            { translateY },
            { rotate: rotateInterpolate },
          ],
        },
      ]}
    >
      <MaterialCommunityIcons
        name={icon.name as any}
        size={28}
        color={icon.color}
      />
    </Animated.View>
  );
}

export default function FloatingFoodIcons() {
  return (
    <View style={styles.container} pointerEvents="none">
      {FOOD_ICONS.map((icon, index) => (
        <FloatingIcon key={index} icon={icon} index={index} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "35%", // Only floats in the top area
    zIndex: 0,
  },
  icon: {
    position: "absolute",
  },
});
