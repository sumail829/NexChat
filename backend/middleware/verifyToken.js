import jwt from "jsonwebtoken";
import 'dotenv/config'

export const verifyToken=async(req,res,next)=>{
  
       const authHeader=req.headers["authorization"];
       const token=authHeader && authHeader.split(" ")[1];
       
       if(!token){
        return res.status(401).json({message:"Access Denied...No token provided"})
       }
 try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user { id, email }
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};