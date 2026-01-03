import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";
import { LogoutButton } from "./LogoutButton";

async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("mc_session")?.value;
  if (!token) return null;
  return verifySession(token);
}

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-100 px-4 py-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <header className="flex flex-col justify-between gap-4 rounded-2xl bg-white p-6 shadow-sm md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Dashboard</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Welcome back, {session.businessName}</h1>
            <p className="mt-1 text-sm text-slate-600">Manage your restaurant profile and keep menus up to date.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/${session.username}`}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              View public profile
            </Link>
            <LogoutButton />
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-600">Account</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">{session.businessName}</p>
            <p className="text-sm text-slate-600">@{session.username}</p>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-600">Role</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">Business</p>
            <p className="text-sm text-slate-600">Access to manage listings</p>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-600">Status</p>
            <p className="mt-2 text-xl font-semibold text-emerald-700">Active</p>
            <p className="text-sm text-slate-600">Your account is in good standing.</p>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Next steps</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li>• Add your menu items and update pricing.</li>
            <li>• Upload attractive photos to showcase dishes.</li>
            <li>• Share your public profile link with diners.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
