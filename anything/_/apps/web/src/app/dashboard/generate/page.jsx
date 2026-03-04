"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Download, Calendar, Wand2 } from "lucide-react";

export default function GeneratePage() {
  const [analysis, setAnalysis] = useState(null);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [caption, setCaption] = useState("");
  const [generating, setGenerating] = useState(false);
  const [business, setBusiness] = useState(null);

  useEffect(() => {
    // Load analysis from sessionStorage
    if (typeof window !== "undefined") {
      const storedAnalysis = sessionStorage.getItem("reviewAnalysis");
      if (storedAnalysis) {
        setAnalysis(JSON.parse(storedAnalysis));
      }
    }

    // Load business info
    loadBusiness();
  }, []);

  const loadBusiness = async () => {
    try {
      const response = await fetch("/api/businesses?id=1");
      if (response.ok) {
        const data = await response.json();
        setBusiness(data);
      }
    } catch (error) {
      console.error("Error loading business:", error);
    }
  };

  const handleSelectQuote = async (quote) => {
    setSelectedQuote(quote);
    setGenerating(true);

    try {
      const response = await fetch("/api/posts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quote: quote.quote,
          business_name: business?.name || "Your Business",
          tone: "warm",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCaption(
          data.caption + "\n\n" + data.hashtags.map((h) => "#" + h).join(" "),
        );
      }
    } catch (error) {
      console.error("Error generating caption:", error);
    } finally {
      setGenerating(false);
    }
  };

  const handleSavePost = async () => {
    if (!selectedQuote || !caption) return;

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_id: 1,
          review_id: null,
          quote_text: selectedQuote.quote,
          caption: caption,
          status: "draft",
        }),
      });

      if (response.ok) {
        alert("Post saved successfully!");
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("Error saving post:", error);
      alert("Failed to save post");
    }
  };

  const navigateTo = (path) => {
    window.location.href = path;
  };

  if (!analysis) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#667085] mb-4">No analysis found</p>
          <button
            onClick={() => navigateTo("/dashboard/reviews")}
            className="bg-[#FFD400] hover:bg-[#E6C200] text-[#111111] font-semibold px-6 py-2 rounded-lg"
          >
            Go to Reviews
          </button>
        </div>
      </div>
    );
  }

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
                Generate Posts
              </h1>
              <p className="text-sm text-[#667085]">
                AI-selected quotes from your reviews
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Quote Selection */}
          <div>
            <h2 className="font-extrabold text-lg text-[#111111] mb-4">
              Select a Quote
            </h2>
            <div className="space-y-4">
              {analysis.best_quotes.map((quote, index) => (
                <div
                  key={index}
                  onClick={() => handleSelectQuote(quote)}
                  className={`bg-white rounded-xl p-6 border-2 cursor-pointer transition-all ${
                    selectedQuote?.quote === quote.quote
                      ? "border-[#FFD400] shadow-lg"
                      : "border-[#E6EAF0] hover:border-[#FFD400]"
                  }`}
                >
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="w-8 h-8 bg-[#FFD400] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-[#111111]">
                        {index + 1}
                      </span>
                    </div>
                    <p className="font-semibold text-[#111111] leading-relaxed">
                      "{quote.quote}"
                    </p>
                  </div>
                  <p className="text-sm text-[#667085] ml-11">{quote.reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Post Preview */}
          <div>
            <h2 className="font-extrabold text-lg text-[#111111] mb-4">
              Post Preview
            </h2>
            <div className="bg-white rounded-xl border border-[#E6EAF0] p-6 mb-6">
              {selectedQuote ? (
                <>
                  {/* Mock Social Post */}
                  <div className="bg-gradient-to-br from-[#FFD400] to-[#FFA500] rounded-lg p-8 mb-6 min-h-[300px] flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-2xl font-extrabold text-[#111111] mb-4">
                        "{selectedQuote.quote}"
                      </p>
                      <p className="text-sm font-semibold text-[#111111] opacity-80">
                        - {business?.name || "Your Business"}
                      </p>
                    </div>
                  </div>

                  {/* Caption */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-[#111111] mb-2">
                      Caption
                    </label>
                    {generating ? (
                      <div className="flex items-center space-x-2 text-[#667085]">
                        <Wand2 size={16} className="animate-pulse" />
                        <span className="text-sm">Generating caption...</span>
                      </div>
                    ) : (
                      <textarea
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        className="w-full h-32 px-4 py-3 border border-[#E6EAF0] rounded-lg text-sm text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#FFD400]"
                        placeholder="Caption will appear here..."
                      />
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSavePost}
                      disabled={!caption}
                      className="flex-1 bg-[#FFD400] hover:bg-[#E6C200] text-[#111111] font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Save as Draft
                    </button>
                    <button className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
                      <Calendar size={18} />
                      <span>Schedule</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Wand2 size={48} className="text-[#E6EAF0] mx-auto mb-4" />
                  <p className="text-[#667085]">
                    Select a quote to generate a post
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
