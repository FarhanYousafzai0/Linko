import { connectDB } from "@/app/lib/mongodb"
import User from "@/app/Models/User";
import bcrypt from "bcryptjs";




export async function POST(req) {

    await connectDB();
    try {
        const {name,email,passoword} = req.json();

   const existingUser = await User.findOne({email});

   if(existingUser){
    return new Response(JSON.stringify({error:"User already exist"}),{status:400});
   }
    
   const hashPassword = await bcrypt.hash(passoword,10);


   const newUser = await User.create({
    name,
    email,
    password:hashPassword
   })


   return new Response(JSON.stringify({message:"User created Successfully"}),{status:200})

    } catch (error) {
        return new Response(JSON.stringify({error:error.message}),{status:500})
    }
    
}