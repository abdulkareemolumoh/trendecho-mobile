import { Tabs } from "expo-router";

const TabsLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{ title: "Home", headerShown: false }}
      />
      <Tabs.Screen name="trends" options={{ title: "Trends" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      {/* <Tabs.Screen name="notifications" options={{ title: "Notifications" }} /> */}
      {/* <Tabs.Screen name="messages" options={{ title: "Messages" }} /> */}
    </Tabs>
  );
};

export default TabsLayout;
