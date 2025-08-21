import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"



export const protectRoute = (req)=>{


    const token = req.headers.get("authorizations")?.split(" ")[1]

    if(!token){
        return NextResponse.json({error:"Un-autorized"},{status:401})
    }

    try {
        jwt.verify(token,process.env.JWT_SEC)
        return NextResponse.next()
    } catch (error) {
        return NextResponse.json({error:"Invalid Token"},{status:401})
    }
}

export const config = {

}