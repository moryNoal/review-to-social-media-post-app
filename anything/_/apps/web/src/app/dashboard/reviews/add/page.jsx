"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";

export default function AddReviewPage() {
  const [formData, setFormData] = useState({
    source: "manual",
    rating: 5,
    review_text: "",
    author_name: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_id: 1,
          ...formData,
        }),
      });

      if (response.ok) {
        alert("Review added successfully!");
        window.location.href = "/dashboard/reviews";
      } else {
        alert("Failed to add review");
      }
    } catch (error) {
      console.error("Error adding review:", error);
      alert("Failed to add review");
    } finally {
      setSubmitting(false);
    }
  };

  const navigateTo = (path) => {
    window.location.href = path;
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      {/* Header */}
      <header className="bg-white border-b border-[#E6EAF0]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateTo("/dashboard/reviews")}
              className="p-2 hover:bg-[#F8F9FC] rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-[#667085]" />
            </button>
            <div>
              <h1 className="font-extrabold text-xl text-[#111111]">
                Add Review
              </h1>
              <p className="text-sm text-[#667085]">
                Manually add a customer review
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 py-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-[#E6EAF0] p-8"
        >
          {/* Source */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#111111] mb-2">
              Source
            </label>
            <select
              value={formData.source}
              onChange={(e) =>
                setFormData({ ...formData, source: e.target.value })
              }
              className="w-full px-4 py-3 border border-[#E6EAF0] rounded-lg text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#FFD400]"
            >
              <option value="manual">Manual Entry</option>
              <option value="google">Google</option>
              <option value="yelp">Yelp</option>
              <option value="facebook">Facebook</option>
            </select>
          </div>

          {/* Rating */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#111111] mb-2">
              Rating
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating })}
                  className={`w-12 h-12 rounded-lg font-bold transition-colors ${
                    formData.rating >= rating
                      ? "bg-[#FFD400] text-[#111111]"
                      : "bg-[#F8F9FC] text-[#667085]"
                  }`}
                >
                  {rating}
                </button>
              ))}
            </div>
          </div>

          {/* Author Name */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#111111] mb-2">
              Customer Name
            </label>
            <input
              type="text"
              value={formData.author_name}
              onChange={(e) =>
                setFormData({ ...formData, author_name: e.target.value })
              }
              className="w-full px-4 py-3 border border-[#E6EAF0] rounded-lg text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#FFD400]"
              placeholder="John Doe"
            />
          </div>

          {/* Review Text */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#111111] mb-2">
              Review Text
            </label>
            <textarea
              value={formData.review_text}
              onChange={(e) =>
                setFormData({ ...formData, review_text: e.target.value })
              }
              required
              className="w-full h-40 px-4 py-3 border border-[#E6EAF0] rounded-lg text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#FFD400]"
              placeholder="Enter the review text..."
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || !formData.review_text}
            className="w-full bg-[#FFD400] hover:bg-[#E6C200] text-[#111111] font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Adding Review..." : "Add Review"}
          </button>
        </form>
      </main>
    </div>
  );
}
