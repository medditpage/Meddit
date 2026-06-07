"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface PostCardProps extends React.HTMLAttributes<HTMLDivElement> {
  postId: string;
  author: {
    username: string;
    reliabilityRating?: string;
  };
  timeAgo: string;
  title: string;
  content: string;
  upvotes: number;
  commentsCount: number;
  tags: string[];
  isUpvoted?: boolean;
  onUpvote?: () => void;
  verifiedResponse?: {
    text: string;
    excerpt: string;
  };
  attachment?: {
    name: string;
    size: string;
    type: string;
  };
}

export const PostCard = React.forwardRef<HTMLDivElement, PostCardProps>(
  (
    {
      className,
      postId,
      author,
      timeAgo,
      title,
      content,
      upvotes,
      commentsCount,
      tags,
      isUpvoted = false,
      onUpvote,
      verifiedResponse,
      attachment,
      ...props
    },
    ref,
  ) => {
    const router = useRouter();

    return (
      <div
        ref={ref}
        className={cn(
          "bg-white p-5 md:p-6 rounded-xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md",
          className,
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-700 font-bold uppercase text-sm border border-teal-100">
              {author.username.substring(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">
                  {author.username}
                </span>
                {author.reliabilityRating && (
                  <span className="bg-teal-50 text-teal-700 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 border border-teal-100">
                    ★ {author.reliabilityRating}
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-400">{timeAgo}</span>
            </div>
          </div>
        </div>

        {/* Content - Clickable to go to post detail */}
        <div
          className="mb-4 cursor-pointer"
          onClick={() => router.push(`/community/${postId}`)}
        >
          <h2 className="text-lg font-bold text-slate-900 mb-2 leading-tight hover:text-teal-600 transition-colors">
            {title}
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
            {content}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-medium text-teal-700 bg-teal-50 border border-teal-100 px-2.5 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Verified Response Block */}
        {verifiedResponse && (
          <div className="mb-4 p-3 bg-teal-50/50 border border-teal-100 rounded-lg flex gap-3">
            <svg
              className="w-5 h-5 text-teal-600 shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2-1 4-2 8-2 2 0 4 1 6 2a1 1 0 0 1 1 1v7z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <div>
              <p className="text-xs font-bold text-teal-800 mb-1">
                {verifiedResponse.text}
              </p>
              <p className="text-sm text-teal-700 italic">
                "{verifiedResponse.excerpt}"
              </p>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
          {/* Upvote Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUpvote?.();
            }}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold transition-all",
              isUpvoted
                ? "bg-teal-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-teal-50 hover:text-teal-600",
            )}
          >
            <svg
              className="w-4 h-4"
              fill={isUpvoted ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="m5 12 7-7 7 7" />
              <path d="M12 19V5" />
            </svg>
            {upvotes}
          </button>

          {/* Comments Button */}
          <button
            onClick={() => router.push(`/community/${postId}`)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
            </svg>
            {commentsCount} {commentsCount === 1 ? "comment" : "comments"}
          </button>

          {/* Share Button */}
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                navigator.clipboard
                  .writeText(`${window.location.origin}/community/${postId}`)
                  .then(() => alert("Link copied!"));
              }
            }}
            className="ml-auto flex items-center gap-1.5 text-xs text-slate-400 hover:text-teal-600 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
              <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
            </svg>
            Share
          </button>
        </div>
      </div>
    );
  },
);
PostCard.displayName = "PostCard";
