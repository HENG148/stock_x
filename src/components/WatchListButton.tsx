'use client'

import { useState } from "react";
import { toggleWatchlist } from "../server/recommend";
import { HeartIcon } from "./icons/icon";

interface WatchlistButtonProps {
  productId: string;
  userId: string;
  isWatched: boolean;
}

export function WatchlistButton({
  productId,
  userId,
  isWatched
}: WatchlistButtonProps) {
  const [watched, setWatched] = useState(isWatched);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true)
    setWatched((prev) => !prev)
    try {
      await toggleWatchlist({ productId, userId, isWatched: watched})
    } catch {
      setWatched((prev) => !prev)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button 
      onClick={handleClick}
      aria-label={watched ? "Remove from watchlist" : "Add to watchlist"}
      className="w-7 h-7 flex items-center justify-center rounded-full bg-white/70 backdrop-blur-sm hover:bg-white transition-colors shadow-sm"
    >
      <HeartIcon filled={watched} />
      </button>
  )
}