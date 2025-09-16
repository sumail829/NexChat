import express from "express";
import { deleteUser, getUser, getUserbyId, loginUser, registerUser, updateUser } from "../controller/userController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router=express.Router();

router.post("/user/create",registerUser);
router.post("/user/login",loginUser)
router.get("/user",verifyToken,getUser);
router.get("/user/:id",getUserbyId);
router.patch("/user/:id",updateUser);
router.delete("/user/:id",deleteUser);

export default router;