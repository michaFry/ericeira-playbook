"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ExternalLink,
  Mail,
  Phone,
  Plus,
  Search,
  ThumbsUp,
} from "lucide-react";
import { CategoryIcon } from "./CategoryIcon";
import { ProposeModal } from "./ProposeModal";
import type { Category, ServiceWithCategory } from "@/lib/types";

function voterKey() {
  const key = "playbook_voter";
  let value = localStorage.getItem(key);
  if (!value) {
    value = crypto.randomUUID();
    localStorage.setItem(key, value);
  }
  return value;
}

function votedSet(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem("playbook_votes") || "[]"));
  } catch {
    return new Set();
  }
}

function saveVoted(set: Set<string>) {
  localStorage.setItem("playbook_votes", JSON.stringify([...set]));
}

function matchesQuery(
  query: string,
  category: Category,
  services: ServiceWithCategory[]
) {
  const q = query.toLowerCase().trim();
  if (!q) return { categoryMatch: true, services };
  const haystack = [category.name, category.description, category.slug]
    .join(" ")
    .toLowerCase();
  const categoryMatch = haystack.includes(q);
  const filtered = services.filter((s) =>
    [s.name, s.details, s.phone, s.email, s.url, s.category_name]
      .join(" ")
      .toLowerCase()
      .includes(q)
  );
  return {
    categoryMatch: categoryMatch || filtered.length > 0,
    services: categoryMatch && filtered.length === 0 ? services : filtered,
  };
}

export function PlaybookApp({
  categories,
  services: initialServices,
}: {
  categories: Category[];
  services: ServiceWithCategory[];
}) {
  const [query, setQuery] = useState("");
  const [services, setServices] = useState(initialServices);
  const [voted, setVoted] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [proposeOpen, setProposeOpen] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    setVoted(votedSet());
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  const grouped = useMemo(() => {
    return categories
      .map((category) => {
        const catServices = services.filter((s) => s.category_id === category.id);
        const result = matchesQuery(query, category, catServices);
        if (!result.categoryMatch) return null;
        if (activeCategory && activeCategory !== category.id) return null;
        return { category, services: result.services };
      })
      .filter(Boolean) as {
      category: Category;
      services: ServiceWithCategory[];
    }[];
  }, [categories, services, query, activeCategory]);

  async function toggleVote(id: string) {
    const res = await fetch(`/api/services/${id}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ voterKey: voterKey() }),
    });
    if (!res.ok) return;
    const data = await res.json();
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, votes: data.votes } : s))
    );
    const next = new Set(voted);
    if (data.voted) next.add(id);
    else next.delete(id);
    setVoted(next);
    saveVoted(next);
  }

  return (
    <div className="relative z-[1] mx-auto max-w-6xl px-4 pb-20 pt-5 sm:px-6">
      <a href="#results" className="skip-link">
        Skip to results
      </a>

      <header className="animate-rise mb-10">
        <div className="mb-5 flex items-baseline justify-between gap-3">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-ocean">
            Ericeira dads
          </p>
          <a
            href="/admin"
            className="text-sm text-ink/40 transition hover:text-ocean"
          >
            Admin
          </a>
        </div>

        <div className="relative overflow-hidden rounded-[1.75rem] bg-ocean-deep px-6 pb-12 pt-10 text-foam shadow-[0_28px_70px_rgba(5,53,66,0.32)] sm:rounded-[2.25rem] sm:px-11 sm:pb-14 sm:pt-14">
          <div className="pointer-events-none absolute -right-16 top-0 h-64 w-64 rounded-full bg-wave/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 left-[20%] h-44 w-44 rounded-full bg-sun/20 blur-3xl" />

          <p className="font-display max-w-[11ch] text-[2.75rem] font-extrabold leading-[0.95] tracking-tight text-white sm:max-w-none sm:text-6xl lg:text-7xl">
            Ericeira Dad&apos;s{" "}
            <span className="text-sun">Playbook</span>
          </p>
          <p className="mt-5 max-w-[36ch] text-[0.98rem] leading-relaxed text-white/72 sm:text-lg">
            Trusted local shortcuts from the WhatsApp group — people, places,
            and the tips that never make it online.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:items-stretch">
            <label className="relative flex-1">
              <span className="sr-only">Search the playbook</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ocean/55" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveCategory(null);
                }}
                placeholder='Try "dishwasher", "plumber", "kids"…'
                className="w-full rounded-2xl border-0 bg-white py-4 pl-12 pr-4 text-ink shadow-[0_10px_30px_rgba(5,53,66,0.18)] outline-none ring-2 ring-transparent transition placeholder:text-ink/35 focus:ring-sun"
              />
            </label>
            <button
              type="button"
              onClick={() => setProposeOpen(true)}
              className="pressable inline-flex items-center justify-center gap-2 rounded-2xl bg-sun px-5 py-4 font-semibold text-ocean-deep hover:brightness-105"
            >
              <Plus className="h-5 w-5" />
              Propose a tip
            </button>
          </div>
        </div>

        <div className="wave-strip -mt-px">
          <svg viewBox="0 0 1440 48" preserveAspectRatio="none" aria-hidden>
            <path
              fill="#0d6170"
              d="M0,24 C120,48 240,0 360,24 C480,48 600,0 720,24 C840,48 960,0 1080,24 C1200,48 1320,0 1440,24 L1440,48 L0,48 Z"
            />
            <path
              fill="#0d6170"
              transform="translate(1440)"
              d="M0,24 C120,48 240,0 360,24 C480,48 600,0 720,24 C840,48 960,0 1080,24 C1200,48 1320,0 1440,24 L1440,48 L0,48 Z"
            />
          </svg>
        </div>
      </header>

      {!query && (
        <section className="animate-rise mb-10" style={{ animationDelay: "70ms" }}>
          <div className="mb-3 flex items-end justify-between gap-3">
            <h2 className="font-display text-xl font-semibold text-ink sm:text-2xl">
              Jump to a need
            </h2>
            {activeCategory && (
              <button
                type="button"
                onClick={() => setActiveCategory(null)}
                className="pressable text-sm font-medium text-ocean"
              >
                Clear filter
              </button>
            )}
          </div>
          <div className="chip-scroll">
            {categories.map((cat) => {
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() =>
                    setActiveCategory((prev) => (prev === cat.id ? null : cat.id))
                  }
                  className={`pressable inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2.5 text-left text-sm font-medium ${
                    active
                      ? "bg-ocean text-white shadow-[0_8px_24px_rgba(13,97,112,0.28)]"
                      : "bg-white/75 text-ink ring-1 ring-ocean/10 hover:bg-white hover:ring-ocean/25"
                  }`}
                >
                  <CategoryIcon
                    name={cat.icon}
                    className={`h-4 w-4 ${active ? "text-sun" : "text-ocean"}`}
                  />
                  {cat.name}
                </button>
              );
            })}
          </div>
        </section>
      )}

      <main id="results" className="space-y-12">
        {grouped.length === 0 && (
          <div className="rounded-[1.5rem] bg-white/55 px-6 py-16 text-center ring-1 ring-dashed ring-ocean/20">
            <p className="font-display text-2xl text-ink">No matches</p>
            <p className="mx-auto mt-2 max-w-[34ch] text-ink/60">
              Try another word, or propose a tip the group hasn&apos;t listed yet.
            </p>
          </div>
        )}

        {grouped.map(({ category, services: catServices }, index) => (
          <article
            key={category.id}
            id={category.slug}
            className="animate-rise"
            style={{ animationDelay: `${Math.min(index, 8) * 35}ms` }}
          >
            <div className="mb-4 flex items-start gap-3.5 border-b border-ocean/10 pb-4">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ocean/10 text-ocean">
                <CategoryIcon name={category.icon} className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
                  {category.name}
                </h2>
                {category.description && (
                  <p className="mt-1 max-w-[62ch] text-sm leading-relaxed text-ink/60">
                    {category.description}
                  </p>
                )}
              </div>
            </div>

            {catServices.length === 0 ? (
              <p className="text-sm text-ink/45">No contacts listed yet.</p>
            ) : (
              <ul className="divide-y divide-ocean/8 overflow-hidden rounded-2xl bg-white/70 ring-1 ring-ocean/8">
                {catServices.map((service) => {
                  const isVoted = voted.has(service.id);
                  const highlight = query.trim().length > 0;
                  return (
                    <li
                      key={service.id}
                      className={`px-4 py-4 transition sm:px-5 ${
                        highlight ? "bg-sun/8" : "hover:bg-foam/80"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-ink">{service.name}</h3>
                          {service.details && (
                            <p className="mt-1 max-w-[58ch] text-sm leading-relaxed text-ink/60">
                              {service.details}
                            </p>
                          )}
                          <div className="mt-2.5 flex flex-wrap gap-2">
                            {service.phone && (
                              <a
                                href={`tel:${service.phone.replace(/\s/g, "")}`}
                                className="pressable inline-flex items-center gap-1.5 rounded-lg bg-foam px-2.5 py-1.5 text-xs font-medium text-ocean"
                              >
                                <Phone className="h-3.5 w-3.5" />
                                {service.phone}
                              </a>
                            )}
                            {service.email && (
                              <a
                                href={`mailto:${service.email}`}
                                className="pressable inline-flex items-center gap-1.5 rounded-lg bg-foam px-2.5 py-1.5 text-xs font-medium text-ocean"
                              >
                                <Mail className="h-3.5 w-3.5" />
                                Email
                              </a>
                            )}
                            {service.url && (
                              <a
                                href={service.url}
                                target="_blank"
                                rel="noreferrer"
                                className="pressable inline-flex items-center gap-1.5 rounded-lg bg-foam px-2.5 py-1.5 text-xs font-medium text-ocean"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                                Link
                              </a>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleVote(service.id)}
                          className={`pressable inline-flex shrink-0 flex-col items-center rounded-xl px-3 py-2 text-xs font-semibold tabular-nums ${
                            isVoted
                              ? "bg-ocean text-white"
                              : "bg-foam text-ocean hover:bg-ocean/10"
                          }`}
                          aria-label="Vote for this tip"
                          aria-pressed={isVoted}
                        >
                          <ThumbsUp className="mb-1 h-4 w-4" />
                          {service.votes}
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </article>
        ))}
      </main>

      <footer className="mt-16 border-t border-ocean/10 pt-6 text-sm text-ink/45">
        <p>
          Built from Michael&apos;s Ericeira Dad&apos;s secret playbook. Vote for
          the good ones. Propose what&apos;s missing.
        </p>
      </footer>

      {proposeOpen && (
        <ProposeModal
          categories={categories}
          onClose={() => setProposeOpen(false)}
          onDone={() => {
            setProposeOpen(false);
            setToast("Thanks — your tip is waiting for admin approval.");
          }}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[50] -translate-x-1/2 rounded-2xl bg-ocean-deep px-5 py-3 text-sm font-medium text-white shadow-[0_16px_40px_rgba(5,53,66,0.35)]">
          {toast}
        </div>
      )}
    </div>
  );
}
