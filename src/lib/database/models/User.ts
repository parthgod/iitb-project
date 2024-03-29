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
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
    },
    latestLoginTime: {
      type: Date,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, collectionOptions: { changeStreamPreAndPostImages: { enabled: true } } }
);

const User = models.User || model("User", UserSchema);

export default User;
