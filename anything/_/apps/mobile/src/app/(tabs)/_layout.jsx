import { Tabs } from "expo-router";
import { Home, FileText, Calendar, Settings } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderColor: "#E6EAF0",
          paddingTop: 4,
        },
        tabBarActiveTintColor: "#FFD400",
        tabBarInactiveTintColor: "#667085",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => <Home color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="reviews"
        options={{
          title: "Reviews",
          tabBarIcon: ({ color, size }) => <FileText color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="posts"
        options={{
          title: "Posts",
          tabBarIcon: ({ color, size }) => <Calendar color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => <Settings color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
