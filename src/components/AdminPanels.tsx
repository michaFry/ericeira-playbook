"use client";

import { useState } from "react";
import { CategoryIcon, ICON_OPTIONS } from "@/components/CategoryIcon";
import type { Category, ServiceWithCategory } from "@/lib/types";

export const inputClass =
  "w-full rounded-xl border border-ocean/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-wave focus:ring-4 focus:ring-wave/15";

export function ServicesAdmin({
  categories,
  services,
  onAction,
}: {
  categories: Category[];
  services: ServiceWithCategory[];
  onAction: (payload: Record<string, unknown>) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [details, setDetails] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [url, setUrl] = useState("");
  const [filter, setFilter] = useState("");

  const filtered = services.filter((s) =>
    [s.name, s.details, s.category_name, s.phone, s.status]
      .join(" ")
      .toLowerCase()
      .includes(filter.toLowerCase())
  );

  return (
    <section className="space-y-6">
      <form
        className="rounded-2xl border border-ocean/10 bg-white p-5"
        onSubmit={async (e) => {
          e.preventDefault();
          await onAction({
            action: "createService",
            name,
            categoryId,
            details,
            phone,
            email,
            url,
          });
          setName("");
          setDetails("");
          setPhone("");
          setEmail("");
          setUrl("");
        }}
      >
        <h2 className="font-display text-xl font-semibold">Add service</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            required
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className={inputClass}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputClass}
          />
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
          <input
            placeholder="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className={`${inputClass} sm:col-span-2`}
          />
          <textarea
            placeholder="Details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className={`${inputClass} sm:col-span-2`}
            rows={2}
          />
        </div>
        <button
          type="submit"
          className="mt-4 rounded-xl bg-ocean px-4 py-2.5 text-sm font-semibold text-white"
        >
          Add
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
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/80 px-4 py-3 ring-1 ring-ocean/8"
          >
            <div>
              <p className="text-xs text-ocean">
                {s.category_name} · {s.status} · {s.votes} votes
              </p>
              <p className="font-semibold">{s.name}</p>
              {s.details && <p className="text-sm text-ink/55">{s.details}</p>}
            </div>
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
            placeholder="Description / tips (searchable)"
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
            className="flex flex-wrap items-start justify-between gap-3 rounded-2xl bg-white/80 px-4 py-3 ring-1 ring-ocean/8"
          >
            <div className="flex gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ocean/10 text-ocean">
                <CategoryIcon name={c.icon} className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">{c.name}</p>
                {c.description && (
                  <p className="mt-0.5 max-w-2xl text-sm text-ink/55">
                    {c.description}
                  </p>
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
