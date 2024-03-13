import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    id: {
      type: String,
    },
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
  { timestamps: true, collectionOptions: { changeStreamPreAndPostImages: { enabled: true } } }
);

const User = models.User || model("User", UserSchema);

export default User;
