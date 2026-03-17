import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View } from "react-native";

type TabIconProps = {
  icon: keyof typeof Ionicons.glyphMap;
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
          focused ? "bg-red-600" : ""
        }`}
      >
        <Ionicons
          name={icon}
          size={22}
          color={focused ? "white" : "rgba(255,255,255,0.4)"}
        />
      </View>
    </View>
  );
}

export default function AdminTabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "white",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#1a1a2e",
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
        name="dashboard"
        options={{
          title: "Dashboard",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="grid" />
          ),
        }}
      />
      <Tabs.Screen
        name="members"
        options={{
          title: "Members",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="people" />
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: "Products",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="cube" />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="receipt" />
          ),
        }}
      />
      <Tabs.Screen
        name="content"
        options={{
          title: "Content",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="newspaper" />
          ),
        }}
      />
    </Tabs>
  );
}
