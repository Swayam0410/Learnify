// src/pages/api/news.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { category = "general" } = req.query;

  const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
  const url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${apiKey}`;

  try {
    const apiRes = await fetch(url);
    const data = await apiRes.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch news" });
  }
}
