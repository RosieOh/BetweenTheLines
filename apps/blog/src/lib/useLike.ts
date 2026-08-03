import { useState } from "react";

const LIKES_KEY = "blog_likes";

function getLikedIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(LIKES_KEY) || "[]");
  } catch {
    return [];
  }
}

export function useLike(postId: string) {
  const [liked, setLiked] = useState(() => getLikedIds().includes(postId));

  const toggle = () => {
    const ids = getLikedIds();
    const next = liked ? ids.filter((id) => id !== postId) : [...ids, postId];
    localStorage.setItem(LIKES_KEY, JSON.stringify(next));
    setLiked(!liked);
  };

  return { liked, toggle };
}
