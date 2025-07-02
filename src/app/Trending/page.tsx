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
  description: string;
  url: string;
  author?: string;
  urlToImage: string;
  draggablevalue: object;

}

interface Movie {
  title: any;
  year: any;
  imdb: any;
  poster: any;
  draggablevalue:any;
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
  const [trendingItems, setTrendingItems] = useState<string[]>([]);
  const [itemMap, setItemMap] = useState<Record<string, TrendingItem>>({});
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
        fetch(`/api/news`),
        fetch(`https://api.trakt.tv/movies/popular`, { headers }),
        fetch("https://www.reddit.com/r/popular.json"),
      ]);

      const newsData = (await newsRes.json()).articles ?? [];
      const rawMovies = await moviesRes.json();
      const redditData = (await redditRes.json()).data?.children ?? [];

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

      const social: SocialPost[] = redditData.map((post: any) => {
        let thumbnail = "https://www.redditstatic.com/icon.png";
        if (post.data?.preview?.images?.[0]?.source?.url) {
          thumbnail = post.data.preview.images[0].source.url.replace(/&amp;/g, "&");
        } else if (post.data?.thumbnail?.startsWith("http")) {
          thumbnail = post.data.thumbnail;
        }

        return {
          title: post.data.title,
          author: post.data.author,
          url: `https://reddit.com${post.data.permalink}`,
          thumbnail,
        };
      });

      return { news: newsData, movies, social };
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

    const newItems: Record<string, TrendingItem> = {};

    const combined: string[] = [
      ...filteredNews.map((item, idx) => {
        const id = `news-${idx}-${item.title}`;
        newItems[id] = { id, type: "news", data: item };
        return id;
      }),
      ...filteredMovies.map((item, idx) => {
        const id = `movie-${idx}-${item.title}`;
        newItems[id] = { id, type: "movie", data: item };
        return id;
      }),
      ...filteredSocial.map((item, idx) => {
        const id = `social-${idx}-${item.title}`;
        newItems[id] = { id, type: "social", data: item };
        return id;
      }),
    ];

    setItemMap(newItems);
    setTrendingItems(combined);
  }, [news, movies, social, search]);

  if (loading) return <p className="p-6">Loading trending content...</p>;

  return (
    <div className="p-4 lg:mr-[10%]">
      <h1 className="text-2xl font-bold mb-4">🔥 Trending</h1>
      <Reorder.Group
        axis="y"
        values={trendingItems}
        onReorder={setTrendingItems}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        {trendingItems.map((id) => {
          const item = itemMap[id];
          if (!item) return null;

          return (
            <Reorder.Item key={id} value={id}>
              {item.type === "news" && <NewsCard {...item.data} />}
              {item.type === "movie" && <MovieCard {...item.data} />}
              {item.type === "social" && <SocialCard subreddit={""} draggablevalue={undefined} {...item.data} />}
            </Reorder.Item>
          );
        })}
      </Reorder.Group>
    </div>
  );
};

export default TrendingPage;
