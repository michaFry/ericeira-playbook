"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { CategoryIcon } from "./CategoryIcon";
import { CollapsibleContactList } from "./CollapsibleContactList";
import { EriceiraMapLazy } from "./EriceiraMapLazy";
import { ProcedureCard } from "./ProcedureCard";
import { ProposeModal } from "./ProposeModal";
import { ReportModal } from "./ReportModal";
import { SpecialtyGroupHeader } from "./SpecialtyBadge";
import { VoteNoteModal } from "./VoteNoteModal";
import { servicesToMapPins } from "@/lib/map-pins";
import { cn } from "@/lib/cn";
import { isProcedure } from "@/lib/steps";
import { groupContactsBySpecialty } from "@/lib/specialty-groups";
import type {
  Category,
  ServiceWithCategory,
  VoteNotePublic,
} from "@/lib/types";

function voterKey() {
  const key = "playbook_voter";
  let value = localStorage.getItem(key);
  if (!value) {
    value = crypto.randomUUID();
    localStorage.setItem(key, value);
  }
  return value;
}

function reportedSet(): Set<string> {
  try {
    return new Set(
      JSON.parse(localStorage.getItem("playbook_reports") || "[]")
    );
  } catch {
    return new Set();
  }
}

function saveReported(set: Set<string>) {
  localStorage.setItem("playbook_reports", JSON.stringify([...set]));
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
    [
      s.name,
      s.details,
      s.phone,
      s.email,
      s.url,
      s.address,
      s.hours,
      s.google_note,
      s.languages,
      s.steps,
      s.kind,
      s.category_name,
    ]
      .join(" ")
      .toLowerCase()
      .includes(q)
  );
  return {
    categoryMatch: categoryMatch || filtered.length > 0,
    services: categoryMatch && filtered.length === 0 ? services : filtered,
  };
}

function KindFilter({
  value,
  onChange,
}: {
  value: "all" | "contact" | "procedure";
  onChange: (v: "all" | "contact" | "procedure") => void;
}) {
  return (
    <div
      className="grid grid-cols-3 gap-1 rounded-2xl bg-surface p-1 ring-1 ring-ocean/12 sm:flex sm:w-fit sm:gap-1.5 sm:bg-transparent sm:p-0 sm:ring-0"
      role="group"
      aria-label="Filter by type"
    >
      {(
        [
          ["all", "All"],
          ["contact", "Contacts"],
          ["procedure", "How-tos"],
        ] as const
      ).map(([id, label]) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={`pressable min-h-11 rounded-xl px-2 py-2.5 text-center text-xs font-semibold sm:min-h-0 sm:rounded-full sm:px-3 sm:py-1.5 ${
            value === id
              ? "bg-ocean text-white"
              : "bg-transparent text-ink-muted sm:bg-surface sm:ring-1 sm:ring-ocean/12"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export function PlaybookApp({
  categories,
  services: initialServices,
  voteNotes: initialNotes = {},
}: {
  categories: Category[];
  services: ServiceWithCategory[];
  voteNotes?: Record<string, VoteNotePublic[]>;
}) {
  const [query, setQuery] = useState("");
  const [services, setServices] = useState(initialServices);
  const [notesByService, setNotesByService] =
    useState<Record<string, VoteNotePublic[]>>(initialNotes);
  const [voted, setVoted] = useState<Set<string>>(new Set());
  const [reported, setReported] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [kindFilter, setKindFilter] = useState<"all" | "contact" | "procedure">(
    "all"
  );
  const [proposeOpen, setProposeOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<ServiceWithCategory | null>(
    null
  );
  const [noteTarget, setNoteTarget] = useState<ServiceWithCategory | null>(
    null
  );
  const [toast, setToast] = useState("");
  const searching = query.trim().length > 0;

  useEffect(() => {
    setVoted(votedSet());
    setReported(reportedSet());
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  const grouped = useMemo(() => {
    return categories
      .map((category) => {
        const catServices = services.filter((s) => {
          if (s.category_id !== category.id) return false;
          if (kindFilter === "all") return true;
          return (s.kind || "contact") === kindFilter;
        });
        const result = matchesQuery(query, category, catServices);
        if (!result.categoryMatch) return null;
        if (activeCategory && activeCategory !== category.id) return null;
        if (kindFilter !== "all" && result.services.length === 0) return null;
        const sorted = [...result.services].sort(
          (a, b) =>
            (b.votes || 0) - (a.votes || 0) ||
            a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
        );
        return { category, services: sorted };
      })
      .filter(Boolean) as {
      category: Category;
      services: ServiceWithCategory[];
    }[];
  }, [categories, services, query, activeCategory, kindFilter]);

  /** Default home: categories + map only. List opens on category or search. */
  const showList = Boolean(activeCategory) || query.trim().length > 0;

  const mapPins = useMemo(
    () =>
      servicesToMapPins(
        activeCategory || searching
          ? grouped.flatMap((g) => g.services)
          : services,
        activeCategory,
        { localOnly: !activeCategory && !searching }
      ),
    [services, activeCategory, searching, grouped]
  );
  const unlockMapBounds = Boolean(activeCategory) || searching;
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
    if (data.voted) {
      next.add(id);
      const target = services.find((s) => s.id === id);
      if (target) setNoteTarget(target);
    } else {
      next.delete(id);
      // Server deletes this voter's note with the vote — refresh list
      void fetch(`/api/services/${id}/notes`)
        .then((r) => (r.ok ? r.json() : null))
        .then((payload) => {
          if (!payload?.notes) return;
          setNotesByService((prev) => ({ ...prev, [id]: payload.notes }));
        })
        .catch(() => {});
    }
    setVoted(next);
    saveVoted(next);
  }

  async function submitVoteNote(note: string) {
    if (!noteTarget) return;
    const id = noteTarget.id;
    const res = await fetch(`/api/services/${id}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ voterKey: voterKey(), note }),
    });
    if (!res.ok) throw new Error("save failed");
    const data = await res.json();
    setNotesByService((prev) => {
      const others = (prev[id] || []).filter(
        (n) => n.id !== data.note.id
      );
      return { ...prev, [id]: [data.note, ...others] };
    });
    setToast("Thanks — your tip note is on the card.");
  }

  async function submitReport(reason: string) {
    if (!reportTarget) return;
    const id = reportTarget.id;
    const res = await fetch(`/api/services/${id}/report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reporterKey: voterKey(), reason }),
    });
    setReportTarget(null);
    if (!res.ok) {
      setToast("Couldn’t send — try again.");
      return;
    }
    const next = new Set(reported);
    next.add(id);
    setReported(next);
    saveReported(next);
    setToast("Thanks — only the admin will see this.");
  }

  return (
    <div className="relative z-base mx-auto w-full max-w-6xl overflow-x-hidden px-4 pb-[max(5rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] sm:px-6 sm:pt-5">
      <a href="#results" className="skip-link">
        Skip to results
      </a>

      <header className="animate-rise mb-8 sm:mb-10">
        <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-ocean sm:mb-5">
          Ericeira dads
        </p>

        <div className="relative overflow-hidden rounded-[1.5rem] bg-ocean-deep px-4 pb-8 pt-8 text-foam sm:rounded-[2.25rem] sm:px-11 sm:pb-14 sm:pt-14" style={{ boxShadow: "var(--shadow-elevated)" }}>
          <div className="pointer-events-none absolute -right-16 top-0 size-64 rounded-full bg-wave/20 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-10 left-[20%] size-44 rounded-full bg-sun/15 blur-2xl" />

          <p className="font-display text-[clamp(2.15rem,10vw,4.5rem)] font-extrabold leading-[0.95] text-balance text-white">
            Ericeira Dad&apos;s{" "}
            <span className="text-sun">Playbook</span>
          </p>
          <p className="mt-4 text-[0.95rem] leading-relaxed text-white/90 text-pretty sm:mt-5 sm:text-lg">
            Trusted local shortcuts from the now iconic Ericeira Dad&apos;s
            WhatsApp group — people, places, and the tips that never make it
            online.
          </p>

          <div className="mt-6 flex flex-col gap-2.5 sm:mt-9 sm:flex-row sm:items-stretch sm:gap-3">
            <label className="relative flex-1">
              <span className="sr-only">Search the playbook</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ocean/55" />
              <input
                name="q"
                type="text"
                inputMode="search"
                enterKeyHint="search"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                value={query}
                onChange={(e) => {
                  const next = e.target.value;
                  setQuery(next);
                  if (activeCategory) setActiveCategory(null);
                }}
                placeholder='Try "dishwasher", "plumber"…'
                className="w-full rounded-2xl border-0 bg-white py-3.5 pl-12 pr-4 text-base font-medium text-ink outline-none ring-2 ring-transparent transition placeholder:text-ink-soft focus:ring-sun sm:py-4"
                style={{ boxShadow: "var(--shadow-card)" }}
              />
            </label>
            <button
              type="button"
              onClick={() => setProposeOpen(true)}
              className="pressable inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-sun px-5 py-3.5 text-base font-semibold text-ocean-deep hover:brightness-105 sm:min-h-14 sm:py-4"
            >
              <Plus className="h-5 w-5" />
              Propose a tip
            </button>
          </div>

          <p className="mt-4 text-[0.8rem] leading-relaxed text-white/75 text-pretty sm:text-sm">
            Leave a thumbs-up for a tip that worked, or flag a bad experience —
            flags stay private so we can quietly drop bad providers without
            calling anyone out.
          </p>
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

      <section
        className={`animate-rise mb-8 sm:mb-10 ${searching ? "hidden" : ""}`}
        style={{ animationDelay: "70ms" }}
        aria-hidden={searching}
      >
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
            <h2 className="font-display text-xl font-semibold text-ink sm:text-2xl">
              Jump to a need
            </h2>
            {activeCategory && (
              <>
                <KindFilter value={kindFilter} onChange={setKindFilter} />
                <button
                  type="button"
                  onClick={() => setActiveCategory(null)}
                  className="pressable self-start text-sm font-medium text-ocean"
                >
                  Back to map
                </button>
              </>
            )}
          </div>
          <div className="-mx-4 sm:mx-0">
            <div
              className="flex gap-2 overflow-x-auto overscroll-x-contain px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory sm:flex-wrap sm:gap-2.5 sm:overflow-visible sm:rounded-2xl sm:bg-surface sm:p-3 sm:shadow-sm sm:ring-1 sm:ring-ocean/12 sm:snap-none [&::-webkit-scrollbar]:hidden"
              role="list"
              aria-label="Categories"
            >
              {categories.map((cat) => {
                const active = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="listitem"
                    onClick={() =>
                      setActiveCategory((prev) =>
                        prev === cat.id ? null : cat.id
                      )
                    }
                    className={cn(
                      "pressable inline-flex min-h-11 shrink-0 snap-start items-center gap-1.5 rounded-xl px-3 py-2.5 text-left text-sm font-semibold sm:min-h-0",
                      active
                        ? "bg-ocean text-white [box-shadow:var(--shadow-card)]"
                        : "bg-surface text-ink [box-shadow:inset_0_0_0_1px_color-mix(in_srgb,var(--ocean)_15%,transparent)] sm:bg-foam"
                    )}
                  >
                    <CategoryIcon
                      name={cat.icon}
                      className={`h-4 w-4 shrink-0 ${active ? "text-sun" : "text-ocean"}`}
                    />
                    <span className="whitespace-nowrap leading-snug">
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
      </section>

      <main id="results" className="space-y-8 sm:space-y-12">
        {searching && (
          <KindFilter value={kindFilter} onChange={setKindFilter} />
        )}

        {showList && grouped.length === 0 && (
          <div className="surface-card px-5 py-12 text-center sm:px-6 sm:py-16">
            <p className="font-display text-2xl text-balance text-ink">No matches</p>
            <p className="mx-auto mt-2 max-w-[34ch] text-ink-muted text-pretty">
              Try another word, or propose a tip the group hasn&apos;t listed yet.
            </p>
            <button
              type="button"
              onClick={() => setProposeOpen(true)}
              className="pressable mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-ocean px-5 py-2.5 text-sm font-semibold text-white"
            >
              <Plus className="size-4" aria-hidden />
              Propose a tip
            </button>
          </div>
        )}

        {showList &&
          grouped.map(({ category, services: catServices }, index) => (
          <article
            key={category.id}
            id={category.slug}
            className="animate-rise scroll-mt-4"
            style={{ animationDelay: `${Math.min(index, 8) * 35}ms` }}
          >
            <div className="mb-3 flex items-start gap-3 border-b border-ocean/15 pb-3 sm:mb-4 sm:gap-3.5 sm:pb-4">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ocean/10 text-ocean sm:h-10 sm:w-10">
                <CategoryIcon name={category.icon} className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-xl font-semibold text-balance text-ink sm:text-2xl">
                  {category.name}
                </h2>
                {category.description && (
                  <p className="mt-1 text-sm leading-relaxed text-ink-muted text-pretty">
                    {category.description}
                  </p>
                )}
              </div>
            </div>

            {(() => {
              const highlight = query.trim().length > 0;
              const procedures = catServices.filter((s) =>
                isProcedure(s.kind)
              );
              const contacts = catServices.filter(
                (s) => !isProcedure(s.kind)
              );

              if (catServices.length === 0) {
                return (
                  <p className="text-sm text-ink-soft">
                    No tips listed yet.
                  </p>
                );
              }

              return (
                <div className="space-y-4">
                  {procedures.length > 0 && kindFilter !== "contact" && (
                    <section aria-label="How-tos">
                      {contacts.length > 0 && kindFilter === "all" && (
                        <p className="mb-2 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-ocean">
                          How-tos
                        </p>
                      )}
                      <ul className="surface-card divide-y divide-ocean/10">
                        {procedures.map((service) => (
                          <ProcedureCard
                            key={service.id}
                            service={service}
                            highlight={highlight}
                            defaultOpen={
                              procedures.length === 1 && contacts.length === 0
                            }
                          />
                        ))}
                      </ul>
                    </section>
                  )}

                  {contacts.length > 0 && kindFilter !== "procedure" && (
                    <section aria-label="Contacts">
                      {procedures.length > 0 && kindFilter === "all" && (
                        <p className="mb-2 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-ink-soft">
                          Contacts
                        </p>
                      )}
                      {(() => {
                        const groups = groupContactsBySpecialty(contacts);
                        const grouped =
                          groups.length > 1 || Boolean(groups[0]?.specialty);
                        return (
                          <div className={grouped ? "space-y-5" : undefined}>
                            {groups.map((group) => (
                              <div key={group.key}>
                                {grouped && (
                                  <SpecialtyGroupHeader
                                    specialty={group.specialty}
                                  />
                                )}
                                <CollapsibleContactList
                                  services={group.services}
                                  highlight={highlight}
                                  voted={voted}
                                  reported={reported}
                                  notesByService={notesByService}
                                  showSpecialtyBadge={Boolean(
                                    group.services.some((s) => s.specialty)
                                  )}
                                  onVote={toggleVote}
                                  onReport={setReportTarget}
                                />
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </section>
                  )}
                </div>
              );
            })()}
          </article>
        ))}
      </main>

      {/* Keep map mounted (CSS-hidden while searching) so Leaflet doesn't steal search focus */}
      <section
        className={`animate-rise mb-8 sm:mb-10 ${
          searching
            ? "hidden"
            : activeCategory
              ? "mt-8 sm:mt-10"
              : ""
        }`}
        style={{ animationDelay: "100ms" }}
        aria-label={activeCategory ? "Category map" : "Ericeira map"}
        aria-hidden={searching}
      >
        <h2 className="mb-3 font-display text-xl font-semibold text-balance text-ink sm:text-2xl">
          {activeCategory ? "On the map" : "Around Ericeira"}
        </h2>
        <EriceiraMapLazy
          pins={mapPins}
          unlockBounds={unlockMapBounds}
          onSelectPin={(pin) => {
            setActiveCategory(pin.categoryId);
            setKindFilter("all");
          }}
        />
      </section>

      <footer className="mt-12 border-t border-ocean/15 pt-5 text-sm text-ink-soft sm:mt-16 sm:pt-6">
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

      {reportTarget && (
        <ReportModal
          serviceName={reportTarget.name}
          onClose={() => setReportTarget(null)}
          onSubmit={submitReport}
        />
      )}

      {noteTarget && (
        <VoteNoteModal
          serviceName={noteTarget.name}
          onClose={() => setNoteTarget(null)}
          onSubmit={submitVoteNote}
        />
      )}

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 z-modal w-[min(92vw,24rem)] -translate-x-1/2 rounded-2xl bg-ocean-deep px-5 py-3 text-center text-sm font-medium text-white"
          style={{ boxShadow: "var(--shadow-elevated)" }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
