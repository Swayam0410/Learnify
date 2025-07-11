"use client";
import { useEffect, useState, useContext } from "react";
import NewsCard from "./NewsCard";
import CategorySelector from "./CategorySelector";
import Header from "../components/Header";
import SearchBarContext from "../Context/SearchbarContext";
import { Reorder } from "framer-motion";

const MAX_HISTORY = 3;
const LOCAL_STORAGE_KEY = "categoryHistory";

const News = () => {
 const context = useContext(SearchBarContext);

  if (!context) {
    throw new Error("SearchBarContext must be used within a SearchBarProvider");
  }

  const { debouncedSearch } = context;
  // At the top of your file or in a types file
type NewsItem = {
  title: string;
  [key: string]: any; // Optional, if there are more unknown fields
};


  const [news, setNews] = useState<NewsItem[]>([]);
// full unfiltered articles
 const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);// only what we show
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
    setFilteredNews(news || []);
  } else {
    const filtered = (news || []).filter(n =>
      n?.title?.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
    setFilteredNews(filtered);
  }
}, [debouncedSearch, news]);


const fetchNews = async (category: string) => {
  try {
    const url = `/api/news?category=${category}`;
    const res = await fetch(url);

    if (!res.ok) {
      console.error(`API Error: ${res.status} - ${res.statusText}`);
      setNews([]);
      setFilteredNews([]);
      return;
    }

    const data = await res.json();

    if (!data.articles || !Array.isArray(data.articles)) {
      console.warn("Unexpected API structure", data);
      setNews([]);
      setFilteredNews([]);
      return;
    }

    setNews(data.articles);
    setFilteredNews(data.articles);
  } catch (err) {
    console.log("Error fetching news", err);
    setNews([]);
    setFilteredNews([]);
  }
};
return (
  <div className="px-4 py-6 lg:mr-[10%]">
    <div className="max-w-4xl mx-auto">
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
            description={""}
            url={""}
            urlToImage={""}
            key={article.url || index}
            {...article}
            draggablevalue={article}
          />
        ))}
      </Reorder.Group>
    </div>
  </div>
);

};

export default News;
