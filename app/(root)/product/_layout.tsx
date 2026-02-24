import { Stack } from "expo-router";
import React, { Component } from "react";

export class Layout extends Component {
  render() {
    return (
      <Stack>
        <Stack.Screen name="[id]" options={{ headerShown: false }} />
      </Stack>
    );
  }
}

export default Layout;
