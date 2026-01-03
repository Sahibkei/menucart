import { Schema, model, models, type Document, type Model } from "mongoose";

export interface BusinessAccountDocument extends Document {
  businessName: string;
  username: string;
  category: string;
  country: string;
  city?: string;
  shortDescription?: string;
  tags?: string[];
  heroImage?: string;
  email: string;
  passwordHash: string;
  role: "business";
  status: "active" | "pending" | "disabled";
  createdAt: Date;
  updatedAt: Date;
}

const BusinessAccountSchema = new Schema<BusinessAccountDocument>(
  {
    businessName: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    city: { type: String, trim: true },
    shortDescription: { type: String, trim: true },
    tags: [{ type: String }],
    heroImage: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["business"], default: "business", required: true },
    status: { type: String, enum: ["active", "pending", "disabled"], default: "active" },
  },
  { timestamps: true }
);

BusinessAccountSchema.index({ email: 1 }, { unique: true });
BusinessAccountSchema.index({ username: 1 }, { unique: true });

export const BusinessAccount: Model<BusinessAccountDocument> =
  models.BusinessAccount || model<BusinessAccountDocument>("BusinessAccount", BusinessAccountSchema);
