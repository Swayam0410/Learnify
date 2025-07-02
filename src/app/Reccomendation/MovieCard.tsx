"use client";
import { useEffect, useState } from "react";
import React from "react";
import { Heart } from "lucide-react";
import DraggableCard from "../components/DraggableCard";

const MovieCard = ({ title, year, imdb, poster,draggablevalue }) => {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const existing = JSON.parse(localStorage.getItem("favorites_movies") || "[]");
    const found = existing.find((item) => item.imdb === imdb);
    setIsFav(!!found);
  }, [imdb]);

  const toggleFavorite = () => {
    const key = "favorites_movies";
  const existing = JSON.parse(localStorage.getItem("favorites_movies") || "[]");


    let updated;
    if (isFav) {
      updated = existing.filter((item) => item.imdb !== imdb);
    } else {
      updated = [...existing, { title, year, imdb, poster }];
    }

    localStorage.setItem(key, JSON.stringify(updated));
    setIsFav(!isFav);
  };

  return (
    <DraggableCard value={draggablevalue} className="w-full max-w-3xl mx-auto">
    <div className="relative bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-zinc-200 dark:border-zinc-800 group">
      <div className="absolute top-2 right-2 z-10">
        <button onClick={toggleFavorite} className="text-red-500">
          <Heart fill={isFav ? "red" : "none"} />
        </button>
      </div>

      <div className="w-full h-60 overflow-hidden">
        <img
          src={poster || "https://source.unsplash.com/random/400x300?movie"}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">{title}</h2>
        <p className="text-zinc-600 dark:text-zinc-300">Year: {year}</p>
        {imdb && (
          <a
            href={`https://www.imdb.com/title/${imdb}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm mt-2 block"
          >
            View on IMDb
          </a>
        )}
      </div>
    </div>
    </DraggableCard>
  );
};

export default MovieCard;
