import User from "@/lib/database/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { connectToDatabase } from "@/lib/database/database";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const reqBody = await req.json();
    const { name, email, password } = reqBody;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing Fields" }, { status: 400 });
    }

    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return NextResponse.json({ error: "User already exist" }, { status: 400 });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const savedUser = await new User({ name, email, password: hashedPassword }).save();

    return NextResponse.json({ message: "User created successfully", success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
