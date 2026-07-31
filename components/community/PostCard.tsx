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
    role?: string;
  };
  timeAgo: string;
  title: string;
  content: string;
  imageUrl?: string;
  upvotes: number;
  commentsCount: number;
  tags: string[];
  category?: string;
  isUpvoted?: boolean;
  onUpvote?: () => void;
  onReport?: () => void;
  verifiedResponse?: {
    text: string;
    excerpt: string;
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
      imageUrl,
      upvotes,
      commentsCount,
      tags,
      category = "General",
      isUpvoted = false,
      onUpvote,
      onReport,
      verifiedResponse,
      ...props
    },
    ref,
  ) => {
    const router = useRouter();

    return (
      <div
        ref={ref}
        className={cn(
          "bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col sm:flex-row overflow-hidden group text-slate-900 dark:text-slate-100",
          className,
        )}
        {...props}
      >
        {/* Left: Vertical Upvote / Score Pill */}
        <div className="bg-slate-50 dark:bg-slate-950/80 sm:w-14 shrink-0 p-2 sm:py-3 flex sm:flex-col items-center justify-between sm:justify-start gap-2 border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-800">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUpvote?.();
            }}
            className={cn(
              "p-1.5 rounded-lg transition-all active:scale-90 flex items-center justify-center",
              isUpvoted
                ? "bg-teal-600 text-white shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-200 dark:hover:bg-slate-800",
            )}
            title={isUpvoted ? "Remove upvote" : "Upvote post"}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
            </svg>
          </button>

          <span
            className={cn(
              "font-bold text-xs tracking-tight",
              isUpvoted ? "text-teal-600 dark:text-teal-400" : "text-slate-700 dark:text-slate-300",
            )}
          >
            {upvotes}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onUpvote?.();
            }}
            className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-all"
            title="Downvote"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
        </div>

        {/* Right: Main Post Content & Metadata */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            {/* Header: Subreddit m/Category + Author u/username + timeAgo */}
            <div className="flex items-center justify-between mb-2 text-xs">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-extrabold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 cursor-pointer transition-colors">
                  m/{category}
                </span>
                <span className="text-slate-400 dark:text-slate-600">•</span>
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  Posted by{" "}
                  <span className="font-bold text-slate-800 dark:text-slate-200 hover:underline cursor-pointer">
                    u/{author.username.replace(/\s+/g, "_").toLowerCase()}
                  </span>
                </span>
                {author.role && (
                  <span
                    className={cn(
                      "text-[10px] font-bold px-1.5 py-0.2 rounded-full border uppercase tracking-wider",
                      author.role === "doctor"
                        ? "bg-teal-100 dark:bg-teal-500/20 text-teal-800 dark:text-teal-300 border-teal-300 dark:border-teal-500/40"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700",
                    )}
                  >
                    {author.role === "doctor" ? "👨‍⚕️ Doctor" : "👤 Patient"}
                  </span>
                )}
                {author.reliabilityRating && (
                  <span className="bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 text-[10px] font-bold px-1.5 py-0.2 rounded border border-amber-300 dark:border-amber-500/30">
                    ★ {author.reliabilityRating}
                  </span>
                )}
                <span className="text-slate-400 dark:text-slate-600">•</span>
                <span className="text-slate-500 dark:text-slate-400">{timeAgo}</span>
              </div>
            </div>

            {/* Post Title & Content Body (Clickable) */}
            <div
              className="cursor-pointer group/title"
              onClick={() => router.push(`/community/${postId}`)}
            >
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mb-2 leading-snug group-hover/title:text-teal-600 dark:group-hover/title:text-teal-400 transition-colors">
                {title}
              </h2>
              <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed line-clamp-3 mb-3">
                {content}
              </p>
            </div>

            {/* Uploaded Clinical Image Display */}
            {imageUrl && (
              <div
                className="mb-3 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 cursor-pointer max-h-96 flex items-center justify-center"
                onClick={() => router.push(`/community/${postId}`)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-auto object-cover max-h-96 hover:scale-102 transition-transform duration-200"
                  loading="lazy"
                />
              </div>
            )}

            {/* Tags / Categories */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 px-2.5 py-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Verified Response Block */}
            {verifiedResponse && (
              <div className="mb-3 p-3 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800/60 rounded-xl flex gap-2.5">
                <span className="text-base text-teal-600 dark:text-teal-400">🩺</span>
                <div className="text-xs">
                  <p className="font-bold text-teal-900 dark:text-teal-200">{verifiedResponse.text}</p>
                  <p className="text-teal-800/80 dark:text-teal-300/80 italic mt-0.5">&quot;{verifiedResponse.excerpt}&quot;</p>
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="flex items-center gap-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400">
            {/* Comments Counter */}
            <button
              onClick={() => router.push(`/community/${postId}`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
              </svg>
              <span>{commentsCount} {commentsCount === 1 ? "Comment" : "Comments"}</span>
            </button>

            {/* Share Link */}
            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  navigator.clipboard
                    .writeText(`${window.location.origin}/community/${postId}`)
                    .then(() => alert("Copied Meddit link to clipboard!"));
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0-12.814a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5zm0 12.814a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5z" />
              </svg>
              <span>Share</span>
            </button>

            {/* Report */}
            {onReport && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReport();
                }}
                className="ml-auto text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                title="Report Post"
              >
                🚩
              </button>
            )}
          </div>
        </div>
      </div>
    );
  },
);
PostCard.displayName = "PostCard";
