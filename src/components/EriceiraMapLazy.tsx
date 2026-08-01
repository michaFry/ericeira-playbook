"use client";

import dynamic from "next/dynamic";
import type { MapPin } from "@/lib/map-pins";

export const EriceiraMapLazy = dynamic(
  () => import("./EriceiraMap").then((m) => m.EriceiraMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[min(58vh,28rem)] items-center justify-center rounded-2xl bg-foam text-sm text-ink-muted ring-1 ring-ocean/12 sm:h-[32rem]">
        Loading Ericeira map…
      </div>
    ),
  }
);

export type { MapPin };
