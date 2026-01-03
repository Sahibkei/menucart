import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { signSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { BusinessAccount } from "@/lib/models/business";

export const runtime = "nodejs";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password is required"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please check your email and password", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    await connectDB();

    const account = await BusinessAccount.findOne({ email: email.toLowerCase() });

    if (!account) {
      return NextResponse.json({ error: "Incorrect email or password" }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, account.passwordHash);

    if (!passwordMatch) {
      return NextResponse.json({ error: "Incorrect email or password" }, { status: 401 });
    }

    const token = await signSession({
      sub: account._id.toString(),
      role: "business",
      username: account.username,
      businessName: account.businessName,
    });

    cookies().set("mc_session", token, {
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
    console.error("Login failed", error);
    return NextResponse.json(
      { error: "Unable to log in right now. Please try again." },
      { status: 500 }
    );
  }
}
