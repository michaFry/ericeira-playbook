"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { LanguagePicker } from "./LanguageFlags";
import { serializeLanguages, type LangCode } from "@/lib/languages";
import type { Category, ServiceKind } from "@/lib/types";

const fieldClass =
  "w-full rounded-xl border border-ocean/20 bg-white px-3.5 py-3 text-base font-medium text-ink outline-none placeholder:text-ink-soft focus:border-ocean focus:ring-4 focus:ring-ocean/15";

export function ProposeModal({
  categories,
  onClose,
  onDone,
}: {
  categories: Category[];
  onClose: () => void;
  onDone: () => void;
}) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [kind, setKind] = useState<ServiceKind>("contact");
  const [details, setDetails] = useState("");
  const [stepsText, setStepsText] = useState("");
  const [address, setAddress] = useState("");
  const [hours, setHours] = useState("");
  const [languages, setLanguages] = useState<LangCode[]>(["pt"]);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [url, setUrl] = useState("");
  const [proposedBy, setProposedBy] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/propose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        categoryId,
        kind,
        details,
        steps: stepsText,
        address,
        hours,
        languages: serializeLanguages(languages),
        phone,
        email,
        url,
        proposedBy,
      }),
    });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not submit");
      return;
    }
    onDone();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ocean-deep/45 p-0 sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close"
        onClick={onClose}
      />
      <form
        onSubmit={submit}
        className="relative z-10 max-h-[92dvh] w-full max-w-lg overflow-y-auto overscroll-contain rounded-t-[1.75rem] bg-white p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl sm:max-h-[90dvh] sm:rounded-[1.75rem] sm:pb-6"
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-ink/15 sm:hidden" aria-hidden />
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold">Propose a tip</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-full hover:bg-foam"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mb-5 text-sm text-ink-muted">
          Contacts or how-tos. An admin will review before it goes live.
        </p>
        <div className="space-y-3">
          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-ink">Type</legend>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  ["contact", "Contact", "Person or business to call"],
                  ["procedure", "How-to", "Step-by-step process"],
                ] as const
              ).map(([id, label, hint]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setKind(id)}
                  className={`rounded-xl px-3 py-2.5 text-left ring-1 transition ${
                    kind === id
                      ? "bg-ocean/10 text-ocean ring-ocean/30"
                      : "bg-white text-ink ring-ocean/15 hover:ring-ocean/30"
                  }`}
                >
                  <span className="block text-sm font-semibold">{label}</span>
                  <span className="mt-0.5 block text-xs opacity-70">{hint}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <label className="block text-sm font-semibold text-ink">
            <span className="mb-1.5 block">
              {kind === "procedure" ? "How-to title" : "Name / place"}
            </span>
            <input
              required
              name="name"
              autoComplete="off"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={fieldClass}
            />
          </label>
          <label className="block text-sm font-semibold text-ink">
            <span className="mb-1.5 block">Category</span>
            <select
              required
              name="category"
              autoComplete="off"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className={fieldClass}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-semibold text-ink">
            <span className="mb-1.5 block">
              {kind === "procedure" ? "Intro" : "Details"}
            </span>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
              className={fieldClass}
              placeholder={
                kind === "procedure"
                  ? "Short context before the steps…"
                  : "Why recommend them? Specialty…"
              }
            />
          </label>
          {kind === "procedure" && (
            <label className="block text-sm font-semibold text-ink">
              <span className="mb-1.5 block">Steps (one per line)</span>
              <textarea
                value={stepsText}
                onChange={(e) => setStepsText(e.target.value)}
                rows={5}
                className={fieldClass}
                placeholder={"Book an appointment\nBring your documents\n…"}
              />
            </label>
          )}
          {kind === "contact" && (
            <>
              <label className="block text-sm font-semibold text-ink">
                <span className="mb-1.5 block">Address (opens in Maps)</span>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={fieldClass}
                  placeholder="Street, postcode, city"
                />
              </label>
              <label className="block text-sm font-semibold text-ink">
                <span className="mb-1.5 block">Opening hours</span>
                <input
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className={fieldClass}
                  placeholder="e.g. Mon–Sat 09:00–18:00"
                />
              </label>
              <fieldset>
                <legend className="mb-2 text-sm font-semibold text-ink">
                  Languages spoken
                </legend>
                <LanguagePicker value={languages} onChange={setLanguages} />
              </fieldset>
            </>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-ink">
              <span className="mb-1.5 block">Phone</span>
              <input
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={fieldClass}
              />
            </label>
            <label className="block text-sm font-semibold text-ink">
              <span className="mb-1.5 block">Email</span>
              <input
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                spellCheck={false}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={fieldClass}
              />
            </label>
          </div>
          <label className="block text-sm font-semibold text-ink">
            <span className="mb-1.5 block">Website / link</span>
            <input
              name="url"
              type="url"
              inputMode="url"
              autoComplete="url"
              spellCheck={false}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className={fieldClass}
            />
          </label>
          <label className="block text-sm font-semibold text-ink">
            <span className="mb-1.5 block">Your name (optional)</span>
            <input
              name="proposedBy"
              autoComplete="name"
              value={proposedBy}
              onChange={(e) => setProposedBy(e.target.value)}
              className={fieldClass}
            />
          </label>
        </div>
        {error && (
          <p className="mt-3 text-sm text-coral" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="mt-5 min-h-12 w-full rounded-2xl bg-ocean py-3.5 font-semibold text-white transition hover:bg-ocean-deep disabled:opacity-60"
        >
          {busy ? "Sending…" : "Send for review"}
        </button>
      </form>
    </div>
  );
}
