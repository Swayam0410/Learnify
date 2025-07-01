"use client";
import { useEffect, useState } from "react";
import NewsCard from "../News/NewsCard";
import CategorySelector from "../News/CategorySelector";

const MAX_HISTORY = 3;
const LOCAL_STORAGE_KEY = "categoryHistory";

const News = () => {
  const [news, setNews] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [categoryHistory, setCategoryHistory] = useState<string[]>([]);
  const api_key = process.env.NEXT_PUBLIC_NEWS_API_KEY;

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setCategoryHistory(parsed);
        setSelectedCategory(parsed[0]); // use most recent as selected
      }
    }
  }, []);

  // Update history + fetch news on category change
  useEffect(() => {
    if (!selectedCategory) return;

    const updatedHistory = [selectedCategory, ...categoryHistory.filter(c => c !== selectedCategory)].slice(0, MAX_HISTORY);
    setCategoryHistory(updatedHistory);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedHistory));
    fetchNews(selectedCategory);
  }, [selectedCategory]);

  const fetchNews = async (category: string) => {
    try {
      const url = `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${api_key}`;
      const res = await fetch(url);
      const data = await res.json();
      console.log("API Response:", data);
      setNews(data.articles);
    } catch (err) {
      console.log("Error fetching news", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-center mb-8 text-zinc-800 dark:text-zinc-100">
        📰 Top Headlines in <span className="text-blue-600 capitalize">{selectedCategory}</span>
      </h1>

      {/* Category Selector Component */}
      <CategorySelector selected={selectedCategory} onSelect={setSelectedCategory} />

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.length > 0 ? (
          news.map((article, index) => <NewsCard key={index} {...article} />)
        ) : (
          <p className="text-center col-span-full text-gray-500">No news found.</p>
        )}
      </div>
    </div>
  );
};

export default News;
