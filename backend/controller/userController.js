import prisma from "../db/db.js";
import bcrypt from "bcrypt"

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] }
    });
    if (existingUser) {
      return res.status(400).json({
        error: existingUser.username === username ? "Username already exists" : "Email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });
    res.status(201).json({ message: "User created", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", details: err });
  }
};

export const getUser=async(req,res)=>{
  try {
    const getAllUser=await prisma.user.findMany()
    res.status(200).json({message:"User found succesfully",getAllUser})
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error", details: error.message });
}

}

export const getUserbyId=async(req,res)=>{
  try {
    const {id}=req.params;
    const fetchUserbyId=await prisma.user.findUnique({
      where:{id:Number(id)}
   } )
   res.status(200).json({message:"User wit Id found",fetchUserbyId})
  } catch (error) {
     console.error(error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
}