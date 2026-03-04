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
import { Sparkles, BarChart3, Image, Calendar } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [reviews, setReviews] = useState([]);
  const [posts, setPosts] = useState([]);
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load business info
      const businessRes = await fetch("/api/businesses?id=1");
      if (businessRes.ok) {
        const businessData = await businessRes.json();
        setBusiness(businessData);
      }

      // Load reviews
      const reviewsRes = await fetch("/api/reviews?business_id=1&min_rating=4");
      if (reviewsRes.ok) {
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData);
      }

      // Load posts
      const postsRes = await fetch("/api/posts?business_id=1");
      if (postsRes.ok) {
        const postsData = await postsRes.json();
        setPosts(postsData);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#F8F9FC",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <StatusBar style="dark" />
        <ActivityIndicator size="large" color="#FFD400" />
        <Text style={{ marginTop: 16, color: "#667085", fontSize: 14 }}>
          Loading...
        </Text>
      </View>
    );
  }

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
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 8,
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
                marginRight: 12,
              }}
            >
              <Sparkles size={28} color="#111111" />
            </View>
            <View>
              <Text
                style={{ fontSize: 24, fontWeight: "800", color: "#111111" }}
              >
                ReviewPost
              </Text>
              <Text style={{ fontSize: 14, color: "#667085" }}>
                {business?.name || "Your Business"}
              </Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          <View style={{ flexDirection: "row", marginBottom: 16 }}>
            <View
              style={{
                flex: 1,
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                padding: 20,
                marginRight: 8,
                borderWidth: 1,
                borderColor: "#E6EAF0",
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  backgroundColor: "#4A90E2",
                  borderRadius: 12,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <BarChart3 size={24} color="#FFFFFF" />
              </View>
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "800",
                  color: "#111111",
                  marginBottom: 4,
                }}
              >
                {reviews.length}
              </Text>
              <Text style={{ fontSize: 12, color: "#667085" }}>Reviews</Text>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                padding: 20,
                marginLeft: 8,
                borderWidth: 1,
                borderColor: "#E6EAF0",
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
                  marginBottom: 12,
                }}
              >
                <Image size={24} color="#111111" />
              </View>
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "800",
                  color: "#111111",
                  marginBottom: 4,
                }}
              >
                {posts.length}
              </Text>
              <Text style={{ fontSize: 12, color: "#667085" }}>Posts</Text>
            </View>
          </View>

          {/* Quick Actions */}
          <TouchableOpacity
            onPress={() => router.push("/reviews")}
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              padding: 24,
              marginBottom: 16,
              borderWidth: 2,
              borderColor: "#E6EAF0",
            }}
          >
            <View
              style={{
                width: 56,
                height: 56,
                backgroundColor: "#FFD400",
                borderRadius: 16,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Sparkles size={32} color="#111111" />
            </View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "800",
                color: "#111111",
                marginBottom: 8,
              }}
            >
              Generate Posts
            </Text>
            <Text style={{ fontSize: 14, color: "#667085", lineHeight: 20 }}>
              Let AI turn your best reviews into engaging social media posts
            </Text>
          </TouchableOpacity>

          {/* Recent Reviews */}
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: "#E6EAF0",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "800",
                color: "#111111",
                marginBottom: 16,
              }}
            >
              Recent Reviews
            </Text>
            {reviews.slice(0, 3).map((review) => (
              <View
                key={review.id}
                style={{
                  marginBottom: 16,
                  paddingBottom: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: "#F8F9FC",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      backgroundColor: "#FFD400",
                      borderRadius: 16,
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "700",
                        color: "#111111",
                      }}
                    >
                      {review.author_name?.charAt(0) || "?"}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: "#111111",
                      }}
                    >
                      {review.author_name || "Anonymous"}
                    </Text>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#FFD400",
                          marginRight: 4,
                        }}
                      >
                        {"★".repeat(review.rating)}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#667085",
                          textTransform: "capitalize",
                        }}
                      >
                        {review.source}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text
                  style={{ fontSize: 13, color: "#667085", lineHeight: 18 }}
                  numberOfLines={2}
                >
                  {review.review_text}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
