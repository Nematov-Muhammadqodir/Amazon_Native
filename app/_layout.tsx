import { client } from "@/apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { StripeProvider } from "@stripe/stripe-react-native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MenuProvider } from "react-native-popup-menu";
import "react-native-reanimated";
import Toast from "react-native-toast-message";

// ✅ Add these
import { persistor, store } from "@/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

export default function RootLayout() {
  const [loaded] = useFonts({
    "Jakarta-Bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "Jakarta-ExtraBold": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    "Jakarta-ExtraLight": require("../assets/fonts/PlusJakartaSans-ExtraLight.ttf"),
    "Jakarta-Light": require("../assets/fonts/PlusJakartaSans-Light.ttf"),
    "Jakarta-Medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    Jakarta: require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "Jakarta-SemiBold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
      merchantIdentifier="merchant.com.yourapp"
    >
      <ApolloProvider client={client}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <MenuProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <Stack>
                  <Stack.Screen name="index" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="(auth)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="(root)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="(user)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="(vendor)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="(admin)"
                    options={{ headerShown: false }}
                  />
                </Stack>
              </GestureHandlerRootView>
              <Toast />
            </MenuProvider>
          </PersistGate>
        </Provider>
      </ApolloProvider>
    </StripeProvider>
  );
}
