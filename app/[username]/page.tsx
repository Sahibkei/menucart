import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { BusinessAccount } from "@/lib/models/business";

interface PageProps {
  params: { username: string };
}

export default async function BusinessProfilePage({ params }: PageProps) {
  await connectDB();
  const businessDoc = await BusinessAccount.findOne({ username: params.username, status: "active" });

  if (!businessDoc) {
    notFound();
  }

  const business = businessDoc.toObject();

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-100 px-4 py-10">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="h-64 w-full bg-slate-100">
          {business.heroImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={business.heroImage} alt={business.businessName} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-lg text-slate-500">
              {business.businessName}
            </div>
          )}
        </div>
        <div className="space-y-3 p-6">
          <h1 className="text-3xl font-bold text-slate-900">{business.businessName}</h1>
          <p className="text-sm text-slate-600">@{business.username}</p>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-700">
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-indigo-700">{business.category}</span>
            {business.city && <span className="rounded-full bg-slate-100 px-3 py-1">{business.city}</span>}
            <span className="rounded-full bg-slate-100 px-3 py-1">{business.country}</span>
          </div>
          <p className="text-base text-slate-700">
            {business.shortDescription || "Explore our signature dishes and curated dining experiences."}
          </p>
          {business.tags?.length ? (
            <div className="flex flex-wrap gap-2 pt-2 text-sm text-slate-600">
              {business.tags.map((tag: string) => (
                <span key={tag} className="rounded-full bg-slate-100 px-3 py-1">
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
