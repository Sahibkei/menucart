import Link from "next/link";

type DirectoryBusiness = {
  businessName: string;
  username: string;
  category: string;
  city?: string;
  shortDescription?: string;
  heroImage?: string;
};

async function fetchFeaturedBusinesses(): Promise<DirectoryBusiness[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

  try {
    const res = await fetch(`${baseUrl}/api/directory/businesses?limit=3`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return data.businesses ?? [];
  } catch (error) {
    console.error("Failed to load featured businesses", error);
    return [];
  }
}

export default async function Page() {
  const businesses = await fetchFeaturedBusinesses();

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <header className="flex flex-col gap-4 pb-10 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Menu Cart</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Discover, list, and manage restaurant menus.
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-600">
              Showcase your restaurant, reach new diners, and keep menus updated in one place.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="rounded-lg border border-slate-200 px-4 py-2 text-slate-800 shadow-sm transition hover:border-indigo-200 hover:text-indigo-700"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-white shadow-md transition hover:bg-indigo-700"
            >
              Get started
            </Link>
          </div>
        </header>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-slate-900">Featured Restaurants</h2>
            <Link href="/directory" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
              View all
            </Link>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {businesses.length === 0 && (
              <p className="col-span-full rounded-lg bg-slate-50 p-4 text-slate-600">
                No featured restaurants yet. Check back soon!
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
                    {business.shortDescription || "Discover signature dishes and curated menus."}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
