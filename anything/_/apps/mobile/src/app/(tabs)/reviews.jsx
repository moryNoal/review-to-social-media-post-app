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
import { Sparkles, Plus, Filter } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function ReviewsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [reviews, setReviews] = useState([]);
  const [selectedReviews, setSelectedReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSource, setFilterSource] = useState("all");

  useEffect(() => {
    loadReviews();
  }, [filterSource]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ business_id: "1", min_rating: "4" });
      if (filterSource !== "all") {
        params.append("source", filterSource);
      }

      const response = await fetch(`/api/reviews?${params}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error("Error loading reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleReview = (reviewId) => {
    setSelectedReviews((prev) =>
      prev.includes(reviewId)
        ? prev.filter((id) => id !== reviewId)
        : [...prev, reviewId],
    );
  };

  const handleAnalyze = async () => {
    if (selectedReviews.length === 0) {
      alert("Please select at least one review");
      return;
    }

    try {
      const selectedReviewData = reviews.filter((r) =>
        selectedReviews.includes(r.id),
      );
      const response = await fetch("/api/reviews/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviews: selectedReviewData }),
      });

      if (response.ok) {
        const analysis = await response.json();
        // Navigate to generate screen with analysis
        router.push({
          pathname: "/generate",
          params: { analysis: JSON.stringify(analysis) },
        });
      }
    } catch (error) {
      console.error("Error analyzing reviews:", error);
      alert("Failed to analyze reviews");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F8F9FC" }}>
      <StatusBar style="dark" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom:
            insets.bottom + (selectedReviews.length > 0 ? 160 : 80),
        }}
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
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text
                style={{ fontSize: 24, fontWeight: "800", color: "#111111" }}
              >
                Your Reviews
              </Text>
              <Text style={{ fontSize: 14, color: "#667085" }}>
                {reviews.length} reviews available
              </Text>
            </View>
            <TouchableOpacity
              style={{
                width: 44,
                height: 44,
                backgroundColor: "#FFD400",
                borderRadius: 12,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Plus size={24} color="#111111" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Filters */}
        <View style={{ paddingHorizontal: 20, paddingVertical: 16 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {["all", "google", "yelp", "facebook", "manual"].map((source) => (
                <TouchableOpacity
                  key={source}
                  onPress={() => setFilterSource(source)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 8,
                    backgroundColor:
                      filterSource === source ? "#FFD400" : "#F8F9FC",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: filterSource === source ? "#111111" : "#667085",
                      textTransform: "capitalize",
                    }}
                  >
                    {source}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Reviews List */}
        {loading ? (
          <View style={{ paddingVertical: 40, alignItems: "center" }}>
            <ActivityIndicator size="large" color="#FFD400" />
          </View>
        ) : (
          <View style={{ paddingHorizontal: 20 }}>
            {reviews.map((review) => (
              <TouchableOpacity
                key={review.id}
                onPress={() => toggleReview(review.id)}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 16,
                  padding: 20,
                  marginBottom: 12,
                  borderWidth: 2,
                  borderColor: selectedReviews.includes(review.id)
                    ? "#FFD400"
                    : "#E6EAF0",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 12,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      flex: 1,
                    }}
                  >
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        backgroundColor: "#FFD400",
                        borderRadius: 20,
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: 12,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
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
                  {selectedReviews.includes(review.id) && (
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        backgroundColor: "#FFD400",
                        borderRadius: 12,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: "#111111",
                          fontSize: 14,
                          fontWeight: "700",
                        }}
                      >
                        ✓
                      </Text>
                    </View>
                  )}
                </View>
                <Text
                  style={{ fontSize: 14, color: "#667085", lineHeight: 20 }}
                >
                  {review.review_text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Action Bar */}
      {selectedReviews.length > 0 && (
        <View
          style={{
            position: "absolute",
            bottom: insets.bottom + 90,
            left: 20,
            right: 20,
            backgroundColor: "#111111",
            borderRadius: 24,
            padding: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "600" }}>
            {selectedReviews.length} selected
          </Text>
          <TouchableOpacity
            onPress={handleAnalyze}
            style={{
              backgroundColor: "#FFD400",
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 20,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Sparkles size={18} color="#111111" style={{ marginRight: 8 }} />
            <Text style={{ color: "#111111", fontSize: 14, fontWeight: "700" }}>
              Generate
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
