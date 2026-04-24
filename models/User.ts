import mongoose, { Schema, type Document, type Model } from "mongoose";
import { USER_ROLES, type UserRole } from "../src/shared/types/roles";

export type UserDocument = Document & {
  name: string;
  email: string;
  password: string | null;
  image: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
};

const UserSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, default: null },
    image: { type: String, default: null },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.USER,
    },
  },
  { timestamps: true }
);

const User: Model<UserDocument> =
  mongoose.models.User ?? mongoose.model<UserDocument>("User", UserSchema);

export default User;
