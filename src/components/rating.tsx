"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  rating: number;
  totalStars?: number;
  size?: number;
  className?: string;
  onRatingChange?: (rating: number) => void;
}

export function Rating({
  rating,
  totalStars = 5,
  size = 20,
  className,
  onRatingChange,
}: RatingProps) {
  const fullStars = Math.floor(rating);
  const partialStarWidth = `${(rating % 1) * 100}%`;

  return (
    <div className={cn("flex items-center", className)}>
      {[...Array(totalStars)].map((_, i) => {
        const starValue = i + 1;
        return (
          <div
            key={i}
            className="relative"
            style={{ width: size, height: size }}
            onClick={() => onRatingChange?.(starValue)}
          >
            <Star
              className="absolute text-muted"
              fill="currentColor"
              size={size}
            />
            {starValue <= fullStars && (
              <Star
                className="absolute text-yellow-400"
                fill="currentColor"
                size={size}
              />
            )}
            {starValue === fullStars + 1 && (
              <div className="absolute overflow-hidden" style={{ width: partialStarWidth }}>
                <Star
                  className="text-yellow-400"
                  fill="currentColor"
                  size={size}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
