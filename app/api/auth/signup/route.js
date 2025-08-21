import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/Models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await connectDB();

  try {
    const { name, email, password } = await req.json();

    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({ error: "User already exists" }),
        { status: 400 }
      );
    }

    // hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // create user
    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
    });

    // don’t return password

    return new Response(JSON.stringify(newUser), { status: 201 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
