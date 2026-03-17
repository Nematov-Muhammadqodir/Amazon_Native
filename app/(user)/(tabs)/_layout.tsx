import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View } from "react-native";

type TabIconProps = {
  icon: "home" | "list-sharp" | "cart" | "chatbubble-ellipses";
  focused: boolean;
};

function TabIcon({ icon, focused }: TabIconProps) {
  return (
    <View
      className={`flex flex-1 justify-center items-center rounded-full ${
        focused ? "bg-general-300" : ""
      }`}
    >
      <View
        className={`rounded-full w-12 h-12 items-center justify-center ${
          focused ? "bg-general-400" : ""
        }`}
      >
        <Ionicons
          name={icon}
          size={24}
          color={focused ? "white" : "rgba(255,255,255,0.4)"}
        />
      </View>
    </View>
  );
}

export default function UserTabLayout() {
  return (
    <Tabs
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
            <TabIcon focused={focused} icon="list-sharp" />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="cart" />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="chatbubble-ellipses" />
          ),
        }}
      />
    </Tabs>
  );
}
