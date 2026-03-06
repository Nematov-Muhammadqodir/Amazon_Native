import { View, Text } from "react-native";
import React from "react";
import OurGoal from "./OurGoal";

export default function MissionList() {
  return (
    <View>
      <OurGoal
        image={require("../../assets/images/aboutUs/goal.png")}
        header={"Our Goal"}
        text={
          "Our goal is to make grocery shopping simple, convenient, and affordable by bringing fresh, high-quality products directly to your doorstep."
        }
      />
      <OurGoal
        image={require("../../assets/images/aboutUs/light.png")}
        header={"Our Mission"}
        text={
          "To provide fresh, affordable, and high-quality groceries with the convenience of online shopping, making healthy living accessible for everyone."
        }
      />
      <OurGoal
        image={require("../../assets/images/aboutUs/care.png")}
        header={"Our Ideology"}
        text={
          "We believe food should be fresh, shopping should be simple, and every family deserves easy access to quality groceries."
        }
      />
    </View>
  );
}
