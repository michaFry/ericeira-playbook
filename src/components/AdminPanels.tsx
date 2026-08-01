"use client";

import { useRef, useState } from "react";
import { CategoryIcon, ICON_OPTIONS } from "@/components/CategoryIcon";
import { LanguageFlags, LanguagePicker } from "@/components/LanguageFlags";
import {
  parseLanguages,
  serializeLanguages,
  type LangCode,
} from "@/lib/languages";
import { SPECIALTY_OPTIONS } from "@/lib/specialties";
import { parseSteps } from "@/lib/steps";
import type { Category, ServiceWithCategory } from "@/lib/types";

export const inputClass =
  "w-full rounded-xl border border-ocean/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-wave focus:ring-4 focus:ring-wave/15";

function emptyServiceForm(categories: Category[]) {
  return {
    name: "",
    categoryId: categories[0]?.id || "",
    details: "",
    address: "",
    hours: "",
    languages: ["pt"] as LangCode[],
    kind: "contact" as "contact" | "procedure",
    specialty: "",
    stepsText: "",
    googleNote: "",
    rating: "",
    phone: "",
    email: "",
    url: "",
    status: "approved" as ServiceWithCategory["status"],
    reviewsCount: 0,
  };
}

function formFromService(s: ServiceWithCategory) {
  const langs = parseLanguages(s.languages);
  return {
    name: s.name,
    categoryId: s.category_id,
    details: s.details || "",
    address: s.address || "",
    hours: s.hours || "",
    languages: langs.length ? langs : (["pt"] as LangCode[]),
    kind: (s.kind === "procedure" ? "procedure" : "contact") as
      | "contact"
      | "procedure",
    specialty: s.specialty || "",
    stepsText: parseSteps(s.steps).join("\n"),
    googleNote: s.google_note || "",
    rating: s.rating != null ? String(s.rating) : "",
    phone: s.phone || "",
    email: s.email || "",
    url: s.url || "",
    status: s.status,
    reviewsCount: s.reviews_count || 0,
  };
}

export function ServicesAdmin({
  categories,
  services,
  onAction,
}: {
  categories: Category[];
  services: ServiceWithCategory[];
  onAction: (payload: Record<string, unknown>) => Promise<void>;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(() => emptyServiceForm(categories));
  const [filter, setFilter] = useState("");

  const filtered = services.filter((s) =>
    [
      s.name,
      s.details,
      s.address,
      s.hours,
      s.languages,
      s.google_note,
      s.category_name,
      s.phone,
      s.status,
      s.specialty,
    ]
      .join(" ")
      .toLowerCase()
      .includes(filter.toLowerCase())
  );

  function setField<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function startEdit(s: ServiceWithCategory) {
    setEditingId(s.id);
    setForm(formFromService(s));
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyServiceForm(categories));
  }

  return (
    <section className="space-y-6">
      <form
        ref={formRef}
        className="rounded-2xl border border-ocean/10 bg-white p-5"
        onSubmit={async (e) => {
          e.preventDefault();
          const payload = {
            name: form.name,
            categoryId: form.categoryId,
            details: form.details,
            address: form.address,
            hours: form.hours,
            languages: serializeLanguages(form.languages),
            kind: form.kind,
            specialty: form.specialty,
            steps: form.stepsText,
            googleNote: form.googleNote,
            rating: form.rating,
            reviewsCount: form.reviewsCount,
            phone: form.phone,
            email: form.email,
            url: form.url,
            status: form.status,
          };
          if (editingId) {
            await onAction({
              action: "updateService",
              id: editingId,
              ...payload,
            });
            cancelEdit();
          } else {
            await onAction({ action: "createService", ...payload });
            setForm(emptyServiceForm(categories));
          }
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-xl font-semibold">
            {editingId ? "Edit service" : "Add service"}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-sm font-medium text-ocean"
            >
              Cancel edit
            </button>
          )}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            required
            placeholder="Name"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            className={inputClass}
          />
          <select
            value={form.categoryId}
            onChange={(e) => setField("categoryId", e.target.value)}
            className={inputClass}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            placeholder="Address (Google Maps)"
            value={form.address}
            onChange={(e) => setField("address", e.target.value)}
            className={`${inputClass} sm:col-span-2`}
          />
          <input
            placeholder="Opening hours"
            value={form.hours}
            onChange={(e) => setField("hours", e.target.value)}
            className={inputClass}
          />
          <input
            placeholder="Rating (e.g. 4.5)"
            value={form.rating}
            onChange={(e) => setField("rating", e.target.value)}
            className={inputClass}
          />
          <div className="sm:col-span-2">
            <p className="mb-2 text-sm font-medium text-ink">Type</p>
            <div className="mb-3 grid grid-cols-2 gap-2">
              {(
                [
                  ["contact", "Contact"],
                  ["procedure", "How-to"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setField("kind", id)}
                  className={`rounded-xl px-3 py-2 text-sm font-semibold ring-1 ${
                    form.kind === id
                      ? "bg-ocean/10 text-ocean ring-ocean/30"
                      : "bg-white text-ink ring-ocean/15"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {form.kind === "procedure" && (
              <textarea
                placeholder="Steps — one per line"
                value={form.stepsText}
                onChange={(e) => setField("stepsText", e.target.value)}
                className={inputClass}
                rows={4}
              />
            )}
          </div>
          {form.kind === "contact" && (
            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-medium text-ink">
                Specialty (trades / health / wood / openings)
              </p>
              <select
                value={form.specialty}
                onChange={(e) => setField("specialty", e.target.value)}
                className={inputClass}
              >
                <option value="">None</option>
                {SPECIALTY_OPTIONS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          {form.kind === "contact" && (
            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-medium text-ink">
                Languages spoken
              </p>
              <LanguagePicker
                value={form.languages}
                onChange={(langs) => setField("languages", langs)}
              />
            </div>
          )}
          {editingId && (
            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-medium text-ink">Status</p>
              <select
                value={form.status}
                onChange={(e) =>
                  setField(
                    "status",
                    e.target.value as ServiceWithCategory["status"]
                  )
                }
                className={inputClass}
              >
                <option value="approved">Approved</option>
                <option value="hidden">Hidden</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          )}
          <input
            placeholder="Google note / summary"
            value={form.googleNote}
            onChange={(e) => setField("googleNote", e.target.value)}
            className={`${inputClass} sm:col-span-2`}
          />
          <input
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setField("phone", e.target.value)}
            className={inputClass}
          />
          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setField("email", e.target.value)}
            className={inputClass}
          />
          <input
            placeholder="URL"
            value={form.url}
            onChange={(e) => setField("url", e.target.value)}
            className={inputClass}
          />
          <textarea
            placeholder="Details"
            value={form.details}
            onChange={(e) => setField("details", e.target.value)}
            className={`${inputClass} sm:col-span-2`}
            rows={2}
          />
        </div>
        <button
          type="submit"
          className="mt-4 rounded-xl bg-ocean px-4 py-2.5 text-sm font-semibold text-white"
        >
          {editingId ? "Save changes" : "Add"}
        </button>
      </form>

      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter services…"
        className={inputClass}
      />

      <ul className="space-y-2">
        {filtered.map((s) => (
          <li
            key={s.id}
            className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/80 px-4 py-3 ring-1 ${
              editingId === s.id ? "ring-ocean/40" : "ring-ocean/8"
            }`}
          >
            <div>
              <p className="text-xs text-ocean">
                {s.category_name} · {s.kind || "contact"}
                {s.specialty ? ` · ${s.specialty}` : ""} · {s.status} ·{" "}
                {s.votes} votes
              </p>
              <p className="font-semibold">{s.name}</p>
              {s.languages && (
                <div className="mt-1">
                  <LanguageFlags languages={s.languages} />
                </div>
              )}
              {s.address && (
                <p className="text-sm text-ocean/80">{s.address}</p>
              )}
              {s.hours && <p className="text-sm text-ink/60">{s.hours}</p>}
              {s.google_note && (
                <p className="text-sm text-ink/55">{s.google_note}</p>
              )}
              {s.details && <p className="text-sm text-ink/55">{s.details}</p>}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => startEdit(s)}
                className="rounded-lg bg-ocean/10 px-3 py-1.5 text-sm font-medium text-ocean"
              >
                Edit
              </button>
              {s.status === "hidden" ? (
                <button
                  type="button"
                  onClick={() =>
                    onAction({
                      action: "setStatus",
                      id: s.id,
                      status: "approved",
                    })
                  }
                  className="rounded-lg bg-wave/15 px-3 py-1.5 text-sm font-medium text-ocean"
                >
                  Restore
                </button>
              ) : s.status === "approved" ? (
                <button
                  type="button"
                  onClick={() =>
                    onAction({
                      action: "setStatus",
                      id: s.id,
                      status: "hidden",
                    })
                  }
                  className="rounded-lg bg-foam px-3 py-1.5 text-sm font-medium text-ink-muted ring-1 ring-ocean/10"
                >
                  Hide
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Delete “${s.name}”?`)) {
                    onAction({ action: "deleteService", id: s.id });
                  }
                }}
                className="rounded-lg bg-coral/10 px-3 py-1.5 text-sm font-medium text-coral"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function CategoriesAdmin({
  categories,
  onAction,
}: {
  categories: Category[];
  onAction: (payload: Record<string, unknown>) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("Waves");

  return (
    <section className="space-y-6">
      <form
        className="rounded-2xl border border-ocean/10 bg-white p-5"
        onSubmit={async (e) => {
          e.preventDefault();
          await onAction({ action: "createCategory", name, description, icon });
          setName("");
          setDescription("");
        }}
      >
        <h2 className="font-display text-xl font-semibold">Add category</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            required
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
          <select
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            className={inputClass}
          >
            {ICON_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`${inputClass} sm:col-span-2`}
            rows={2}
          />
        </div>
        <button
          type="submit"
          className="mt-4 rounded-xl bg-ocean px-4 py-2.5 text-sm font-semibold text-white"
        >
          Add category
        </button>
      </form>

      <ul className="space-y-2">
        {categories.map((c) => (
          <li
            key={c.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/80 px-4 py-3 ring-1 ring-ocean/8"
          >
            <div className="flex items-center gap-3">
              <CategoryIcon name={c.icon} className="h-5 w-5 text-ocean" />
              <div>
                <p className="font-semibold">{c.name}</p>
                {c.description && (
                  <p className="text-sm text-ink/55">{c.description}</p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                if (
                  confirm(`Delete category “${c.name}” and all its services?`)
                ) {
                  onAction({ action: "deleteCategory", id: c.id });
                }
              }}
              className="rounded-lg bg-coral/10 px-3 py-1.5 text-sm font-medium text-coral"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
