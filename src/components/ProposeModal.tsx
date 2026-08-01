"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { Category } from "@/lib/types";

const fieldClass =
  "w-full rounded-xl border border-ocean/15 bg-foam px-3.5 py-3 outline-none focus:border-wave focus:ring-4 focus:ring-wave/15";

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
  const [details, setDetails] = useState("");
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
        details,
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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ocean-deep/45 p-4 sm:items-center">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close"
        onClick={onClose}
      />
      <form
        onSubmit={submit}
        className="relative z-10 w-full max-w-lg rounded-[1.75rem] bg-white p-6 shadow-2xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold">Propose a tip</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 hover:bg-foam"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mb-5 text-sm text-ink/60">
          Good services only. An admin will review before it goes live.
        </p>
        <div className="space-y-3">
          <label className="block text-sm font-medium text-ink/80">
            <span className="mb-1.5 block">Name / place</span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={fieldClass}
            />
          </label>
          <label className="block text-sm font-medium text-ink/80">
            <span className="mb-1.5 block">Category</span>
            <select
              required
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
          <label className="block text-sm font-medium text-ink/80">
            <span className="mb-1.5 block">Details</span>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
              className={fieldClass}
              placeholder="Why recommend them? Address, specialty…"
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-medium text-ink/80">
              <span className="mb-1.5 block">Phone</span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={fieldClass}
              />
            </label>
            <label className="block text-sm font-medium text-ink/80">
              <span className="mb-1.5 block">Email</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={fieldClass}
              />
            </label>
          </div>
          <label className="block text-sm font-medium text-ink/80">
            <span className="mb-1.5 block">Website / link</span>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className={fieldClass}
            />
          </label>
          <label className="block text-sm font-medium text-ink/80">
            <span className="mb-1.5 block">Your name (optional)</span>
            <input
              value={proposedBy}
              onChange={(e) => setProposedBy(e.target.value)}
              className={fieldClass}
            />
          </label>
        </div>
        {error && <p className="mt-3 text-sm text-coral">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="mt-5 w-full rounded-2xl bg-ocean py-3.5 font-semibold text-white transition hover:bg-ocean-deep disabled:opacity-60"
        >
          {busy ? "Sending…" : "Send for review"}
        </button>
      </form>
    </div>
  );
}
