"use client";

import React, { useEffect, useState, useContext } from "react";
import MovieCard from "../Reccomendation/MovieCard";
import SocialCard from "../Social/SocialCard";
import NewsCard from "../News/NewsCard";
import SearchBarContext from "../Context/SearchbarContext";
import { Reorder } from "framer-motion";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState({
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
    setFavorites({
      news: JSON.parse(localStorage.getItem("favorites_news") || "[]"),
      movies: JSON.parse(localStorage.getItem("favorites_movies") || "[]"),
      social: JSON.parse(localStorage.getItem("favorites_social") || "[]"),
    });
  }, []);

  // State for reorderable lists
  const [newsList, setNewsList] = useState<any[]>([]);
  const [movieList, setMovieList] = useState<any[]>([]);
  const [socialList, setSocialList] = useState<any[]>([]);

  useEffect(() => {
    setNewsList(favorites.news);
    setMovieList(favorites.movies);
    setSocialList(favorites.social);
  }, [favorites]);

  const filteredNews = newsList.filter((item: any) =>
    item.title?.toLowerCase().includes(search)
  );

  const filteredMovies = movieList.filter((item: any) =>
    item.title?.toLowerCase().includes(search)
  );

  const filteredSocial = socialList.filter((item: any) =>
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
            axis="x"
            values={newsList}
            onReorder={setNewsList}
            className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredNews.map((item, idx) => (
              <Reorder.Item key={item.url || idx} value={item}>
                <NewsCard {...item} />
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
            axis="x"
            values={movieList}
            onReorder={setMovieList}
            className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredMovies.map((item, idx) => (
              <Reorder.Item key={item.imdb || idx} value={item}>
                <MovieCard {...item} />
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
            axis="x"
            values={socialList}
            onReorder={setSocialList}
            className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredSocial.map((item, idx) => (
              <Reorder.Item key={item.url || idx} value={item}>
                <SocialCard {...item} />
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )}
      </section>
    </div>
  );
};

export default FavoritesPage;

