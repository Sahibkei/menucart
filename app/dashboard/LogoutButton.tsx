"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-indigo-200 hover:text-indigo-700"
      disabled={loading}
    >
      {loading ? "Signing out..." : "Logout"}
    </button>
  );
}
