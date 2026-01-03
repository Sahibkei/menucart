import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { signSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { BusinessAccount } from "@/lib/models/business";

export const runtime = "nodejs";

const registrationSchema = z
  .object({
    businessName: z.string().min(2, "Business name is required"),
    username: z
      .string()
      .min(3, "Username is required")
      .regex(/^[a-z0-9-]+$/, "Username can only include lowercase letters, numbers, and hyphens"),
    category: z.string().min(1, "Category is required"),
    country: z.string().min(1, "Country is required"),
    email: z.string().email("A valid email is required"),
    confirmEmail: z.string().email("Confirmation email is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm your password"),
    acceptTerms: z.boolean().refine((val) => val === true, "You must accept the terms"),
  })
  .superRefine((data, ctx) => {
    if (data.email !== data.confirmEmail) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmEmail"],
        message: "Emails do not match",
      });
    }

    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }
  });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registrationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please fix the highlighted issues", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { businessName, username, category, country, email, password } = parsed.data;

    await connectDB();

    const existing = await BusinessAccount.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
    });

    if (existing) {
      const conflictField = existing.email === email.toLowerCase() ? "email" : "username";
      return NextResponse.json(
        { error: conflictField === "email" ? "Email already registered" : "Username already taken" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const account = await BusinessAccount.create({
      businessName,
      username: username.toLowerCase(),
      category,
      country,
      email: email.toLowerCase(),
      passwordHash,
      role: "business",
    });

    const token = await signSession({
      sub: account._id.toString(),
      role: "business",
      username: account.username,
      businessName: account.businessName,
    });

    const cookieStore = await cookies();

    cookieStore.set("mc_session", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({
      id: account._id.toString(),
      businessName: account.businessName,
      username: account.username,
      email: account.email,
    });
  } catch (error) {
    console.error("Registration failed", error);
    return NextResponse.json(
      { error: "Unable to create account right now. Please try again." },
      { status: 500 }
    );
  }
}
