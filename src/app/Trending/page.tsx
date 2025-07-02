"use client";
import React, { useEffect, useState, useContext } from "react";
import NewsCard from "../News/NewsCard";
import MovieCard from "../Reccomendation/MovieCard";
import SocialCard from "../Social/SocialCard";
import SearchBarContext from "../Context/SearchbarContext";
import { Reorder } from "framer-motion";

// Types
interface NewsArticle {
  title: string;
  [key: string]: any;
}

interface Movie {
  title: string;
  year?: number;
  imdb?: string;
  poster?: string | null;
}

interface SocialPost {
  title: string;
  author: string;
  url: string;
  thumbnail: string;
}

type TrendingItem =
  | { id: string; type: "news"; data: NewsArticle }
  | { id: string; type: "movie"; data: Movie }
  | { id: string; type: "social"; data: SocialPost };

const TrendingPage = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [social, setSocial] = useState<SocialPost[]>([]);
  const [trendingItems, setTrendingItems] = useState<TrendingItem[]>([]);
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
      const movies: Movie[] = await Promise.all(
        rawMovies.slice(0, 10).map(async (item: any) => {
          const poster = await fetchPosterFromOMDb(item.title);
          return {
            title: item.title,
            year: item.year,
            imdb: item.ids?.imdb,
            poster,
          };
        })
      );

      const redditRaw = (await redditRes.json()).data.children;
      const social: SocialPost[] = redditRaw.map((post: any) => {
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

  useEffect(() => {
    const filteredNews = news.filter((item) =>
      item.title?.toLowerCase().includes(search)
    );
    const filteredMovies = movies.filter((item) =>
      item.title?.toLowerCase().includes(search)
    );
    const filteredSocial = social.filter((item) =>
      item.title?.toLowerCase().includes(search)
    );

    const combined: TrendingItem[] = [
      ...filteredNews.map((item, idx) => ({
        id: `news-${idx}-${item.title}`,
        type: "news",
        data: item,
      })),
      ...filteredMovies.map((item, idx) => ({
        id: `movie-${idx}-${item.title}`,
        type: "movie",
        data: item,
      })),
      ...filteredSocial.map((item, idx) => ({
        id: `social-${idx}-${item.title}`,
        type: "social",
        data: item,
      })),
    ];

    setTrendingItems(combined);
  }, [news, movies, social, search]);

  if (loading) return <p className="p-6">Loading trending content...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">🔥 Trending</h1>
      <Reorder.Group
        axis="y"
        values={trendingItems}
        onReorder={setTrendingItems}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        {trendingItems.map((item) => (
          <Reorder.Item key={item.id} value={item}>
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
