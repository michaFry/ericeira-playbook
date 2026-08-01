"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CategoriesAdmin, ServicesAdmin, inputClass } from "@/components/AdminPanels";
import type { Category, ServiceWithCategory } from "@/lib/types";

type AdminData = {
  categories: Category[];
  services: ServiceWithCategory[];
  pending: ServiceWithCategory[];
};

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [data, setData] = useState<AdminData | null>(null);
  const [tab, setTab] = useState<"pending" | "services" | "categories">(
    "pending"
  );
  const [message, setMessage] = useState("");

  async function load() {
    const res = await fetch("/api/admin/data");
    if (res.status === 401) {
      setAuthed(false);
      setData(null);
      return;
    }
    setAuthed(true);
    setData(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      setLoginError("Wrong password");
      return;
    }
    await load();
  }

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    setAuthed(false);
    setData(null);
  }

  async function adminAction(payload: Record<string, unknown>) {
    const res = await fetch("/api/admin/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setMessage(err.error || "Action failed");
      return;
    }
    setMessage("Saved");
    await load();
  }

  if (authed === null) {
    return (
      <main className="mx-auto max-w-md px-4 py-20 text-center text-ink/60">
        Loading…
      </main>
    );
  }

  if (!authed) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
        <Link href="/" className="mb-6 text-sm text-ocean">
          ← Back to playbook
        </Link>
        <form
          onSubmit={login}
          className="rounded-[1.75rem] border border-ocean/10 bg-white/80 p-8 shadow-xl"
        >
          <h1 className="font-display text-3xl font-semibold text-ink">Admin</h1>
          <p className="mt-2 text-sm text-ink/60">
            Manage categories, services and community proposals.
          </p>
          <label className="mt-6 block text-sm font-medium">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`mt-1.5 ${inputClass}`}
              autoFocus
            />
          </label>
          {loginError && <p className="mt-2 text-sm text-coral">{loginError}</p>}
          <button
            type="submit"
            className="mt-5 w-full rounded-2xl bg-ocean py-3 font-semibold text-white"
          >
            Enter
          </button>
        </form>
      </main>
    );
  }

  if (!data) return null;

  return (
    <main className="relative z-10 mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/" className="text-sm text-ocean">
            ← Playbook
          </Link>
          <h1 className="font-display mt-2 text-3xl font-semibold">Admin desk</h1>
        </div>
        <button
          type="button"
          onClick={logout}
          className="rounded-xl bg-white px-4 py-2 text-sm ring-1 ring-ocean/15"
        >
          Log out
        </button>
      </div>

      {message && (
        <p className="mb-4 rounded-xl bg-wave/10 px-4 py-2 text-sm text-ocean">
          {message}
        </p>
      )}

      <div className="mb-6 flex flex-wrap gap-2">
        {(
          [
            ["pending", `Proposals (${data.pending.length})`],
            ["services", `Services (${data.services.length})`],
            ["categories", `Categories (${data.categories.length})`],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              tab === id
                ? "bg-ocean text-white"
                : "bg-white text-ink ring-1 ring-ocean/10"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "pending" && (
        <section className="space-y-3">
          {data.pending.length === 0 && (
            <p className="rounded-2xl bg-white/70 p-8 text-center text-ink/50">
              No pending proposals.
            </p>
          )}
          {data.pending.map((s) => (
            <div
              key={s.id}
              className="rounded-2xl border border-sun/30 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ocean">
                    {s.category_name}
                  </p>
                  <h3 className="font-display text-xl font-semibold">{s.name}</h3>
                  {s.details && (
                    <p className="mt-1 text-sm text-ink/65">{s.details}</p>
                  )}
                  <p className="mt-2 text-xs text-ink/45">
                    {[s.phone, s.email, s.url, s.proposed_by && `by ${s.proposed_by}`]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      adminAction({
                        action: "setStatus",
                        id: s.id,
                        status: "approved",
                      })
                    }
                    className="rounded-xl bg-wave px-3 py-2 text-sm font-semibold text-white"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      adminAction({
                        action: "setStatus",
                        id: s.id,
                        status: "rejected",
                      })
                    }
                    className="rounded-xl bg-coral/90 px-3 py-2 text-sm font-semibold text-white"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {tab === "services" && (
        <ServicesAdmin
          categories={data.categories}
          services={data.services}
          onAction={adminAction}
        />
      )}

      {tab === "categories" && (
        <CategoriesAdmin
          categories={data.categories}
          onAction={adminAction}
        />
      )}
    </main>
  );
}
