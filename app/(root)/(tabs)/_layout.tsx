import { icons } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View } from "react-native";

type TabIconProps = {
  icon: "home" | "products" | "cart";
  focused: boolean;
};

function TabIcon({ icon, focused }: TabIconProps) {
  const iconName =
    icon === "home"
      ? "home"
      : icon === "products"
        ? "list-sharp"
        : icon === "cart"
          ? "cart"
          : icons.list;

  return (
    <View
      className={`flex flex-1 justify-center items-center rounded-full ${
        focused ? "bg-general-300" : ""
      }`}
    >
      <View
        className={`rounded-full w-12 h-12 items-center justify-center  ${
          focused ? "bg-general-400" : ""
        }`}
      >
        <Ionicons
          name={iconName as any}
          size={24}
          color={focused ? "white" : "rgba(255,255,255,0.4)"}
        />
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "white",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#333333",
          borderRadius: 50,
          overflow: "hidden",
          marginHorizontal: 20,
          marginBottom: 20,
          height: 78,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          position: "absolute",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="home" />
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: "Products",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="products" />
          ),
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="cart" />
          ),
        }}
      />

      {/* Add your other tab screens here */}
    </Tabs>
  );
}
