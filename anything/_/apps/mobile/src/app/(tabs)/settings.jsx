import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Palette, Bell, HelpCircle, LogOut } from "lucide-react-native";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();

  const settingsOptions = [
    {
      icon: Palette,
      label: "Brand Settings",
      description: "Customize colors and logo",
    },
    {
      icon: Bell,
      label: "Notifications",
      description: "Manage notification preferences",
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      description: "Get help and contact support",
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#F8F9FC" }}>
      <StatusBar style="dark" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View
          style={{
            paddingTop: insets.top + 20,
            paddingHorizontal: 20,
            paddingBottom: 20,
            backgroundColor: "#FFFFFF",
            borderBottomWidth: 1,
            borderBottomColor: "#E6EAF0",
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: "800", color: "#111111" }}>
            Settings
          </Text>
          <Text style={{ fontSize: 14, color: "#667085" }}>
            Manage your account and preferences
          </Text>
        </View>

        {/* Settings Options */}
        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          {settingsOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                padding: 20,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: "#E6EAF0",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  backgroundColor: "#FFD400",
                  borderRadius: 12,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 16,
                }}
              >
                <option.icon size={24} color="#111111" />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: "#111111",
                    marginBottom: 4,
                  }}
                >
                  {option.label}
                </Text>
                <Text style={{ fontSize: 13, color: "#667085" }}>
                  {option.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}

          {/* Logout */}
          <TouchableOpacity
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              padding: 20,
              marginTop: 20,
              borderWidth: 1,
              borderColor: "#FEE2E2",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                backgroundColor: "#FEE2E2",
                borderRadius: 12,
                justifyContent: "center",
                alignItems: "center",
                marginRight: 16,
              }}
            >
              <LogOut size={24} color="#EF4444" />
            </View>
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#EF4444" }}>
              Log Out
            </Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 40,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 12, color: "#667085" }}>
            ReviewPost v1.0.0
          </Text>
          <Text style={{ fontSize: 12, color: "#667085", marginTop: 4 }}>
            Made with ❤️ for local businesses
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
