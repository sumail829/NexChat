import jwt from "jsonwebtoken";
import 'dotenv/config'

export const verifyToken=async(req,res,next)=>{
    try {
       const authHeader=req.headers["authorization"];
       const token=authHeader && authHeader.split(" ")[1];
       
       if(!token){
        return res.status(401).json({message:"Access Denied...No token provided"})
       }

       jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
        if(err)
            return res.status(403).json({message:"Invalid or expired token"});
     

       req.user=decoded;
       next(); 
     })
    } catch (error) {
        console.error("Token verification error:", error);
    res.status(500).json({ message: "Server error", details: error.message });
    }
}