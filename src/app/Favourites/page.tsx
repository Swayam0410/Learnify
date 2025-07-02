"use client";

import React, { useEffect, useState, useContext } from "react";
import MovieCard from "../Reccomendation/MovieCard";
import SocialCard from "../Social/SocialCard";
import NewsCard from "../News/NewsCard";
import SearchBarContext from "../Context/SearchbarContext";
import { Reorder } from "framer-motion";

interface NewsItem {
  title: string;
  url: string;
  description: string;
  urlToImage: string;
  draggablevalue: string;
}

interface MovieItem {
  title: string;
  imdb: string;
  overview: string;
  poster_path: string;
  draggablevalue: string;
}

interface SocialItem {
  title: string;
  author: string;
  url: string;
  subreddit: string;
  draggablevalue: string;
}

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState<{
    news: NewsItem[];
    movies: MovieItem[];
    social: SocialItem[];
  }>({
    news: [],
    movies: [],
    social: [],
  });

  const context = useContext(SearchBarContext);
  if (!context) {
    throw new Error("SearchBarContext must be used within a SearchBarProvider");
  }

  const { debouncedSearch } = context;
  const search = debouncedSearch?.toLowerCase() || "";

  useEffect(() => {
    try {
      setFavorites({
        news: JSON.parse(localStorage.getItem("favorites_news") || "[]"),
        movies: JSON.parse(localStorage.getItem("favorites_movies") || "[]"),
        social: JSON.parse(localStorage.getItem("favorites_social") || "[]"),
      });
    } catch (error) {
      console.error("Error parsing favorites from localStorage", error);
    }
  }, []);

  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [movieList, setMovieList] = useState<MovieItem[]>([]);
  const [socialList, setSocialList] = useState<SocialItem[]>([]);

  useEffect(() => {
    setNewsList(favorites.news);
    setMovieList(favorites.movies);
    setSocialList(favorites.social);
  }, [favorites]);

  const filteredNews = newsList.filter(item =>
    item.title?.toLowerCase().includes(search)
  );

  const filteredMovies = movieList.filter(item =>
    item.title?.toLowerCase().includes(search)
  );

  const filteredSocial = socialList.filter(item =>
    item.title?.toLowerCase().includes(search) ||
    item.author?.toLowerCase().includes(search)
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Your Favorites</h1>

      <section>
        <h2 className="text-xl font-semibold mb-2">News</h2>
        {filteredNews.length === 0 ? (
          <h2 className="text-center text-zinc-500 dark:text-zinc-400 italic py-4">
            No matching favourite news to display
          </h2>
        ) : (
          <Reorder.Group
            axis="y"
            values={newsList}
            onReorder={setNewsList}
            className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredNews.map((item, idx) => (
              <Reorder.Item key={item.url || idx} value={item}>
                <NewsCard
                  title={item.title}
                  url={item.url}
                  description={item.description}
                  urlToImage={item.urlToImage}
                  draggablevalue={item.draggablevalue}
                />
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-6 mb-2">Movies</h2>
        {filteredMovies.length === 0 ? (
          <h2 className="text-center text-zinc-500 dark:text-zinc-400 italic py-4">
            No matching favourite movies to display
          </h2>
        ) : (
          <Reorder.Group
            axis="y"
            values={movieList}
            onReorder={setMovieList}
            className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredMovies.map((item, idx) => (
              <Reorder.Item key={item.imdb || idx} value={item}>
                <MovieCard
                  title={item.title}
                  imdb={item.imdb}
                  overview={item.overview}
                  poster_path={item.poster_path}
                  draggablevalue={item.draggablevalue}
                />
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-6 mb-2">Social Posts</h2>
        {filteredSocial.length === 0 ? (
          <h2 className="text-center text-zinc-500 dark:text-zinc-400 italic py-4">
            No matching favourite social posts to display
          </h2>
        ) : (
          <Reorder.Group
            axis="y"
            values={socialList}
            onReorder={setSocialList}
            className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredSocial.map((item, idx) => (
              <Reorder.Item key={item.url || idx} value={item}>
                <SocialCard
                  title={item.title}
                  author={item.author}
                  url={item.url}
                  subreddit={item.subreddit}
                  draggablevalue={item.draggablevalue}
                />
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )}
      </section>
    </div>
  );
};

export default FavoritesPage;
