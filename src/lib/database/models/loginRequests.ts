import { Schema, model, models } from "mongoose";

const loginRequestSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  image: {
    type: String,
  },
  status: {
    type: String,
    default: "Pending",
  },
  time: {
    type: Date,
    default: new Date(),
  },
});

const LoginRequest = models.LoginRequest || model("LoginRequest", loginRequestSchema);

export default LoginRequest;
