"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type FieldErrors = Record<string, string>;

type RegistrationPayload = {
  businessName: string;
  username: string;
  category: string;
  country: string;
  email: string;
  confirmEmail: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
};

const defaultPayload: RegistrationPayload = {
  businessName: "",
  username: "",
  category: "",
  country: "",
  email: "",
  confirmEmail: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
};

export default function SignupPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"business" | "user">("business");
  const [formState, setFormState] = useState<RegistrationPayload>({ ...defaultPayload });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [robotChecked, setRobotChecked] = useState(false);

  const canSubmit = useMemo(() => formState.acceptTerms && activeTab === "business", [activeTab, formState.acceptTerms]);

  const updateField = (key: keyof RegistrationPayload, value: string | boolean) => {
    setFormState((prev) => ({ ...prev, [key]: value } as RegistrationPayload));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (activeTab !== "business") return;

    setSubmitting(true);
    setFormError(null);
    setErrors({});

    try {
      const res = await fetch("/api/auth/business/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const validation = (data?.details as Record<string, { _errors?: string[] }>) || {};
        const formatted: FieldErrors = {};
        Object.entries(validation).forEach(([field, info]) => {
          if (info?._errors?.length) {
            formatted[field] = info._errors[0];
          }
        });
        setErrors(formatted);
        setFormError(data.error || "Could not complete registration.");
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setFormError("Unexpected error. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-slate-100 px-4 py-12">
      <div className="w-full max-w-3xl rounded-2xl bg-white p-8 shadow-md">
        <div className="mb-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Menu Cart</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Create your account</h1>
          <p className="mt-1 text-sm text-slate-600">Join as a business to manage your restaurant profile and menus.</p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
          <button
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              activeTab === "business" ? "bg-white text-slate-900 shadow" : "text-slate-600"
            }`}
            onClick={() => setActiveTab("business")}
            type="button"
          >
            Business Account
          </button>
          <button
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              activeTab === "user" ? "bg-white text-slate-900 shadow" : "text-slate-600"
            }`}
            onClick={() => setActiveTab("user")}
            type="button"
          >
            User Account
          </button>
        </div>

        {activeTab === "user" && (
          <div className="mb-4 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
            User accounts are coming soon. Switch to the Business tab to get started today.
          </div>
        )}

        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <div className="md:col-span-1">
            <label className="text-sm font-medium text-slate-800" htmlFor="businessName">
              Business name
            </label>
            <input
              id="businessName"
              className={`mt-2 w-full rounded-lg border px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
                errors.businessName ? "border-red-300" : "border-slate-200"
              }`}
              value={formState.businessName}
              onChange={(e) => updateField("businessName", e.target.value)}
              required
            />
            {errors.businessName && <p className="mt-1 text-xs text-red-600">{errors.businessName}</p>}
          </div>

          <div className="md:col-span-1">
            <label className="text-sm font-medium text-slate-800" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              className={`mt-2 w-full rounded-lg border px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
                errors.username ? "border-red-300" : "border-slate-200"
              }`}
              value={formState.username}
              onChange={(e) => updateField("username", e.target.value)}
              placeholder="your-restaurant"
              required
            />
            {errors.username && <p className="mt-1 text-xs text-red-600">{errors.username}</p>}
          </div>

          <div className="md:col-span-1">
            <label className="text-sm font-medium text-slate-800" htmlFor="category">
              Category
            </label>
            <input
              id="category"
              className={`mt-2 w-full rounded-lg border px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
                errors.category ? "border-red-300" : "border-slate-200"
              }`}
              value={formState.category}
              onChange={(e) => updateField("category", e.target.value)}
              placeholder="e.g. Sushi, BBQ, Vegan"
              required
            />
            {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category}</p>}
          </div>

          <div className="md:col-span-1">
            <label className="text-sm font-medium text-slate-800" htmlFor="country">
              Country
            </label>
            <input
              id="country"
              className={`mt-2 w-full rounded-lg border px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
                errors.country ? "border-red-300" : "border-slate-200"
              }`}
              value={formState.country}
              onChange={(e) => updateField("country", e.target.value)}
              required
            />
            {errors.country && <p className="mt-1 text-xs text-red-600">{errors.country}</p>}
          </div>

          <div className="md:col-span-1">
            <label className="text-sm font-medium text-slate-800" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={`mt-2 w-full rounded-lg border px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
                errors.email ? "border-red-300" : "border-slate-200"
              }`}
              value={formState.email}
              onChange={(e) => updateField("email", e.target.value)}
              required
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>

          <div className="md:col-span-1">
            <label className="text-sm font-medium text-slate-800" htmlFor="confirmEmail">
              Confirm email
            </label>
            <input
              id="confirmEmail"
              type="email"
              className={`mt-2 w-full rounded-lg border px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
                errors.confirmEmail ? "border-red-300" : "border-slate-200"
              }`}
              value={formState.confirmEmail}
              onChange={(e) => updateField("confirmEmail", e.target.value)}
              required
            />
            {errors.confirmEmail && <p className="mt-1 text-xs text-red-600">{errors.confirmEmail}</p>}
          </div>

          <div className="md:col-span-1">
            <label className="text-sm font-medium text-slate-800" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className={`mt-2 w-full rounded-lg border px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
                errors.password ? "border-red-300" : "border-slate-200"
              }`}
              value={formState.password}
              onChange={(e) => updateField("password", e.target.value)}
              required
            />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
          </div>

          <div className="md:col-span-1">
            <label className="text-sm font-medium text-slate-800" htmlFor="confirmPassword">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className={`mt-2 w-full rounded-lg border px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
                errors.confirmPassword ? "border-red-300" : "border-slate-200"
              }`}
              value={formState.confirmPassword}
              onChange={(e) => updateField("confirmPassword", e.target.value)}
              required
            />
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
          </div>

          <div className="md:col-span-2 space-y-3">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                checked={robotChecked}
                onChange={(e) => setRobotChecked(e.target.checked)}
              />
              I&apos;m not a robot
            </label>

            <label className="flex items-start gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                checked={formState.acceptTerms}
                onChange={(e) => updateField("acceptTerms", e.target.checked)}
              />
              <span>
                I agree to the <a className="text-indigo-600" href="#">Terms of Service</a> and <a className="text-indigo-600" href="#">Privacy Policy</a>.
              </span>
            </label>
          </div>

          {formError && <p className="md:col-span-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">{formError}</p>}

          <div className="md:col-span-2">
            <button
              type="submit"
              className="flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={!canSubmit || submitting}
            >
              {submitting ? "Creating account..." : "Create account"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
