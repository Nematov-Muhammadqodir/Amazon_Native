import { Stack } from "expo-router";
import React, { Component } from "react";

export class Layout extends Component {
  render() {
    return (
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* <Stack.Screen name="find-ride" options={{ headerShown: false }} />
        <Stack.Screen name="confirm-ride" options={{ headerShown: false }} />
        <Stack.Screen name="book-ride" options={{ headerShown: false }} /> */}
      </Stack>
    );
  }
}

export default Layout;
