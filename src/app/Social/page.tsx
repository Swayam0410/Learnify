"use client";
import { useEffect, useState, useContext } from "react";
import Header from "../components/Header";
import SocialCard from "./SocialCard";
import SearchBarContext from "../Context/SearchbarContext";
import { Reorder } from "framer-motion";

// Define interface for post structure
interface RedditPost {
  title: string;
  url: string;
  subreddit: string;
  thumbnail: string;
}

const Social = () => {
  const context = useContext(SearchBarContext);
  if (!context) {
    throw new Error("SearchBarContext must be used within a SearchBarProvider");
  }

  const { debouncedSearch } = context;

  const [posts, setPosts] = useState<RedditPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<RedditPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentCategories, setRecentCategories] = useState<string[]>([]);

  const REDDIT_CLIENT_ID = process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID!;
  const REDDIT_CLIENT_SECRET = process.env.NEXT_PUBLIC_REDDIT_CLIENT_SECRET!;

  const getRedditToken = async () => {
    const creds = btoa(`${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`);
    const res = await fetch("https://www.reddit.com/api/v1/access_token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${creds}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    const data = await res.json();
    return data.access_token;
  };

  const fetchFromReddit = async () => {
    setLoading(true);
    const token = await getRedditToken();
    if (!token) return;

    const saved = localStorage.getItem("categoryHistory");
    const categoryList: string[] = saved ? JSON.parse(saved) : [];
    setRecentCategories(categoryList);

    const subredditMap: Record<string, string> = {
      general: "popular",
      health: "health",
      science: "science",
      technology: "technology",
      business: "business",
      entertainment: "entertainment",
      sports: "sports",
    };

    const allPosts: RedditPost[] = [];

    for (const category of categoryList.length ? categoryList : ["general"]) {
      const subreddit = subredditMap[category] || "popular";

      try {
        const res = await fetch(`https://oauth.reddit.com/r/${subreddit}/hot`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "User-Agent": "MyRedditApp/0.1",
          },
        });

        if (!res.ok) {
          console.error(`Failed to fetch subreddit: ${subreddit}`, res.status);
          continue;
        }

        const data = await res.json();

        const posts: RedditPost[] = data.data.children.map((child: any) => {
          let thumbnail = "https://www.redditstatic.com/icon.png";
          if (child.data.preview?.images?.[0]?.source?.url) {
            thumbnail = child.data.preview.images[0].source.url.replace(/&amp;/g, "&");
          } else if (child.data.thumbnail?.startsWith("http")) {
            thumbnail = child.data.thumbnail;
          }

          return {
            title: child.data.title,
            url: `https://reddit.com${child.data.permalink}`,
            subreddit: child.data.subreddit,
            thumbnail,
          };
        });

        allPosts.push(...posts.slice(0, 5));
      } catch (error) {
        console.error("Error fetching Reddit posts:", error);
      }
    }

    setPosts(allPosts);
    setFilteredPosts(allPosts);
    setLoading(false);
  };

  useEffect(() => {
    fetchFromReddit();
  }, []);

  useEffect(() => {
    if (!debouncedSearch) {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter((post) =>
        post.title.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  }, [debouncedSearch, posts]);

  return (
    <div className="p-6">
      <Header />
      <h2 className="text-2xl font-bold mb-2">
        {recentCategories.length
          ? "Reddit posts based on your recent interests"
          : "Popular Reddit posts"}
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
      ) : filteredPosts.length > 0 ? (
        <Reorder.Group
          axis="y"
          values={filteredPosts}
          onReorder={setFilteredPosts}
          className="mt-6 flex flex-col gap-6"
        >
          {filteredPosts.map((post) => (
            <Reorder.Item key={post.url} value={post}>
              <SocialCard
                title={post.title}
                url={post.url}
                subreddit={post.subreddit}
                thumbnail={post.thumbnail}
                draggablevalue={post}
              />
            </Reorder.Item>
          ))}
        </Reorder.Group>
      ) : (
        <p className="text-center text-gray-500">
          No Reddit posts found for “{debouncedSearch}”.
        </p>
      )}
    </div>
  );
};

export default Social;
