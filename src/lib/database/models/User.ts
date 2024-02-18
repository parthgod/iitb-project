import { Schema, model, models } from "mongoose";

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
      //   required: [true, "Password must be provided"],
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
