import { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  interactive?: boolean;
  size?: number;
  onRate?: (rating: number) => void;
  color?: string;
}

export default function StarRating({
  rating,
  maxRating = 5,
  interactive = false,
  size = 16,
  onRate,
  color = '#00D4FF',
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const displayRating = hoverRating || rating;
  const fullStars = Math.floor(displayRating);
  const hasHalf = displayRating - fullStars >= 0.5;

  return (
    <div className="flex items-center gap-0.5">
      <div className="flex items-center">
        {Array.from({ length: maxRating }, (_, i) => {
          const starValue = i + 1;
          const isFull = i < fullStars;
          const isHalf = i === fullStars && hasHalf;

          return (
            <button
              key={i}
              type="button"
              disabled={!interactive}
              className={`relative ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
              style={{ width: size, height: size }}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              onClick={() => interactive && onRate?.(starValue)}
            >
              {/* Background star (empty) */}
              <Star
                size={size}
                className="absolute inset-0"
                style={{ color: '#333' }}
              />
              {/* Foreground star (filled) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  width: isFull ? '100%' : isHalf ? '50%' : '0%',
                }}
              >
                <Star
                  size={size}
                  className="shrink-0"
                  fill={color}
                  style={{ color }}
                />
              </div>
            </button>
          );
        })}
      </div>
      {rating > 0 && (
        <span className="text-xs ml-1 font-medium" style={{ color: '#ccc' }}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
