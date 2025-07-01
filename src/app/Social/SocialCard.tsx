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
    const existing = JSON.parse(localStorage.getItem(key) || "[]");

    const updated = isFav
      ? existing.filter((item) => item.url !== url)
      : [...existing, { title, url, subreddit, thumbnail }];

    localStorage.setItem(key, JSON.stringify(updated));
    setIsFav(!isFav);
  };

  return (
    <DraggableCard value={draggablevalue} className="w-full max-w-3xl mx-auto">
      <div className="border border-gray-300 p-4 rounded-lg shadow hover:shadow-lg transition  relative">
        <button className="absolute top-2 right-2 text-red-500" onClick={toggleFavorite}>
          <Heart fill={isFav ? "red" : "none"} />
        </button>
        {thumbnail && thumbnail.startsWith("http") && (
          <img
            src={thumbnail}
            alt="Thumbnail"
            className="w-full h-40 object-cover mb-2 rounded"
          />
        )}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg font-semibold text-blue-600 hover:underline block mb-1"
        >
          {title}
        </a>
        <p className="text-sm text-gray-500">r/{subreddit}</p>
      </div>
    </DraggableCard>
  );
};

export default SocialCard;
