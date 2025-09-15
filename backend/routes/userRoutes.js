import express from "express";
import { getUser, getUserbyId, registerUser } from "../controller/userController.js";


const router=express.Router();

router.post("/user/create",registerUser);
router.get("/user",getUser);
router.get("/user/:id",getUserbyId);

export default router;