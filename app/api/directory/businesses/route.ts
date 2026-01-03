import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { BusinessAccount } from "@/lib/models/business";

export const runtime = "nodejs";

async function seedBusinesses() {
  if (process.env.NODE_ENV === "production") return;

  const existingCount = await BusinessAccount.countDocuments();
  if (existingCount > 0) return;

  const passwordHash = await bcrypt.hash("Password123!", 10);

  const seedData = [
    {
      businessName: "The Green Bite",
      username: "green-bite",
      category: "Healthy",
      country: "USA",
      city: "San Francisco",
      shortDescription: "Fresh, plant-forward meals crafted daily.",
      tags: ["vegan", "salads", "bowls"],
      heroImage: "/images/green-bite.svg",
      email: "hello@greenbite.test",
      passwordHash,
      role: "business" as const,
    },
    {
      businessName: "Smoky Grill House",
      username: "smoky-grill-house",
      category: "BBQ",
      country: "USA",
      city: "Austin",
      shortDescription: "Low and slow smoked classics with a modern twist.",
      tags: ["bbq", "comfort", "brisket"],
      heroImage: "/images/smoky-grill-house.svg",
      email: "pit@smokygrill.test",
      passwordHash,
      role: "business" as const,
    },
    {
      businessName: "Sushi Zen",
      username: "sushi-zen",
      category: "Japanese",
      country: "Japan",
      city: "Tokyo",
      shortDescription: "Elegant sushi and sashimi crafted by master chefs.",
      tags: ["sushi", "omakase", "fish"],
      heroImage: "/images/sushi-zen.svg",
      email: "booking@sushizen.test",
      passwordHash,
      role: "business" as const,
    },
  ];

  await BusinessAccount.insertMany(seedData, { ordered: false });
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    await seedBusinesses();

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    const category = searchParams.get("category");
    const city = searchParams.get("city");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const query: Record<string, unknown> = { status: "active" };

    if (q) {
      query.$or = [
        { businessName: { $regex: q, $options: "i" } },
        { username: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ];
    }

    if (category) {
      query.category = { $regex: category, $options: "i" };
    }

    if (city) {
      query.city = { $regex: city, $options: "i" };
    }

    const businesses = await BusinessAccount.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("businessName username category city shortDescription tags heroImage");

    return NextResponse.json({ businesses });
  } catch (error) {
    console.error("Directory fetch failed", error);
    return NextResponse.json({ error: "Unable to load directory." }, { status: 500 });
  }
}
