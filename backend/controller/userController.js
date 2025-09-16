import prisma from "../db/db.js";
import bcrypt from "bcrypt"
import 'dotenv/config'
import jwt from "jsonwebtoken"

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

export const loginUser=async(req,res)=>{
  try {
    const{email,password}=req.body;
    if(!email||!password){
      return res.status(400).json({message:"fill all the field"})
    }
    const userExist=await prisma.user.findUnique({
      where:{email:String(email)}
    })
    if(!userExist){
      return res.status(404).json({message:"User dosent exist"})
    }
     const isMatch = await bcrypt.compare(password, userExist.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
     const token = jwt.sign(
      { id: userExist.id, email: userExist.email }, // payload
      process.env.JWT_SECRET,                       // secret key
      { expiresIn: "1h" }                           // expiry
    );
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: userExist.id,
        username: userExist.username,
        email: userExist.email,
      },
    });

  } catch (error) {
     console.error(error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
}

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

export const updateUser=async(req,res)=>{
  try {
    const {id}=req.params;
    const { username, email, password } = req.body;
    const userExist=await prisma.user.findFirst({
      where:{id:Number(id)}
    })
    if(!userExist){
      return res.status(404).json({message:"User dosent exist"})
    }
    const updatedUser=await prisma.user.update({
      where:{id:Number(id)},
      data: { username, email, password } 
    })
    res.status(200).json({message:"User updated succesfully"},updatedUser)
  } catch (error) {
     console.error(error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
}

export const deleteUser=async(req,res)=>{
  try {
    const {id}=req.params;
    const userExist=await prisma.user.findUnique({
      where:{id:Number(id)}
    })
    if(!userExist){
      return res.status(404).json({message:"User dosent exist"})
    }
    const removeUser=await prisma.user.delete({
      where:{id:Number(id)}
    })
    return res.status(200).json({message:"user deleted sucessfully"},removeUser)
  } catch (error) {
     console.error(error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
}