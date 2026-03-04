"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Sparkles, Filter, Plus } from "lucide-react";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [selectedReviews, setSelectedReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
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

    setAnalyzing(true);
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
        // Store analysis in sessionStorage and navigate to generator
        sessionStorage.setItem("reviewAnalysis", JSON.stringify(analysis));
        sessionStorage.setItem(
          "selectedReviews",
          JSON.stringify(selectedReviewData),
        );
        navigateTo("/dashboard/generate");
      }
    } catch (error) {
      console.error("Error analyzing reviews:", error);
      alert("Failed to analyze reviews. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const navigateTo = (path) => {
    window.location.href = path;
  };

  const filteredReviews = reviews;

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      {/* Header */}
      <header className="bg-white border-b border-[#E6EAF0]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigateTo("/dashboard")}
                className="p-2 hover:bg-[#F8F9FC] rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-[#667085]" />
              </button>
              <div>
                <h1 className="font-extrabold text-xl text-[#111111]">
                  Your Reviews
                </h1>
                <p className="text-sm text-[#667085]">
                  {reviews.length} reviews available
                </p>
              </div>
            </div>
            <button
              onClick={() => navigateTo("/dashboard/reviews/add")}
              className="flex items-center space-x-2 bg-[#FFD400] hover:bg-[#E6C200] text-[#111111] font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={18} />
              <span>Add Review</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl border border-[#E6EAF0] p-4 mb-6">
          <div className="flex items-center space-x-4">
            <Filter size={18} className="text-[#667085]" />
            <div className="flex space-x-2">
              {["all", "google", "yelp", "facebook", "manual"].map((source) => (
                <button
                  key={source}
                  onClick={() => setFilterSource(source)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    filterSource === source
                      ? "bg-[#FFD400] text-[#111111]"
                      : "bg-[#F8F9FC] text-[#667085] hover:bg-[#E6EAF0]"
                  }`}
                >
                  {source.charAt(0).toUpperCase() + source.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-[#FFD400] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#667085]">Loading reviews...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {filteredReviews.map((review) => (
                <div
                  key={review.id}
                  onClick={() => toggleReview(review.id)}
                  className={`bg-white rounded-xl p-6 border-2 cursor-pointer transition-all ${
                    selectedReviews.includes(review.id)
                      ? "border-[#FFD400] shadow-lg"
                      : "border-[#E6EAF0] hover:border-[#FFD400]"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#FFD400] rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-[#111111]">
                          {review.author_name?.charAt(0) || "?"}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-[#111111]">
                          {review.author_name || "Anonymous"}
                        </p>
                        <div className="flex items-center space-x-2">
                          <div className="flex">
                            {[...Array(review.rating)].map((_, i) => (
                              <span key={i} className="text-[#FFD400] text-xs">
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-xs text-[#667085] capitalize">
                            {review.source}
                          </span>
                        </div>
                      </div>
                    </div>
                    {selectedReviews.includes(review.id) && (
                      <div className="w-6 h-6 bg-[#FFD400] rounded-full flex items-center justify-center">
                        <span className="text-[#111111] text-sm">✓</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-[#667085] leading-relaxed">
                    {review.review_text}
                  </p>
                </div>
              ))}
            </div>

            {/* Action Bar */}
            {selectedReviews.length > 0 && (
              <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-[#111111] text-white rounded-full px-8 py-4 shadow-2xl flex items-center space-x-4">
                <p className="font-semibold">
                  {selectedReviews.length} reviews selected
                </p>
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="flex items-center space-x-2 bg-[#FFD400] hover:bg-[#E6C200] text-[#111111] font-semibold px-6 py-2 rounded-full transition-colors disabled:opacity-50"
                >
                  <Sparkles size={18} />
                  <span>{analyzing ? "Analyzing..." : "Generate Posts"}</span>
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
