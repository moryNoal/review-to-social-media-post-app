import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Calendar, Clock } from "lucide-react-native";

export default function PostsScreen() {
  const insets = useSafeAreaInsets();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/posts?business_id=1");
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "#10B981";
      case "scheduled":
        return "#3B82F6";
      default:
        return "#F59E0B";
    }
  };

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
            Your Posts
          </Text>
          <Text style={{ fontSize: 14, color: "#667085" }}>
            {posts.length} posts created
          </Text>
        </View>

        {/* Posts List */}
        {loading ? (
          <View style={{ paddingVertical: 40, alignItems: "center" }}>
            <ActivityIndicator size="large" color="#FFD400" />
          </View>
        ) : posts.length === 0 ? (
          <View
            style={{
              paddingVertical: 60,
              paddingHorizontal: 40,
              alignItems: "center",
            }}
          >
            <Calendar size={64} color="#E6EAF0" />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#111111",
                marginTop: 16,
                textAlign: "center",
              }}
            >
              No posts yet
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#667085",
                marginTop: 8,
                textAlign: "center",
              }}
            >
              Generate your first post from reviews
            </Text>
          </View>
        ) : (
          <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
            {posts.map((post) => (
              <View
                key={post.id}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 16,
                  padding: 20,
                  marginBottom: 16,
                  borderWidth: 1,
                  borderColor: "#E6EAF0",
                }}
              >
                {/* Quote */}
                <View
                  style={{
                    backgroundColor: "#FFD400",
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 12,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      color: "#111111",
                      lineHeight: 22,
                    }}
                  >
                    "{post.quote_text}"
                  </Text>
                </View>

                {/* Caption */}
                <Text
                  style={{
                    fontSize: 14,
                    color: "#667085",
                    lineHeight: 20,
                    marginBottom: 12,
                  }}
                  numberOfLines={3}
                >
                  {post.caption}
                </Text>

                {/* Meta */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 12,
                        backgroundColor: getStatusColor(post.status) + "20",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "600",
                          color: getStatusColor(post.status),
                          textTransform: "capitalize",
                        }}
                      >
                        {post.status}
                      </Text>
                    </View>
                  </View>
                  {post.scheduled_time && (
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Clock
                        size={14}
                        color="#667085"
                        style={{ marginRight: 4 }}
                      />
                      <Text style={{ fontSize: 12, color: "#667085" }}>
                        {new Date(post.scheduled_time).toLocaleDateString()}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
