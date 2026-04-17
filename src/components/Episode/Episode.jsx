"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Episode({
  img,
  imgAlt,
  title,
  href,
  duration,
  pubDate,
  description,
}) {
  const [imgSrc, setImgSrc] = useState(img || "/logo.png");
  const [hasError, setHasError] = useState(!img);

  // Format publication date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Truncate description to specified character length
  const truncateText = (text, maxLength = 100) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  return (
    <Link href={href}>
      <div className="text-center relative overflow-hidden rounded-lg max-w-[400px] mx-auto">
        <div className="w-full h-[400px]">
          <Image
            src={imgSrc}
            alt={imgAlt}
            width={400}
            height={400}
            className="w-full h-[400px] object-cover"
            onError={() => {
              setImgSrc("/logo.png");
              setHasError(true);
            }}
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-black/50 p-4">
          <h2 className="text-xl font-bold text-white mb-1 text-left line-clamp-2 min-h-[3.5rem]">
            {title}
          </h2>
          <div className="flex items-center gap-2 text-sm text-white/80 mb-2">
            {duration && <span>{duration}</span>}
            {duration && pubDate && <span>•</span>}
            {pubDate && <span>{formatDate(pubDate)}</span>}
          </div>
          {description && (
            <p className="text-sm text-white/90 text-left line-clamp-2">
              {truncateText(description, 120)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
