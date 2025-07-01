"use client";
import { useEffect, useState, useContext } from "react";
import MovieCard from "./MovieCard";
import Header from "../components/Header";
import SearchBarContext from "../Context/SearchbarContext";
import { Reorder } from "framer-motion";

const Recommendation = () => {
   const context = useContext(SearchBarContext);

  if (!context) {
    throw new Error("SearchBarContext must be used within a SearchBarProvider");
  }

  const { debouncedSearch } = context;
  

  const [movies, setMovies] = useState([]);          // all movies
  const [filteredMovies, setFilteredMovies] = useState([]); // filtered ones
  const [loading, setLoading] = useState(true);
  const [recentCategories, setRecentCategories] = useState([]);

  const TRAKT_API_KEY = process.env.NEXT_PUBLIC_TRAKT_API_KEY;
  const OMDBB_API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;

  const fetchPosterFromOMDb = async (title) => {
    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${OMDBB_API_KEY}&t=${encodeURIComponent(title)}`
      );
      const data = await res.json();
      return data?.Poster && data.Poster !== "N/A" ? data.Poster : null;
    } catch (err) {
      console.error(`Failed to fetch poster for ${title}`, err);
      return null;
    }
  };

  const fetchFromTrakt = async () => {
    setLoading(true);
    const saved = localStorage.getItem("categoryHistory");
    const categoryList = saved ? JSON.parse(saved) : [];
    setRecentCategories(categoryList);

    const genreMap = {
      general: "",
      health: "documentary",
      science: "science-fiction",
      technology: "science-fiction",
      business: "history",
      entertainment: "comedy",
      sports: "sports",
    };

    const headers = {
      "Content-Type": "application/json",
      "User-Agent": "MyAppName/1.0.0",
      "trakt-api-key": TRAKT_API_KEY,
      "trakt-api-version": "2",
    };

    try {
      const allResults = [];

      for (const category of categoryList.length ? categoryList : ["general"]) {
        const traktGenre = genreMap[category] || "drama";

        const res = await fetch(
          `https://api.trakt.tv/movies/popular?genres=${traktGenre}`,
          { headers }
        );

        if (!res.ok) {
          console.error(`Failed to fetch for genre: ${traktGenre}`, res.status);
          continue;
        }

        const data = await res.json();

        for (const movie of data) {
          const poster = await fetchPosterFromOMDb(movie.title);

          allResults.push({
            title: movie.title,
            year: movie.year,
            imdb: movie.ids?.imdb,
            traktId: movie.ids?.trakt,
            slug: movie.ids?.slug,
            poster,
          });
        }
      }

      setMovies(allResults);
      setFilteredMovies(allResults); // initialize filtered as full list
    } catch (err) {
      console.error("Error fetching from Trakt:", err);
    } finally {
      setLoading(false);
    }
  };

  // filter whenever search or movie list changes
  useEffect(() => {
    if (!debouncedSearch) {
      setFilteredMovies(movies); // reset to all
    } else {
      const filtered = movies.filter(movie =>
        movie.title.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
      setFilteredMovies(filtered);
    }
  }, [debouncedSearch, movies]);

  useEffect(() => {
    fetchFromTrakt();
  }, []);

  return (
    <div className="p-6">
      <Header />
      <h2 className="text-2xl font-bold mb-2">
        {recentCategories.length
          ? "Recommended movies and shows based on your recent searches"
          : "Our recommended movies and shows"}
      </h2>

      {recentCategories.length > 0 && (
        <p className="text-sm text-gray-500 mb-6">
          Recent categories:{" "}
          {recentCategories.map((cat, idx) => (
            <span
              key={idx}
              className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full mr-2"
            >
              {cat}
            </span>
          ))}
        </p>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid"></div>
        </div>
      ) : (
         <Reorder.Group
          axis="y"
          values={filteredMovies}
          onReorder={setFilteredMovies}
          className="mt-6 flex flex-col gap-6"
        
        >
          {filteredMovies.length > 0 ? (
            filteredMovies.map((movie, idx) => (
                <Reorder.Item key={movie.traktId} value={movie}>
              <MovieCard
                key={idx}
                title={movie.title}
                year={movie.year}
                imdb={movie.imdb}
                poster={movie.poster}
                draggablevalue={movie}
              />
              </Reorder.Item>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500">
              No movies found for “{debouncedSearch}”.
            </p>
          )}
          </Reorder.Group>
       
      )}
    </div>
  );
};

export default Recommendation;
