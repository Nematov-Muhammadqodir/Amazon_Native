import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
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
          focused ? "bg-[#E9AB18]" : ""
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

export default function VendorTabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "white",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#2D4D23",
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
        name="my-products"
        options={{
          title: "My Products",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="cube" />
          ),
        }}
      />
      <Tabs.Screen
        name="create-product"
        options={{
          title: "Add Product",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="add-circle" />
          ),
        }}
      />
      <Tabs.Screen
        name="bills"
        options={{
          title: "Bills",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="document-text" />
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
      {/* Hidden tabs - accessible via buttons on my-products page */}
      <Tabs.Screen
        name="fridge"
        options={{
          headerShown: false,
          href: null,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          headerShown: false,
          href: null,
        }}
      />
    </Tabs>
  );
}
