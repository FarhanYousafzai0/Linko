import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/Models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    // Find user by email
    const findUser = await User.findOne({ email });
    if (!findUser) {
      return new Response(
        JSON.stringify({ error: "Invalid email or password" }),
        { status: 400 }
      );
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(password, findUser.password);
    if (!isPasswordCorrect) {
      return new Response(
        JSON.stringify({ error: "Invalid email or password" }),
        { status: 400 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: findUser._id, email: findUser.email },
      process.env.JWT_SEC,
      { expiresIn: "1d" }
    );

    return new Response(
      JSON.stringify({
        message: "Login successful",
        token,
        user: { id: findUser._id, email: findUser.email, name: findUser.name },
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
