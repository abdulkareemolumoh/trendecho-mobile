import { AntDesign, Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";

const TabsLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: () => <AntDesign name="home" size={24} color="white" />,
          tabBarLabel: "",
          tabBarActiveTintColor: "red",
          // tabBarBadge: 3,
        }}
      />
      <Tabs.Screen
        name="trends"
        options={{
          title: "Trends",
          tabBarIcon: () => (
            <Feather name="trending-up" size={24} color="white" />
          ),
          tabBarLabel: "",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: () => (
            <AntDesign name="profile" size={24} color="white" />
          ),
          tabBarLabel: "",
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
