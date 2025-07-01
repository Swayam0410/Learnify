import React, { useState, useEffect } from "react";
import { ExternalLink, Heart } from "lucide-react";
import DraggableCard from "../components/DraggableCard";
type NewsCardProps = {
  title: string;
  description: string;
  url: string;
  author?: string;
  urlToImage: string;
  draggablevalue: boolean;
};

const NewsCard = ({ title, description, url, author, urlToImage ,draggablevalue}: NewsCardProps) => {
  const [isFav, setIsFav] = useState(false);

useEffect(() => {
  const existing = JSON.parse(localStorage.getItem("favorites_news") ?? "[]");
  const found = existing.find((item: NewsCardProps) => item.url === url);
  setIsFav(!!found);
}, [url]);


  const toggleFavorite = () => {
    const key = "favorites_news";
   const existing = JSON.parse(localStorage.getItem("favorites_news") ?? "[]");



    let updated;
    if (isFav) {
      updated = existing.filter((item: NewsCardProps) => item.url !== url);
    } else {
      updated = [...existing, { title, description, url, author, urlToImage }];
    }

    localStorage.setItem(key, JSON.stringify(updated));
    setIsFav(!isFav);
  };

  return (
      <DraggableCard value={draggablevalue}  className="w-full max-w-3xl mx-auto">
    <div className="relative  dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-zinc-200 dark:border-zinc-800 group">
      <div className="absolute top-2 right-2 z-10">
        <button onClick={toggleFavorite} className="text-red-500">
          <Heart fill={isFav ? "red" : "none"} />
        </button>
      </div>
      <div className="w-full h-48 overflow-hidden">
        <img
          src={urlToImage || "https://source.unsplash.com/random/400x300?news"}
          alt={title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-5">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-300">{description}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-zinc-500 italic">By {author}</span>
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 flex items-center gap-1">
            Read <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
    </DraggableCard>
  );
};

export default NewsCard;
