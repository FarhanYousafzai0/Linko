import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/Models/User";
import bcrypt from "bcryptjs";
import jwt  from "jsonwebtoken";


export async function POST(req) {

try {
    const {email,passoword} = req.json();

    await connectDB();

    // Find the email ,if it correct or not:
    const findUser = await User.findOne({email});
    if(!findUser){
        return new Response(JSON.stringify({error:"Invalid email or Password"}),{status:400})
    }

    // Check Password in the database :

    const IsPasswordCorrect = await bcrypt.compare(passoword,findUser.passoword);
    if(!IsPasswordCorrect){
        return new Response(JSON.stringify({error:"Invalid password or email"}),{status:400});
    }


    const token = jwt.sign(
        {id:findUser?._id ,email:findUser?.email},
        process.env.JWT_SEC,
        {expiresIn:'1d'}
    )

    return new Response(JSON.stringify({message:"Login Successfully"},token),{status:200})

    
} catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });

}    
}