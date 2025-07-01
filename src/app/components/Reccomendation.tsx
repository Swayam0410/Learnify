"use client";
import { useEffect, useState } from "react";
const Reccomendation=()=>{




const fetchFromTrakt = async () => {
  const saved = localStorage.getItem("categoryHistory");
  const categoryList: string[] = saved ? JSON.parse(saved) : [];

  const genreMap: Record<string, string> = {
  general: "drama",
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
    const allResults: any[] = [];

    for (const category of categoryList) {
      const traktGenre = genreMap[category] || "drama";

      const res = await fetch(`https://api.trakt.tv/movies/popular?genres=${traktGenre}`, {
        headers,
      });

      if (!res.ok) {
        console.error(`Failed to fetch for genre: ${traktGenre}`, res.status);
        continue;
      }

      const data = await res.json();
      allResults.push(...data);
    }

    console.log("Trakt Movies:", allResults);
    return allResults;
  } catch (err) {
    console.error("Error fetching from Trakt:", err);
    return [];
  }
};


useEffect(() => {
  fetchFromTrakt();
}, []);
return <div>HII</div>
}
export default Reccomendation;


