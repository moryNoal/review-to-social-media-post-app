"use client";

import { useState, useEffect } from "react";
import { Sparkles, Calendar, Image, Settings, BarChart3 } from "lucide-react";

export default function DashboardPage() {
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

  const stats = [
    {
      label: "Total Reviews",
      value: reviews.length,
      icon: BarChart3,
      color: "bg-blue-500",
    },
    {
      label: "Posts Created",
      value: posts.length,
      icon: Image,
      color: "bg-[#FFD400]",
    },
    {
      label: "Scheduled",
      value: posts.filter((p) => p.status === "scheduled").length,
      icon: Calendar,
      color: "bg-green-500",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#FFD400] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#111111] font-medium">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  const navigateTo = (path) => {
    window.location.href = path;
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      {/* Header */}
      <header className="bg-white border-b border-[#E6EAF0]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#FFD400] rounded-lg flex items-center justify-center">
                <Sparkles size={24} className="text-[#111111]" />
              </div>
              <div>
                <h1 className="font-extrabold text-xl text-[#111111]">
                  ReviewPost
                </h1>
                <p className="text-sm text-[#667085]">
                  {business?.name || "Your Business"}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigateTo("/dashboard/settings")}
              className="p-2 hover:bg-[#F8F9FC] rounded-lg transition-colors"
            >
              <Settings size={20} className="text-[#667085]" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 border border-[#E6EAF0]"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}
                >
                  <stat.icon size={24} className="text-white" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-[#111111] mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-[#667085]">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => navigateTo("/dashboard/reviews")}
            className="bg-white rounded-xl p-8 border-2 border-[#E6EAF0] hover:border-[#FFD400] transition-all text-left group"
          >
            <div className="w-14 h-14 bg-[#FFD400] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Sparkles size={28} className="text-[#111111]" />
            </div>
            <h3 className="font-extrabold text-xl text-[#111111] mb-2">
              Generate Posts
            </h3>
            <p className="text-[#667085]">
              Let AI turn your best reviews into engaging social media posts
            </p>
          </button>

          <button
            onClick={() => navigateTo("/dashboard/schedule")}
            className="bg-white rounded-xl p-8 border-2 border-[#E6EAF0] hover:border-[#FFD400] transition-all text-left group"
          >
            <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Calendar size={28} className="text-white" />
            </div>
            <h3 className="font-extrabold text-xl text-[#111111] mb-2">
              Schedule Posts
            </h3>
            <p className="text-[#667085]">
              Plan your content calendar and automate posting
            </p>
          </button>
        </div>

        {/* Recent Reviews */}
        <div className="bg-white rounded-xl border border-[#E6EAF0] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-extrabold text-xl text-[#111111]">
              Recent Reviews
            </h2>
            <button
              onClick={() => navigateTo("/dashboard/reviews")}
              className="text-sm font-semibold text-[#0069FF] hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {reviews.slice(0, 5).map((review) => (
              <div
                key={review.id}
                className="flex items-start space-x-4 p-4 rounded-lg hover:bg-[#F8F9FC] transition-colors"
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-[#FFD400] rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-[#111111]">
                      {review.author_name?.charAt(0) || "?"}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="font-semibold text-sm text-[#111111]">
                      {review.author_name || "Anonymous"}
                    </p>
                    <span className="text-xs text-[#667085]">•</span>
                    <div className="flex">
                      {[...Array(review.rating)].map((_, i) => (
                        <span key={i} className="text-[#FFD400]">
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-[#667085] capitalize">
                      {review.source}
                    </span>
                  </div>
                  <p className="text-sm text-[#667085] line-clamp-2">
                    {review.review_text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
