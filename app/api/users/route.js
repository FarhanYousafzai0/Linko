import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/Models/UserModel";
import mongoose from "mongoose";



export async function GET() {
    await connectDB()

    const users = await User.find();

    return new Response(JSON.stringify(users),{status:200})
    
}