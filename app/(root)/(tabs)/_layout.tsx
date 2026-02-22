import { icons } from "@/constants";
import { Tabs } from "expo-router";
import { Image, View } from "react-native";

type TabIconProps = {
  icon: "home" | "chat" | "profile" | "rides";
  focused: boolean;
};

function TabIcon({ icon, focused }: TabIconProps) {
  const source =
    icon === "home"
      ? icons.home
      : icon === "chat"
        ? icons.chat
        : icon === "profile"
          ? icons.profile
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
        <Image
          source={source}
          style={{
            width: 24,
            height: 24,
            opacity: focused ? 1 : 0.4,
          }}
          resizeMode="contain"
          className="w-7 h-7"
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
          title: "Rides",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="rides" />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="profile" />
          ),
        }}
      />

      {/* Add your other tab screens here */}
    </Tabs>
  );
}
