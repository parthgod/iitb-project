import { Schema, model, models } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password?: string;
  isAdmin: boolean;
  image?: string;
}

const UserSchema = new Schema(
  {
    name: {
      type: String,
      default: "Anonymous",
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);

export default User;
