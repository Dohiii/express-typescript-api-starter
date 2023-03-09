import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import { z } from "zod";
import { CustomAPIError } from "../../shared/errors";

export interface UserInterface extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

const UserSchema = new Schema<UserInterface>(
  {
    name: {
      type: String,
      required: [true, "Please provide name"],
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "Please provide email"],
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
      minlength: 6,
      maxlength: 255,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

// Define a Zod schema for user data
const userSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6).max(255),
  role: z.enum(["admin", "user"]),
});

// Add a pre-save hook to hash the password
UserSchema.pre("save", async function (this: UserInterface, next) {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const isMatch = await bcrypt.compare(
    candidatePassword,
    this.password
  );
  return isMatch;
};

export const User = mongoose.model("User", UserSchema);

// Validate user data before saving to the database
export const validateUser = (userData: any) => {
  try {
    return userSchema.parse(userData);
  } catch (error: any) {
    throw new CustomAPIError(
      "ValidationError",
      error.errors,
      400,
      true
    );
  }
};
