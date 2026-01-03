import Link from "next/link";

type DirectoryBusiness = {
  businessName: string;
  username: string;
  category: string;
  city?: string;
  shortDescription?: string;
  heroImage?: string;
};

async function fetchBusinesses(): Promise<DirectoryBusiness[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

  try {
    const res = await fetch(`${baseUrl}/api/directory/businesses`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.businesses ?? [];
  } catch (error) {
    console.error("Failed to load directory", error);
    return [];
  }
}

export default async function DirectoryPage() {
  const businesses = await fetchBusinesses();

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-100 px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Directory</p>
            <h1 className="text-3xl font-bold text-slate-900">Explore restaurants</h1>
            <p className="text-sm text-slate-600">Discover businesses using Menu Cart.</p>
          </div>
          <Link
            href="/signup"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            List your restaurant
          </Link>
      </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {businesses.length === 0 && (
            <p className="col-span-full rounded-lg bg-slate-50 p-4 text-slate-600">
              No restaurants found yet. Be the first to join!
            </p>
          )}

          {businesses.map((business) => (
            <article
              key={business.username}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="h-40 w-full bg-slate-100">
                {business.heroImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={business.heroImage}
                    alt={business.businessName}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-500">
                    {business.businessName}
                  </div>
                )}
              </div>
              <div className="space-y-2 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{business.businessName}</h3>
                    <p className="text-sm text-slate-600">@{business.username}</p>
                  </div>
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                    {business.category}
                  </span>
                </div>
                {business.city && <p className="text-sm text-slate-600">{business.city}</p>}
                <p className="text-sm text-slate-700">
                  {business.shortDescription || "Delicious meals and curated menus."}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
