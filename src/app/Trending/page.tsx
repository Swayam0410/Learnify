"use client";
import React, { useEffect, useState, useContext } from "react";
import NewsCard from "../News/NewsCard";
import MovieCard from "../Reccomendation/MovieCard";
import SocialCard from "../Social/SocialCard";
import SearchBarContext from "../Context/SearchbarContext";
import { Reorder } from "framer-motion";

const TrendingPage = () => {
  const [news, setNews] = useState([]);
  const [movies, setMovies] = useState([]);
  const [social, setSocial] = useState([]);
  const [loading, setLoading] = useState(true);

  const context = useContext(SearchBarContext);

  if (!context) {
    throw new Error("SearchBarContext must be used within a SearchBarProvider");
  }

  const { debouncedSearch } = context;
  const search = debouncedSearch?.toLowerCase() || "";

  const newsKey = process.env.NEXT_PUBLIC_NEWS_API_KEY!;
  const traktKey = process.env.NEXT_PUBLIC_TRAKT_API_KEY!;
  const OMDB_API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY!;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "User-Agent": "MyAppName/1.0.0",
    "trakt-api-key": traktKey,
    "trakt-api-version": "2",
  };

  const fetchPosterFromOMDb = async (title: string) => {
    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(title)}`
      );
      const data = await res.json();
      return data?.Poster && data.Poster !== "N/A" ? data.Poster : null;
    } catch (err) {
      console.error(`Failed to fetch poster for ${title}`, err);
      return null;
    }
  };

  const fetchTrendingData = async () => {
    try {
      const [newsRes, moviesRes, redditRes] = await Promise.all([
        fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${newsKey}`),
        fetch(`https://api.trakt.tv/movies/popular`, { headers }),
        fetch("https://www.reddit.com/r/popular.json"),
      ]);

      const news = (await newsRes.json()).articles;

      const rawMovies = await moviesRes.json();
      const movies = await Promise.all(
        rawMovies.slice(0, 10).map(async (item) => {
          const poster = await fetchPosterFromOMDb(item.title);
          return {
            title: item.title,
            year: item.year,
            imdb: item.ids.imdb,
            poster,
          };
        })
      );

      const redditRaw = (await redditRes.json()).data.children;
      const social = redditRaw.map((post) => {
        let thumbnail = "https://www.redditstatic.com/icon.png";

        if (post.data.preview?.images?.[0]?.source?.url) {
          thumbnail = post.data.preview.images[0].source.url.replace(/&amp;/g, "&");
        } else if (post.data.thumbnail?.startsWith("http")) {
          thumbnail = post.data.thumbnail;
        }

        return {
          title: post.data.title,
          author: post.data.author,
          url: `https://reddit.com${post.data.permalink}`,
          thumbnail,
        };
      });

      return { news, movies, social };
    } catch (err) {
      console.error("Failed to fetch trending data", err);
      return { news: [], movies: [], social: [] };
    }
  };

  useEffect(() => {
    const getData = async () => {
      const data = await fetchTrendingData();
      setNews(data.news);
      setMovies(data.movies);
      setSocial(data.social);
      setLoading(false);
    };
    getData();
  }, []);

  if (loading) return <p className="p-6">Loading trending content...</p>;

  const filteredNews = news.filter((item: any) =>
    item.title?.toLowerCase().includes(search)
  );

  const filteredMovies = movies.filter((item: any) =>
    item.title?.toLowerCase().includes(search)
  );

  const filteredSocial = social.filter((item: any) =>
    item.title?.toLowerCase().includes(search)
  );

  const trendingItems = [
    ...filteredNews.map((item) => ({ type: "news", data: item })),
    ...filteredMovies.map((item) => ({ type: "movie", data: item })),
    ...filteredSocial.map((item) => ({ type: "social", data: item })),
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">🔥 Trending</h1>
      <Reorder.Group
        axis="y"
        values={trendingItems}
        onReorder={() => {}}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        {trendingItems.map((item, index) => (
          <Reorder.Item key={index} value={item}>
            {item.type === "news" && <NewsCard article={item.data} />}
            {item.type === "movie" && <MovieCard movie={item.data} />}
            {item.type === "social" && <SocialCard post={item.data} />}
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
};

export default TrendingPage;
