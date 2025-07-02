"use client";
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import DraggableCard from "../components/DraggableCard"; 

interface RedditPostCardProps {
  title: string;
  url: string;
  subreddit: string;
  thumbnail?: string;
  draggablevalue: any; // required by Reorder.Item
}

const SocialCard: React.FC<RedditPostCardProps> = ({
  title,
  url,
  subreddit,
  thumbnail,
  draggablevalue,
}) => {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const existing = JSON.parse(localStorage.getItem("favorites_social") || "[]");
    setIsFav(existing.some((item) => item.url === url));
  }, [url]);

  const toggleFavorite = () => {
    const key = "favorites_social";
  const existing = JSON.parse(localStorage.getItem("favorites_social") || "[]");


    const updated = isFav
      ? existing.filter((item) => item.url !== url)
      : [...existing, { title, url, subreddit, thumbnail }];

    localStorage.setItem(key, JSON.stringify(updated));
    setIsFav(!isFav);
  };
return (
  <DraggableCard value={draggablevalue} className="w-full max-w-3xl mx-auto">
    <div className="relative border border-gray-300 dark:border-zinc-800 p-4 rounded-2xl shadow-md group transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] bg-white dark:bg-zinc-900">

      {/* Favorite Button */}
      <button
        className="absolute top-3 right-3 text-red-500 transition-transform hover:scale-110"
        onClick={toggleFavorite}
      >
        <Heart fill={isFav ? "red" : "none"} />
      </button>

      {/* Thumbnail */}
      {thumbnail && thumbnail.startsWith("http") && (
        <div className="w-full h-40 overflow-hidden rounded mb-3">
          <img
            src={thumbnail}
            alt="Thumbnail"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

      {/* Title & Link */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-lg font-semibold text-blue-600 hover:underline block transition-colors group-hover:text-blue-700"
      >
        {title}
      </a>

      {/* Subreddit */}
      <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">r/{subreddit}</p>
    </div>
  </DraggableCard>
);

};

export default SocialCard;
