"use client";
import { useEffect, useState, useContext } from "react";
import NewsCard from "./NewsCard";
import CategorySelector from "./CategorySelector";
import Header from "../components/Header";
import SearchBarContext from "../Context/SearchbarContext";
import { Reorder } from "framer-motion";
import SortableGrid from "../components/SortableGrid";

const MAX_HISTORY = 3;
const LOCAL_STORAGE_KEY = "categoryHistory";

const News = () => {
  const { debouncedSearch } = useContext(SearchBarContext);

  const [news, setNews] = useState([]); // full unfiltered articles
  const [filteredNews, setFilteredNews] = useState([]); // only what we show
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [categoryHistory, setCategoryHistory] = useState([]);
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

  // Fetch new articles whenever category changes
  useEffect(() => {
    if (!selectedCategory) return;

    const updatedHistory = [selectedCategory, ...categoryHistory.filter(c => c !== selectedCategory)].slice(0, MAX_HISTORY);
    setCategoryHistory(updatedHistory);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedHistory));
    fetchNews(selectedCategory);
  }, [selectedCategory]);

  // Search effect — filters based on debouncedSearch + latest fetched articles
  useEffect(() => {
    if (!debouncedSearch) {
      setFilteredNews(news); // reset to all if empty
    } else {
      const filtered = news.filter(n =>
        n.title?.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
      setFilteredNews(filtered);
    }
  }, [debouncedSearch, news]);

  const fetchNews = async (category) => {
    try {
      const url = `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${api_key}`;
      const res = await fetch(url);
      const data = await res.json();
      console.log("API Response:", data);
      setNews(data.articles || []);
      setFilteredNews(data.articles || []); // also reset filtered
    } catch (err) {
      console.log("Error fetching news", err);
    }
  };

  return (
    <div className="p-6">
      <Header />
      <h1 className="text-4xl font-bold text-center mb-8 text-zinc-800 dark:text-zinc-100">
        📰 Top Headlines in <span className="text-blue-600 capitalize">{selectedCategory}</span>
      </h1>

      {/* Category Selector Component */}
      <CategorySelector selected={selectedCategory} onSelect={setSelectedCategory} />

      {/* News Grid */}
 <Reorder.Group
  axis="y"
  values={filteredNews}
  onReorder={setFilteredNews}
  className="mt-6 flex flex-col gap-6"
>
  {filteredNews.map((article, index) => (
    <NewsCard
      key={article.url || index}
      {...article}
      draggablevalue={article}
      isDraggable={true}
    />
  ))}
</Reorder.Group>

    </div>
  );
};

export default News;
