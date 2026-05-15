"use client";

import Link from "next/link";

export function EmptyDiscoveryPrompt({
  iconClassName,
  title,
  description,
  onClick,
}: {
  iconClassName: string;
  title: string;
  description: string;
  onClick?: () => void;
}) {
  return (
    <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden text-center">
      <i className={`${iconClassName} ph-4x text-neutral-900`} />
      <p className="mt-6 text-2xl font-bold">{title}</p>
      <p className="mt-2 max-w-xs text-sm text-neutral-500">{description}</p>
      <Link
        href="/search"
        onClick={onClick}
        className="mt-6 rounded-full bg-blue-500 px-5 py-3 text-sm font-medium text-white opacity-90 transition-opacity hover:opacity-100"
      >
        Découvrir plus d’articles
      </Link>
    </div>
  );
}
